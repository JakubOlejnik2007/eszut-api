import { createTransport } from "nodemailer";
import config from "../config";
import { IAdministrator, IProblem } from "../types/db-types";
import { TAdministratorToSendEmail, TProblemToSendEmail } from "../types/email";
import { writeLog } from "../db/helpers/log-request.helper";
import Administrator from "../db/models/administrator.helper";

const { mail } = config;

const transporter = createTransport({
  service: mail.service,
  auth: {
    user: mail.user + "dasdas",
    pass: mail.pass,
  },
});

const newProblemEmail = (problem: TProblemToSendEmail): string => {
  const deadline = new Date(problem.when + 43_200_000 * 2 ** (problem.priority - 1));

  return `<head>
    <style>
    * {
      font-family: Arial, Helvetica, Sans-serif;
    }
      .bg-danger {
        background-color: #dc3545;
      }
      .bg-warning{
        background-color: #ffc107;
      }
    </style>
</head>
<body>
   <h1>Administratorze!</h1>
   <p>W bazie danych pojawiło się nowe zgłoszenie.</p>
   <table>
      <tr>
         <td colspan="2" class="${problem.priority === 1 ? "bg-danger" : ""} ${problem.priority === 2 ? "bg-warning" : ""
    }">&nbsp;</td>
      </tr>
      <tr>
         <td>id</td>
         <td>${problem._id}</td>
      </tr>
      <td>Kategoria</td>
      <td>${problem.categoryName}</td>
      </tr>
      <tr>
         <td>Opis</td>
         <td>${problem.what}</td>
      </tr>
      <tr>
         <td>Priorytet</td>
         <td>${problem.priority}</td>
      </tr>
      <tr>
         <td>Miejsce zgłoszenia</td>
         <td>${problem.where}</td>
      </tr>
      <tr>
         <td>Zgłaszający</td>
         <td>${problem.whoName} (${problem.whoEmail})</td>
      </tr>
      <tr>
         <td>Data zgłoszenia</td>
         <td>${new Date(problem.when).toLocaleString("pl")}</td>
      </tr>
      <tr>
         <td>Termin</td>
         <td>${deadline.toLocaleString("pl")}</td>
      </tr>
   </table>
</body>
</html>`;
};

export const sendEmailsAboutNewProblem = (problem: TProblemToSendEmail, emails: string[]) => {
  const transporter = createTransport({
    service: mail.service,
    auth: {
      user: mail.user,
      pass: mail.pass,
    },
  });
  const generatedEmailContent: string = newProblemEmail(problem);

  emails.forEach(async (email: string) => {
    const mailOptions = {
      from: mail.user,
      to: email,
      subject: `[${problem.priority}] Nowe zgłoszenie w bazie danych!`,
      html: generatedEmailContent,
    };
    try {
      const response = await transporter.sendMail(mailOptions);
    } catch (error) {
      writeLog({
        date: Date.now(),
        content: `Error: Cannot send mail to ${email}`,
        error: String(error),
      });
    }
  });
};

const newAdministratorEmail = (administrator: TAdministratorToSendEmail): string => {
  return `<head>
  <style>
  * {
    font-family: Arial, Helvetica, Sans-serif;
  }
    .bg-danger {
      background-color: #dc3545;
    }
    .bg-warning{
      background-color: #ffc107;
    }
  </style>
</head>
<body>
 <h1>Administratorze!</h1>
 <p>Został dodany nowy administrator:
    <table>
      <tr>
        <td>Nazwa</td><td>${administrator.name}</td>
      </tr>
      <tr>
        <td>Email</td><td>${administrator.email}</td>
      </tr>
    </table>
 </p>
</body>
</html>`;
};

export const sendEmailsAboutNewAdministrator = (administrator: TAdministratorToSendEmail, emails: string[]) => {
  const transporter = createTransport({
    service: mail.service,
    auth: {
      user: mail.user,
      pass: mail.pass,
    },
  });
  const generatedEmailContent: string = newAdministratorEmail(administrator);

  emails.forEach(async (email: string) => {
    const mailOptions = {
      from: mail.user,
      to: email,
      subject: `[${administrator.name}] Nowy administrator!`,
      html: generatedEmailContent,
    };
    try {
      const response = await transporter.sendMail(mailOptions);
    } catch (error) {
      writeLog({
        date: Date.now(),
        content: `Error: Cannot send mail to ${email}`,
        error: String(error),
      });
    }
  });
};