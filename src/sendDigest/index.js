import * as dotenv from "dotenv";
import nodemailer from 'nodemailer';
import { getDigestData } from "./getDigestData.js";

dotenv.config();

const digestData = await getDigestData();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
});

const mailOptions = {
  from: 'radim.bastan@gmail.com',
  to: 'radim.bastan@gmail.com',
  subject: 'New releases from your favourite artists',
  html: `
      <p>Here are the latest releases from your favourite artists:</p>
      ${digestData.albums.length ? `
        <b>Albums</b>
        <ul>
          ${digestData.albums?.map(release => `<li>${release.artist} - ${release.releaseName} (${release.releaseDate})</li>`).join('')}
        </ul>` : ''
    }
      ${digestData.singles.length ? `
        <b>Singles</b>
        <ul>
          ${digestData.singles?.map(release => `<li>${release.artist} - ${release.releaseName} (${release.releaseDate})</li>`).join('')}
        </ul>` : ''
    }
    `
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});