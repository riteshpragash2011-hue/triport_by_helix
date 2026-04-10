import nodemailer from "nodemailer";

const RESET_EMAIL = "riteshpragash2011@gmail.com";

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export async function sendPasswordResetEmail(
  helixId: string,
  resetToken: string,
  baseUrl: string
) {
  const resetLink = `${baseUrl}/admin/reset-password?token=${resetToken}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TRIport Password Reset</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #2a2a2a;border-radius:2px;overflow:hidden;">

          <!-- Gold top bar -->
          <tr>
            <td style="background:linear-gradient(90deg,#8a6a1a,#C9A84C,#8a6a1a);height:3px;"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" style="padding:36px 40px 24px;">
              <p style="margin:0 0 6px;font-size:10px;font-weight:600;letter-spacing:0.25em;text-transform:uppercase;color:#C9A84C;">
                HELIX PROJECT 0002
              </p>
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.04em;">
                TRIPORT ADMIN PORTAL
              </h1>
              <p style="margin:8px 0 0;font-size:12px;color:#555;letter-spacing:0.1em;text-transform:uppercase;">
                Password Reset Request
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,#C9A84C44,transparent);"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 6px;font-size:11px;color:#666;letter-spacing:0.15em;text-transform:uppercase;">
                HELIX ID
              </p>
              <p style="margin:0 0 24px;font-size:28px;font-weight:700;color:#C9A84C;font-family:monospace;letter-spacing:0.2em;">
                ${helixId}
              </p>

              <p style="margin:0 0 24px;font-size:14px;color:#aaa;line-height:1.6;">
                A password reset was requested for your TRIport admin account.<br>
                Click the button below to set a new password. This link expires in <strong style="color:#ffffff;">1 hour</strong>.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td style="background:#C9A84C;border-radius:2px;">
                    <a href="${resetLink}"
                       style="display:inline-block;padding:14px 32px;font-size:13px;font-weight:700;color:#000;text-decoration:none;letter-spacing:0.12em;text-transform:uppercase;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:11px;color:#555;">
                Or copy this link into your browser:
              </p>
              <p style="margin:0;font-size:11px;color:#C9A84C;word-break:break-all;font-family:monospace;">
                ${resetLink}
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:#1e1e1e;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 32px;" align="center">
              <p style="margin:0;font-size:11px;color:#444;line-height:1.6;">
                If you didn't request this, you can safely ignore this email.<br>
                Your password will not change until you click the link above.
              </p>
              <p style="margin:16px 0 0;font-size:10px;color:#333;letter-spacing:0.1em;text-transform:uppercase;">
                TRIport by Helix · Admin Security
              </p>
            </td>
          </tr>

          <!-- Gold bottom bar -->
          <tr>
            <td style="background:linear-gradient(90deg,#8a6a1a,#C9A84C,#8a6a1a);height:2px;"></td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  await getTransporter().sendMail({
    from: `"TRIport Admin" <${process.env.EMAIL_USER}>`,
    to: RESET_EMAIL,
    subject: `[TRIport] Password Reset — Helix ID ${helixId}`,
    html,
    text: `TRIport Admin Portal — Password Reset\n\nHelix ID: ${helixId}\n\nClick this link to reset your password (expires in 1 hour):\n${resetLink}\n\nIf you didn't request this, ignore this email.`,
  });
}
