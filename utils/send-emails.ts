import nodemailer from 'nodemailer';
import { TEmailMapped } from '../types/email';
import config from '../config';
import getTeamMembers from "./getUsersFromTeam";
import { getAllMappedMails } from '../db/helpers/mail-request.helper';
import { writeLog } from '../db/helpers/log-request.helper';
import LOGTYPES from '../types/logtypes.enum';
import { getGraphAccessToken, getTeamIdByName } from './auth/get-user-teams';

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
    } catch (error) {
      writeLog({
        type: LOGTYPES.ERROR,
        userEmail: "Unknown",
        date: Date.now(),
        content: `Error sending email to ${to}: ${error}`
      })
    }
  }
}

const htmlForEmail = (problem: any) => {

  const priorityColor = problem.priority === 1 ? "rgba(255, 98, 98, 0.306)" : problem.priority === 2 ? "rgba(255, 98, 229, 0.306)" : "rgba(187, 98, 255, 0.306)";

  return `
    <div style="background-color: #333333; margin: 0px; padding: 0px; font-family: sans-serif; font-size: 20; color: white;" >
<center style="font-size: 42px; color: #FF7060; padding-top: 40px;">
    ESZUT
</center>
<center>
    W systemie pojawiło się nowe zgłoszenie! <br/>
    Ta wiadomość została wygenerowania automatycznie przez system ESZUT. <br/>
    Prosimy na nią nie odpowiadać! <br />
    <a href="https://eszut.zstz-radzymin.pl/zgloszenia">Otwórz zgłoszenia w przeglądarce</a>
    <br>
    <div style="margin-bottom: 40px; margin-top: 40px; padding-bottom:20px; background-color: #1a1a1a; width: 320px; border-color: #141414; border-width: 2px; border-style: solid; font-size: 16px;">
        <!-- waga -->
        <div style="height: 30px; background-color: ${priorityColor}; width: 100%; font-size: 14px; line-height: 30px; color: rgba(255, 255, 255, 0.658);">Priorytet: ${problem.priority}</div> 
        <br>
        <span style="font-size: 12px; color: rgba(255, 255, 255, 0.658);">Kategoria:</span>
        <br>${problem.categoryName}<br><br>
        <span style="font-size: 12px; color: rgba(255, 255, 255, 0.658);">Miejsce:</span>
        <br>${problem.placeName}<br><br>
        <span style="font-size: 12px; color: rgba(255, 255, 255, 0.658);">Opis:</span><br>
        ${problem.what}<br><br>
        <span style="font-size: 12px; color: rgba(255, 255, 255, 0.658);">Zgłoszone przez:</span><br>
        ${problem.whoName}<br>(${problem.whoEmail})
    </div>
    powodzenia!
</center>
</div>
  `;
}

const sendEmailsAboutNewProblem = async (problemToSend: any) => {

  const accessToken = await getGraphAccessToken();
  const adminsId = await getTeamIdByName(accessToken, config.authTeams.admins);
  const result = await getTeamMembers(adminsId as string);


  const emails: (string | TEmailMapped)[] = [];

  const mapping = await getAllMappedMails();
  result.forEach((member: any) => {
    const map = mapping.filter((mails) => mails.outlookMail === member.email);
    map.length > 0 ? emails.push({
      email: member.email,
      otherEmails: [map[0].mappedTo]
    }) :
      emails.push(member.email);
  })

  const emailSubject = "Nowe zgłoszenie w bazie danych";
  const emailContent = htmlForEmail(problemToSend);
  sendEmails(emails, emailSubject, emailContent);

}

export default sendEmailsAboutNewProblem;

