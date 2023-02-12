import axios from "axios";
import { DateTime } from "luxon";
import { config } from '../../config.js';

// Remove number from artist name and remove trailing asterisk
const normalizeArtist = (artist) => {
  return artist.trim().replace(/\s\(\d*\)|\*$/g, '').trim();
}

export async function getReleases() {
  const albums = [];

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
      const [groupOfArtists = '', releaseName = ''] = album.title.split(' - ');

      if (groupOfArtists.toLowerCase() === 'various') return;

      // Split string of artists by &, /, +, or ,
      const artists = groupOfArtists.split(/[&\/\+,]/);

      artists.forEach((artist) => {
        albums.push({
          artist: normalizeArtist(artist),
          releaseName: releaseName,
          releaseDate: album.year,
          releaseId: album.id,
          href: album.master_url,
          sent: false
        })
      });
    })
  } catch (error) {
    console.error(error);
  }

  return { albums }
}
