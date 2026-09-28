import nodemailer from 'nodemailer';
import path from 'path';
import { sendToGoogleSheets } from '../../../lib/googleSheetsClient';

const ODOO_URL = process.env.ODOO_URL || 'https://dream-big-event-management-pvt.odoo.com';
const ODOO_DB = process.env.ODOO_DB || 'dream-big-event-management-pvt';
const ODOO_USERNAME = process.env.ODOO_USERNAME || 'info@bookmycorporateparty.com';
const ODOO_API_KEY = process.env.ODOO_API_KEY || '358e433cc6ce125fa09a04e47f5573401bdd73cd';

const VENUE_LABEL = {
  villa: 'Villa / Resort',
  lounge: 'Lounge',
  banquet: 'Banquet',
  nightclub: 'Night Club',
  catering: 'Catering',
};

function xmlRpc(endpoint, method, params) {
  const toXml = (val) => {
    if (val === null || val === undefined) return '<value><boolean>0</boolean></value>';
    if (typeof val === 'boolean') return `<value><boolean>${val ? 1 : 0}</boolean></value>`;
    if (typeof val === 'number' && Number.isInteger(val)) return `<value><int>${val}</int></value>`;
    if (typeof val === 'string') return `<value><string>${val.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</string></value>`;
    if (Array.isArray(val)) return `<value><array><data>${val.map(toXml).join('')}</data></array></value>`;
    if (typeof val === 'object') {
      const members = Object.entries(val).map(([k, v]) => `<member><name>${k}</name>${toXml(v)}</member>`).join('');
      return `<value><struct>${members}</struct></value>`;
    }
    return `<value><string>${val}</string></value>`;
  };
  const body = `<?xml version="1.0"?><methodCall><methodName>${method}</methodName><params>${params.map(p => `<param>${toXml(p)}</param>`).join('')}</params></methodCall>`;
  return fetch(`${ODOO_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/xml', 'Accept': 'text/xml' },
    body,
  }).then(async r => {
    const text = await r.text();
    if (text.includes('<fault>')) {
      const faultStr = text.match(/<name>faultString<\/name>[\s\S]*?<string>([\s\S]*?)<\/string>/);
      throw new Error(`Odoo fault: ${faultStr ? faultStr[1] : text}`);
    }
    const intMatch = text.match(/<value><int>(\d+)<\/int><\/value>/);
    if (intMatch) return parseInt(intMatch[1], 10);
    const strMatch = text.match(/<string>([\s\S]*?)<\/string>/);
    if (strMatch) return strMatch[1];
    return null;
  });
}

function venueDetailsLines(p) {
  if (p.isPartial) {
    return [
      'Lead Status: Partial Lead Capture (Contact captured, details pending)',
      ...(p.occasion ? [`Occasion: ${p.occasion}`] : []),
    ];
  }
  if (p.occasion) {
    return [
      `Occasion: ${p.occasion}`,
      ...(p.date ? [`Date: ${p.date}`] : []),
      ...(p.noOfPeople ? [`No. of People: ${p.noOfPeople}`] : []),
    ];
  }
  const t = p.formType;
  if (t === 'villa') {
    const lines = [
      `Check-In: ${p.checkInDate || '—'}`,
      `Check-Out: ${p.checkOutDate || '—'}`,
      `Total Pax: ${p.totalPax || '—'}`,
      `Food: ${p.food || '—'}`,
      `Pricing Confirmed: ${p.pricingAccepted ? 'Yes' : 'No'}`,
    ];
    return lines;
  }
  if (t === 'lounge' || t === 'nightclub') {
    return [
      `Date: ${p.date || '—'}`,
      `Day: ${p.day || '—'}`,
      `No. of People: ${p.noOfPeople || '—'}`,
      `Location: ${p.location || '—'}`,
      `Budget (Food only): ₹${p.budgetOnlyFood || '—'}`,
      `Budget (With Drinks): ₹${p.budgetWithDrinks || '—'}`,
      `Type of Meal: ${p.typeOfMeal || '—'}`,
    ];
  }
  if (t === 'banquet' || t === 'catering') {
    return [
      `Date: ${p.date || '—'}`,
      `Day: ${p.day || '—'}`,
      `No. of People: ${p.noOfPeople || '—'}`,
      `Location: ${p.location || '—'}`,
      `Food Type: ${p.foodType || '—'}`,
      `Budget: ₹${p.budget || '—'}`,
    ];
  }
  // Legacy fallback (WA popup)
  return [
    `Event: ${p.event || 'Not specified'}`,
    `City: ${p.city || 'Mumbai'}`,
    `Date: ${p.date || p.venueDate || 'Not specified'}`,
  ];
}

function venueDetailsHtml(p) {
  return venueDetailsLines(p)
    .map(line => {
      const idx = line.indexOf(':');
      if (idx < 0) return `<p style="margin: 0 0 8px;">${line}</p>`;
      const label = line.slice(0, idx);
      const value = line.slice(idx + 1).trim();
      return `<p style="margin: 0 0 8px;"><strong>${label}:</strong> ${value}</p>`;
    })
    .join('');
}

async function pushToOdoo(p, subdomainSource) {
  try {
    const venueLabel = p.occasion || VENUE_LABEL[p.formType] || p.event || 'Venue Enquiry';
    const uid = await xmlRpc('/xmlrpc/2/common', 'authenticate', [ODOO_DB, ODOO_USERNAME, ODOO_API_KEY, {}]);
    if (!uid) return;
    const leadName = `[${subdomainSource}] ${venueLabel} — ${p.city || 'Mumbai'}${p.isPartial ? ' (Partial Capture)' : ''}`;
    const utmLines = [];
    if (p.utmSource)   utmLines.push(`UTM Source: ${p.utmSource}`);
    if (p.utmMedium)   utmLines.push(`UTM Medium: ${p.utmMedium}`);
    if (p.utmCampaign) utmLines.push(`UTM Campaign: ${p.utmCampaign}`);
    if (p.utmTerm)     utmLines.push(`UTM Term: ${p.utmTerm}`);
    if (p.utmContent)  utmLines.push(`UTM Content: ${p.utmContent}`);
    if (p.gclid)       utmLines.push(`GCLID: ${p.gclid}`);

    const notes = [
      `Phone: ${p.phone}`,
      `Email: ${p.email || '—'}`,
      `Source (Heard via): ${p.source || '—'}`,
      `Domain Source: ${subdomainSource}`,
      `Venue Type: ${venueLabel}`,
      `Lead Type: ${p.isPartial ? 'Partial capture' : 'Complete lead'}`,
      ...venueDetailsLines(p),
      ...(utmLines.length ? ['--- Ad Tracking ---', ...utmLines] : []),
      `WhatsApp Updates: ${p.whatsapp ? 'Yes' : 'No'}`,
      `User Location: ${p.userLocation || 'Unknown'}`,
      `Submitted via: Website Form`,
    ].join('\n');

    const leadFields = {
      name: leadName,
      contact_name: p.name,
      phone: p.phone,
      description: notes,
      city: p.city || 'Mumbai',
      type: 'opportunity',
    };
    if (p.email) leadFields.email_from = p.email;

    await xmlRpc('/xmlrpc/2/object', 'execute_kw', [
      ODOO_DB, uid, ODOO_API_KEY,
      'crm.lead', 'create',
      [leadFields],
      {},
    ]);
  } catch (err) {
    console.error('[Odoo] Error:', err);
  }
}

const getIndianTime = () => {
  const now = new Date();
  const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const day = String(istTime.getUTCDate()).padStart(2, '0');
  const month = String(istTime.getUTCMonth() + 1).padStart(2, '0');
  const year = istTime.getUTCFullYear();
  let hours = istTime.getUTCHours();
  const minutes = String(istTime.getUTCMinutes()).padStart(2, '0');
  const seconds = String(istTime.getUTCSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${day}/${month}/${year}, ${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm} (IST)`;
};

export async function POST(req) {
  try {
    const host = req.headers.get('host') || '';
    let subdomainSource = 'ads';
    if (host.includes('page.bookmycorporateparty.com')) {
      subdomainSource = 'page.book';
    } else if (host.includes('ads.bookmycorporateparty.com')) {
      subdomainSource = 'ads';
    }

    const payload = await req.json();
    const {
      name,
      phone,
      email,
      source,
      formType,
      occasion,
      event,
      city,
      date,
      whatsapp,
      userLocation,
      userPincode,
      userIp,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      gclid,
      isPartial,
    } = payload;

    const hasUtm = !!(utmSource || utmMedium || utmCampaign || gclid);

    if (!name || !phone) {
      return Response.json(
        { error: 'Name and phone are required.' },
        { status: 400 }
      );
    }
    if (formType && (!email || !source)) {
      return Response.json(
        { error: 'Email and source are required.' },
        { status: 400 }
      );
    }
    if (!occasion && !formType && !event) {
      return Response.json(
        { error: 'Occasion or venue type is required.' },
        { status: 400 }
      );
    }

    const isWaInquiry = !isPartial && !!(payload.isWaInquiry || (!formType && !occasion && (event === 'WhatsApp Inquiry' || !email)));
    const venueLabel = occasion || VENUE_LABEL[formType] || event || 'Corporate Party Enquiry';
    const indianTime = getIndianTime();
    const statusSuffix = isPartial ? ' (Partial Lead)' : '';

    // 1. Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NEXT_PUBLIC_EMAIL_USER,
        pass: process.env.NEXT_PUBLIC_EMAIL_APP_PASSWORD,
      },
    });

    const attachments = [];
    if (isWaInquiry) {
      const waLogoPath = path.join(process.cwd(), 'public/images/whatsapp-icon-transparent.png');
      attachments.push({
        filename: 'whatsapp-icon.png',
        path: waLogoPath,
        cid: 'whatsapplogo',
      });
    }

    let emailHtml = '';

    if (isWaInquiry) {
      const venueTypeText = event && event !== 'WhatsApp Inquiry' ? event : 'Not specified';
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            @media only screen and (max-width: 600px) {
              .email-container { width: 100% !important; max-width: 100% !important; border-radius: 0 !important; }
              .header-padding { padding: 20px 16px !important; }
              .body-padding { padding: 22px 16px !important; }
              .title-text { font-size: 17px !important; line-height: 1.3 !important; }
              .logo-img { width: 34px !important; height: 34px !important; }
              .logo-td { width: 36px !important; }
              .title-td { padding-left: 4px !important; }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 10px; background-color: #f3f4f6; font-family: Arial, sans-serif;">
          <div class="email-container" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            
            <div class="header-padding" style="background: #25D366; padding: 24px 28px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                <tr>
                  <td class="logo-td" style="vertical-align: middle; width: 36px;">
                    <img class="logo-img" src="cid:whatsapplogo" alt="WhatsApp" style="width: 28px; height: 28px; display: block; background: transparent; border: 0;" />
                  </td>
                  <td class="title-td" style="vertical-align: middle; padding-left: 8px;">
                    <h2 class="title-text" style="color: #ffffff; margin: 0; font-size: 19px; font-weight: bold; line-height: 1.3; font-family: Arial, sans-serif;">
                      New WhatsApp Inquiry — BookMyCorporateParty
                    </h2>
                  </td>
                </tr>
              </table>
              <p style="color: rgba(255,255,255,0.92); margin: 8px 0 0; font-size: 12.5px; font-family: Arial, sans-serif;">
                Received at ${indianTime} via ${subdomainSource}
              </p>
            </div>

            <div class="body-padding" style="padding: 28px 28px; background: #ffffff;">
              <h3 style="color: #128C7E; margin: 0 0 18px; font-size: 16px; border-bottom: 2px solid #E8F5E9; padding-bottom: 10px; font-family: Arial, sans-serif;">
                WhatsApp Inquiry Details
              </h3>
              <p style="margin: 0 0 12px; font-size: 15px; color: #1F2937; line-height: 1.5; font-family: Arial, sans-serif;">
                <strong>Your Name:</strong> ${name}
              </p>
              <p style="margin: 0 0 12px; font-size: 15px; color: #1F2937; line-height: 1.5; font-family: Arial, sans-serif;">
                <strong>Phone / WhatsApp:</strong> ${phone}
              </p>
              <p style="margin: 0 0 12px; font-size: 15px; color: #1F2937; line-height: 1.5; font-family: Arial, sans-serif;">
                <strong>Venue Type:</strong> ${venueTypeText}
              </p>
            </div>

            <div style="background: #f9fafb; padding: 16px 24px; text-align: center; font-size: 12px; color: #9CA3AF; border-top: 1px solid #f3f4f6; font-family: Arial, sans-serif;">
              BookMyCorporateParty · Mumbai's #1 Corporate Party Platform
            </div>

          </div>
        </body>
        </html>
      `;
    } else {
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
          <div style="background: #80281F; padding: 24px 32px;">
            <h2 style="color: #fff; margin: 0; font-size: 20px; font-weight: bold;">🎉 Congratulations on your new lead!</h2>
            <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 13px;">Received at ${indianTime} via ${subdomainSource}</p>
          </div>
          <div style="padding: 28px 32px; background: #fff;">
            <div style="margin-bottom: 20px; padding: 12px 16px; background: #F9FAFB; border-left: 4px solid #80281F; border-radius: 4px; font-size: 14px; font-weight: bold; color: #374151;">
              New ${venueLabel} Enquiry${statusSuffix} — BookMyCorporateParty [${subdomainSource}]
            </div>
            <h3 style="color: #80281F; margin: 0 0 16px; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Contact Details</h3>
            <p style="margin: 0 0 8px;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 0 0 8px;"><strong>WhatsApp Number:</strong> ${phone}</p>
            <p style="margin: 0 0 8px;"><strong>Email:</strong> ${email || '—'}</p>
            <p style="margin: 0 0 8px;"><strong>Heard About Us Via:</strong> ${source || '—'}</p>
            <p style="margin: 0 0 8px;"><strong>Domain Source:</strong> ${subdomainSource}</p>
            <p style="margin: 0 0 8px;"><strong>WhatsApp Updates:</strong> ${whatsapp ? 'Yes' : 'No'}</p>

            <h3 style="color: #80281F; margin: 24px 0 16px; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 10px;">${venueLabel} Details</h3>
            ${venueDetailsHtml(payload)}

            ${hasUtm ? `
            <h3 style="color: #80281F; margin: 24px 0 16px; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Ad / UTM Tracking</h3>
            <p style="margin: 0 0 8px;"><strong>UTM Source:</strong> ${utmSource || '—'}</p>
            <p style="margin: 0 0 8px;"><strong>UTM Medium:</strong> ${utmMedium || '—'}</p>
            <p style="margin: 0 0 8px;"><strong>UTM Campaign:</strong> ${utmCampaign || '—'}</p>
            <p style="margin: 0 0 8px;"><strong>UTM Term (keyword):</strong> ${utmTerm || '—'}</p>
            <p style="margin: 0 0 8px;"><strong>UTM Content (ad):</strong> ${utmContent || '—'}</p>
            ${gclid ? `<p style="margin: 0 0 8px;"><strong>GCLID:</strong> ${gclid}</p>` : ''}
            ` : ''}

            <h3 style="color: #80281F; margin: 24px 0 16px; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 10px;">User Location (Auto-Detected)</h3>
            <p style="margin: 0 0 8px;"><strong>Location:</strong> ${userLocation || 'Unknown'}</p>
            <p style="margin: 0 0 8px;"><strong>Pincode:</strong> ${userPincode || 'Unknown'}</p>
            <p style="margin: 0 0 8px;"><strong>IP Address:</strong> ${userIp || 'Unknown'}</p>
          </div>
          <div style="background: #f9f9f9; padding: 16px 32px; text-align: center; font-size: 12px; color: #999;">
            BookMyCorporateParty · Mumbai's #1 Corporate Party Platform
          </div>
        </div>
      `;
    }

    const textSummary = venueDetailsLines(payload).join(' | ');
    try {
      await transporter.sendMail({
        from: `"BookMyCorporateParty Enquiry" <${process.env.NEXT_PUBLIC_EMAIL_USER}>`,
        to: process.env.NEXT_PUBLIC_EMAIL_RECEIVER,
        subject: isWaInquiry ? `💬 New WhatsApp Inquiry from ${name}` : `🎉 Congratulations on your new lead! - ${name}`,
        html: emailHtml,
        text: isWaInquiry
          ? `New WhatsApp Inquiry from ${name} (${phone}). Venue Type: ${event && event !== 'WhatsApp Inquiry' ? event : 'Not specified'}. Received at: ${indianTime}`
          : `[Source: ${subdomainSource}] New ${venueLabel} enquiry${statusSuffix} from ${name} (${phone}, ${email || 'no-email'}). Source: ${source || '—'}. ${textSummary}. User Location: ${userLocation || 'Unknown'}. IP: ${userIp || 'Unknown'}. Submitted: ${indianTime}`,
        attachments,
      });
      console.log('[Submit Form API] ✅ Lead notification email sent successfully.');
    } catch (mailError) {
      console.warn('[Submit Form API] ⚠️ Email transport failed (SMTP keys likely missing in .env):', mailError.message);
    }

    // 2. Push to Odoo CRM (fire-and-forget)
    pushToOdoo(payload, subdomainSource);

    // 3. Send to Google Sheets
    await sendToGoogleSheets(
      {
        formType: (payload.occasion || venueLabel) + statusSuffix,
        occasion: payload.occasion || '',
        name,
        phone,
        email: email || '',
        source: source || 'Website',
        venueDetails: venueDetailsLines(payload).join(' | '),
        contactCity: city || payload.location || 'Mumbai',
        date: date || payload.checkInDate || '',
        day: payload.day || '',
        whatsapp: whatsapp ? 'Yes' : 'No',
        // Individual venue-specific keys (Apps Script can pick whichever it needs)
        checkInDate: payload.checkInDate || '',
        checkOutDate: payload.checkOutDate || '',
        totalPax: payload.totalPax || '',
        totalKids: payload.totalKids || '',
        kidsAge: payload.kidsAge || '',
        food: payload.food || '',
        pricingAccepted: payload.pricingAccepted ? 'Yes' : 'No',
        noOfPeople: payload.noOfPeople || '',
        location: payload.location || '',
        budgetOnlyFood: payload.budgetOnlyFood || '',
        budgetWithDrinks: payload.budgetWithDrinks || '',
        typeOfMeal: payload.typeOfMeal || '',
        foodType: payload.foodType || '',
        budget: payload.budget || '',
        // Auto-detected
        userLocation: userLocation || '',
        userPincode: userPincode || '',
        userIp: userIp || '',
        // UTM / ad tracking
        utmSource:   utmSource   || '',
        utmMedium:   utmMedium   || '',
        utmCampaign: utmCampaign || '',
        utmTerm:     utmTerm     || '',
        utmContent:  utmContent  || '',
        gclid:       gclid       || '',
        submittedAt: indianTime,
        pageSource: `${subdomainSource} - ${payload.occasion ? (isPartial ? 'Hero Form (Partial Lead)' : 'Hero Form (Occasion)') : formType ? (isPartial ? 'Hero Form (Partial Step 1)' : 'Hero Form (Dynamic)') : 'WhatsApp Popup'}`,
      },
      payload.occasion ? `${payload.occasion} enquiry` : formType ? `${formType} enquiry` : 'wa popup enquiry'
    );

    return Response.json({ success: true, message: 'Enquiry submitted! We will contact you within 30 minutes.' });
  } catch (error) {
    console.error('submit-form error:', error);
    return Response.json(
      { success: false, message: 'Something went wrong. Please try again or call us directly.' },
      { status: 500 }
    );
  }
}
