import 'dotenv/config';

import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import { createTransport } from 'nodemailer';
import bodyParser from 'body-parser';

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

async function enviarEmail ({ subject, text, toEmail }) {
  const config = {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.usermail,
      pass: process.env.passwordmail
    }
  };

  const transporter = createTransport(config);

  const message = {
    from: process.env.usermail,
    to: toEmail,
    subject,
    text
  };

  return await transporter.sendMail(message);
}

app.post('/', async (req, res) => {
  try {
    const sentInfo = await enviarEmail(req.body);

    res.status(200).json(sentInfo);
  } catch (error) {
    console.log(error);

    res.send('error');
  }
});


app.listen(3000, (req, res) => {
  console.log('El servidor esta escuchando en  http://localhost:3000');
});

// create reusable transporter object using the default SMTP transport
// const createTransport = nodemailer.createTransport({
//   port: 465,               // true for 465, false for other ports
//   host: "smtp.gmail.com",
//      auth: {
//           user: 'youremail@gmail.com',
//           pass: 'password',
//        },
//   secure: true,
//   });

//   const mailData = {
//     from: 'youremail@gmail.com', 
//       to: 'myfriend@gmail.com',   
//       subject: 'Sending Email using Node.js',
//       text: 'That was easy!',
//       // html: '<b>Hey there! </b>
//       //        <br> This is our first message sent with Nodemailer<br/>'
//     };

//     // An array of attachments
//     attachments: [
//       {
//           filename: 'text notes.txt',
//           path: 'notes.txt'
//       },
//    ]

//    transporter.sendMail(mailOptions, function (err, info) {
//     if(err)
//       console.log(err)
//     else
//       console.log(info);
//  });

