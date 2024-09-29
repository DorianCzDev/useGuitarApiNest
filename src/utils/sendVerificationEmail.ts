import sendEmail from "./sendEmail";

type SendVerificationEmail = {
  email: string;
  verificationToken: string;
  origin: string;
};

export default async function sendVerificationEmail({
  email,
  verificationToken,
  origin,
}: SendVerificationEmail) {
  const verifyEmail = `${origin}verify-email?verificationToken=${verificationToken}&email=${email}`;

  const message = `<p>Please confirm your email by clicking on the following link: <a href="${verifyEmail}">Verify email</a></p>`;

  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4>Hello!</h4>${message}`,
  });
}
