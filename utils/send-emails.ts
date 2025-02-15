import nodemailer from 'nodemailer';
import { TEmailMapped } from '../types/email';
import config from '../config';



const sendEmails = async (emails: (string | TEmailMapped)[], subject: string, htmlContent: string) => {
  const transporter = nodemailer.createTransport({
    service: config.mail.service,
    auth: {
      user: config.mail.user,
      pass: config.mail.pass,
    },
  });

  for (const item of emails) {
    const to = typeof item === 'string' ? item : item.email;
    const cc = typeof item === 'string' ? [] : item.otherEmails;

    const mailOptions = {
      from: config.mail.user,
      to,
      cc,
      subject,
      html: htmlContent,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}, CC: ${cc.join(', ')}`);
    } catch (error) {
      console.error(`Error sending email to ${to}:`, error);
    }
  }
}

export default sendEmails;
