import axios from "axios";
import { DateTime } from "luxon";
import { config } from '../../config.js';

export async function getReleases() {
  const albums = [];
  const singles = [];

  try {
    // use access token to retrieve new releases
    const albumsResponse = await axios({
      method: 'GET',
      url: 'https://api.discogs.com/database/search',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Discogs key=${config.discogsConsumerKey}, secret=${config.discogsConsumerSecret}`
      },
      data: 'grant_type=client_credentials',
      params: {
        sort: 'date_added,desc',
        year: DateTime.now().year,
        format_exact: 'Album',
        type: 'master',
        per_page: 100
      }
    });

    albumsResponse.data.results.forEach((album) => {
      const [artist = '', releaseName = ''] = album.title.split(' - ');

      if (artist.toLowerCase() === 'various') return;

      albums.push({
        artist: artist.replace(/\*/g, '').toLowerCase(),
        releaseName: releaseName,
        releaseDate: album.year,
        releaseId: album.id,
        href: album.master_url,
        sent: false
      })
    })
  } catch (error) {
    console.error(error);
  }

  try {
    // use access token to retrieve new releases
    const singlesResponse = await axios({
      method: 'GET',
      url: 'https://api.discogs.com/database/search',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Discogs key=${config.discogsConsumerKey}, secret=${config.discogsConsumerSecret}`
      },
      data: 'grant_type=client_credentials',
      params: {
        sort: 'date_added,desc',
        year: DateTime.now().year,
        format_exact: 'Single',
        type: 'master',
        per_page: 100
      }
    });

    singlesResponse.data.results.forEach((single) => {
      const [artist = '', releaseName = ''] = single.title.split(' - ');

      if (artist.toLowerCase() === 'various') return;

      singles.push({
        artist: artist.replace(/\*/g, '').toLowerCase(),
        releaseName: releaseName,
        releaseDate: single.year,
        releaseId: single.id,
        href: single.master_url,
        sent: false
      })
    })
  } catch (error) {
    console.error(error);
  }

  return { albums, singles }
}
