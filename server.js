const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── CONTACT FORM ENDPOINT ───
app.post('/contact', async (req, res) => {
  const { name, email, org, interest, message } = req.body;

  if (!name || !email || !interest) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const serviceLabels = {
    'ai-governance':  'AI Governance Framework',
    'aup':            'Acceptable Use Policy Development',
    'ai-training':    'AI Staff Training',
    'it-full':        'IT Assessment — Full Engagement',
    'it-advisory':    'IT Assessment — Advisory',
    'it-diy':         'IT Assessment — DIY Package',
    'mjd':            'MyJobDaddy — Job Seeker Tool',
    'general':        'General Inquiry / Not Sure Yet',
  };

  const interestLabel = serviceLabels[interest] || interest;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"ESN Contact Form" <${process.env.SMTP_USER}>`,
      to: 'info@equitysolutionsnetwork.com',
      replyTo: email,
      subject: `[ESN Inquiry] ${interestLabel} — ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;color:#333;">
          <h2 style="color:#0a0f1e;border-bottom:2px solid #00d4aa;padding-bottom:12px;">
            New Contact Form Submission
          </h2>
          <table style="width:100%;border-collapse:collapse;margin-top:16px;">
            <tr><td style="padding:8px 0;font-weight:600;width:160px;color:#555;">Name</td><td>${name}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600;color:#555;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px 0;font-weight:600;color:#555;">Organization</td><td>${org || '—'}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600;color:#555;">Interest</td><td style="color:#00d4aa;font-weight:600;">${interestLabel}</td></tr>
          </table>
          ${message ? `
            <div style="margin-top:24px;">
              <p style="font-weight:600;color:#555;margin-bottom:8px;">Message:</p>
              <p style="background:#f5f7fa;padding:16px;border-left:3px solid #00d4aa;line-height:1.6;">${message.replace(/\n/g, '<br/>')}</p>
            </div>
          ` : ''}
          <p style="margin-top:24px;font-size:0.8rem;color:#999;">Sent from equitysolutionsnetwork.com</p>
        </div>
      `,
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Mail error:', err.message);
    // Still return 200 in dev/staging if mail isn't configured — swap to 500 in prod
    res.status(200).json({ ok: true, note: 'Mail not configured yet' });
  }
});

// ─── CATCH-ALL ───
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ESN server running on port ${PORT}`);
});
