import nodemailer from 'nodemailer';
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
    return ['Lead Status: Step 1 Lead Capture (Contact & Venue Type captured, details pending)'];
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
    const venueLabel = VENUE_LABEL[p.formType] || p.event || 'Venue Enquiry';
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
      `Lead Type: ${p.isPartial ? 'Step 1 capture (partial)' : 'Complete lead'}`,
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
    if (!formType && !event) {
      return Response.json(
        { error: 'Venue type is required.' },
        { status: 400 }
      );
    }

    const venueLabel = VENUE_LABEL[formType] || event || 'Venue Enquiry';
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

    const emailHtml = `
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

    const textSummary = venueDetailsLines(payload).join(' | ');
    try {
      await transporter.sendMail({
        from: `"BookMyCorporateParty Enquiry" <${process.env.NEXT_PUBLIC_EMAIL_USER}>`,
        to: process.env.NEXT_PUBLIC_EMAIL_RECEIVER,
        subject: `🎉 Congratulations on your new lead! - ${name}`,
        html: emailHtml,
        text: `[Source: ${subdomainSource}] New ${venueLabel} enquiry${statusSuffix} from ${name} (${phone}, ${email || 'no-email'}). Source: ${source || '—'}. ${textSummary}. User Location: ${userLocation || 'Unknown'}. IP: ${userIp || 'Unknown'}. Submitted: ${indianTime}`,
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
        formType: venueLabel + statusSuffix,
        name,
        phone,
        email: email || '',
        source: source || '',
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
        pageSource: `${subdomainSource} - ${formType ? (isPartial ? 'Hero Form (Partial Step 1)' : 'Hero Form (Dynamic)') : 'WhatsApp Popup'}`,
      },
      formType ? `${formType} enquiry` : 'wa popup enquiry'
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
