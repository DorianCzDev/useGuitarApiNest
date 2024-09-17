import sendEmail from './sendEmail';

export default async function sendResetPasswordEmail({
  email,
  forgotPasswordToken,
  origin,
}: {
  email: string;
  forgotPasswordToken: string;
  origin: string;
}) {
  const resetURL = `${origin}reset-password?forgot-password-token=${forgotPasswordToken}&email=${email}`;
  const message = `<p>Please reset password by clicking on the following link: <a href="${resetURL}">Reset Password</a></p>`;

  return sendEmail({
    to: email,
    subject: 'Reset Password',
    html: `<h4>Hello!</h4>
    ${message}
    `,
  });
}
