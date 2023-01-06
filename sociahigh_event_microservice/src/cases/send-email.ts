import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.GMAIL_APPLICATION_ACCOUNT,
    pass: process.env.GMAIL_APPLICATION_PASSWORD,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  return transporter.sendMail({
    from: `"Sociahigh 🥳" <${process.env.GMAIL_APPLICATION_ACCOUNT}>`,
    to,
    subject,
    html,
  });
}

export async function mountHTML(params: {
  title: string;
  description: string;
}): Promise<string> {
  const templates_dir = path.join(path.resolve(), 'src', 'templates');
  const template_file = path.join(templates_dir, 'default.ejs');
  return ejs.renderFile(template_file, params, {});
}
