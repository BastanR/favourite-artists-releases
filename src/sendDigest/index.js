import sgMail from '@sendgrid/mail';
import { getDigestData } from "./getDigestData.js";
import { markDataSent } from "./markDataSent.js";
import { config } from "../../config.js";

sgMail.setApiKey(config.sendgridApiKey)

const digestData = await getDigestData();

const msg = {
  to: config.sendgridRecipient,
  from: config.sendgridVerifiedSender,
  subject: 'New releases from your favourite artists',
  text: '- list of singles and albums',
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
`,
}

if (digestData.albums.length || digestData.singles.length) {
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');

      markDataSent();
    })
    .catch((error) => {
      console.error(error)
    })
} else {
  console.log('Nothing to send');
}
