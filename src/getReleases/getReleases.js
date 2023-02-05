import * as dotenv from "dotenv";
import axios from "axios";
import { DateTime } from "luxon";

dotenv.config();

const [, , country = 'US'] = process.argv;

export async function getReleases() {
  try {
    // retrieve access token
    const response = await axios({
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')
      },
      data: 'grant_type=client_credentials'
    });

    const accessToken = response.data.access_token;

    // use access token to retrieve new releases
    const newReleasesResponse = await axios({
      method: 'GET',
      url: 'https://api.spotify.com/v1/browse/new-releases',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        limit: 50,
        country: country
      }
    });

    const albums = [];
    const singles = [];

    newReleasesResponse.data.albums.items.forEach((album) => {
      if (album.release_date < DateTime.now().minus({ month: 1 }).toISO()) return;

      if (album.album_type === 'single') {
        album.artists.forEach((albumArtist) => {
          if (albumArtist.type === 'artist') {
            singles.push({
              artist: albumArtist.name,
              releaseName: album.name,
              releaseDate: album.release_date,
              releaseId: album.id,
              href: album.href
            })
          }
        })
      }

      if (album.album_type === 'album') {
        album.artists.forEach((albumArtist) => {
          if (albumArtist.type === 'artist') {
            albums.push({
              artist: albumArtist.name,
              releaseName: album.name,
              releaseDate: album.release_date,
              releaseId: album.id,
              href: album.href
            })
          }
        })
      }
    });

    return { albums, singles };
  } catch (error) {
    console.error(error);
  }
}
