import { NextResponse } from 'next/server';

const VENUE_LABEL = {
  villa: 'Villa / Resort',
  lounge: 'Lounge',
  banquet: 'Banquet',
  nightclub: 'Night Club',
  catering: 'Catering',
};

export async function GET() {
  const subdomainSource = 'ads';
  const venueLabel = VENUE_LABEL.villa;
  const statusSuffix = '';
  const indianTime = '20/07/2026, 12:00:00 PM (IST)';
  const name = 'Priya Sharma';
  const phone = '9876543210';
  const email = 'priya.sharma@example.com';
  const source = 'Google';
  const checkInDate = '2026-07-25';
  const checkOutDate = '2026-07-26';
  const totalPax = '25';
  const totalKids = '0';
  const food = 'Veg';
  const pricingAccepted = true;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
      <div style="padding: 14px 32px; background: #F0FDF4; border-bottom: 1px solid #DCFCE7; color: #15803D; font-size: 15px; font-weight: bold; text-align: center;">
        🎉 Congratulations on your new ${venueLabel} lead!
      </div>
      <div style="background: #80281F; padding: 24px 32px;">
        <h2 style="color: #fff; margin: 0; font-size: 20px;">🎉 Congratulations! New ${venueLabel} Enquiry${statusSuffix} — BookMyCorporateParty [${subdomainSource}]</h2>
        <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 13px;">Received at ${indianTime} via ${subdomainSource}</p>
      </div>
      <div style="padding: 28px 32px; background: #fff;">
        <h3 style="color: #80281F; margin: 0 0 16px; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Contact Details</h3>
        <p style="margin: 0 0 8px;"><strong>Name:</strong> ${name}</p>
        <p style="margin: 0 0 8px;"><strong>WhatsApp Number:</strong> ${phone}</p>
        <p style="margin: 0 0 8px;"><strong>Email:</strong> ${email || '—'}</p>
        <p style="margin: 0 0 8px;"><strong>Heard About Us Via:</strong> ${source || '—'}</p>
        <p style="margin: 0 0 8px;"><strong>Domain Source:</strong> ${subdomainSource}</p>
        <p style="margin: 0 0 8px;"><strong>WhatsApp Updates:</strong> Yes</p>

        <h3 style="color: #80281F; margin: 24px 0 16px; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 10px;">${venueLabel} Details</h3>
        <p style="margin: 0 0 8px;"><strong>Check-In:</strong> ${checkInDate}</p>
        <p style="margin: 0 0 8px;"><strong>Check-Out:</strong> ${checkOutDate}</p>
        <p style="margin: 0 0 8px;"><strong>Total Pax:</strong> ${totalPax}</p>
        <p style="margin: 0 0 8px;"><strong>Total Kids:</strong> ${totalKids}</p>
        <p style="margin: 0 0 8px;"><strong>Food:</strong> ${food}</p>
        <p style="margin: 0 0 8px;"><strong>Pricing Confirmed:</strong> ${pricingAccepted ? 'Yes' : 'No'}</p>

        <h3 style="color: #80281F; margin: 24px 0 16px; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 10px;">User Location (Auto-Detected)</h3>
        <p style="margin: 0 0 8px;"><strong>Location:</strong> Airoli, Maharashtra, India</p>
        <p style="margin: 0 0 8px;"><strong>Pincode:</strong> 400708</p>
        <p style="margin: 0 0 8px;"><strong>IP Address:</strong> 103.181.208.58</p>
      </div>
      <div style="background: #f9f9f9; padding: 16px 32px; text-align: center; font-size: 12px; color: #999;">
        BookMyCorporateParty · Mumbai's #1 Corporate Party Platform
      </div>
    </div>
  `;

  const isConfigured = !!(process.env.NEXT_PUBLIC_EMAIL_USER && process.env.NEXT_PUBLIC_EMAIL_APP_PASSWORD);
  const emailReceiver = process.env.NEXT_PUBLIC_EMAIL_RECEIVER || 'leads@bookmycorporateparty.com';
  const emailSender = process.env.NEXT_PUBLIC_EMAIL_USER || 'no-reply@bookmycorporateparty.com';

  const previewHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Email Preview & Test Console</title>
        <meta charset="utf-8">
        <style>
          body {
            background-color: #f3f4f6;
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          .console-card {
            max-width: 620px;
            margin: 0 auto 20px;
            padding: 20px;
            border-radius: 8px;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          .console-title {
            margin: 0 0 12px;
            color: #1f2937;
            font-size: 16px;
            font-weight: 700;
          }
          .info-row {
            margin-bottom: 6px;
            font-size: 13px;
            color: #4b5563;
          }
          .info-label {
            font-weight: 600;
            display: inline-block;
            width: 90px;
          }
          .info-val {
            font-family: monospace;
            background: #f9fafb;
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid #f3f4f6;
            color: #111827;
          }
          .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
          }
          .badge-green {
            background-color: #d1fae5;
            color: #065f46;
          }
          .badge-red {
            background-color: #fee2e2;
            color: #991b1b;
          }
          .divider {
            height: 1px;
            background: #e5e7eb;
            margin: 15px 0;
          }
        </style>
      </head>
      <body>
        <div class="console-card">
          <div class="console-title">📧 Email Preview & Test Console</div>
          <div class="info-row">
            <span class="info-label">Subject:</span>
            <span class="info-val">🎉 Congratulations! New ${venueLabel} Enquiry${statusSuffix} from ${name} [${subdomainSource}]</span>
          </div>
          <div class="info-row">
            <span class="info-label">Sender:</span>
            <span class="info-val">${emailSender}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Receiver:</span>
            <span class="info-val">${emailReceiver}</span>
          </div>
          <div class="info-row">
            <span class="info-label">SMTP Status:</span>
            <span class="badge ${isConfigured ? 'badge-green' : 'badge-red'}">
              ${isConfigured ? '🟢 Configured (SMTP Credentials Loaded)' : '🔴 Unconfigured (Using Fallback Log Mode)'}
            </span>
          </div>
          <div class="divider"></div>
          <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center;">Below is the visual preview of the actual HTML sent to the receiver:</p>
        </div>

        ${emailHtml}
      </body>
    </html>
  `;

  return new Response(previewHtml, {
    headers: { 'Content-Type': 'text/html' },
  });
}
