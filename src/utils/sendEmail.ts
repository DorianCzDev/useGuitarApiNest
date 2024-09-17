import * as nodemailer from 'nodemailer';

type SendEmailProps = {
  to: string;
  subject: string;
  html: string;
};

export default async function sendEmail({ to, subject, html }: SendEmailProps) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_ADDRESS,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  return transporter.sendMail({
    from: '"useGuitar support" <useguitar.noreply@gmail.com>',
    to,
    subject,
    html,
  });
}
