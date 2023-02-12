import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export async function getArtists(user, apiKey) {
  try {
    const response = await axios.get(
      "https://ws.audioscrobbler.com/2.0/?method=user.gettopartists",
      {
        params: {
          user: user,
          api_key: apiKey,
          format: "json",
          limit: 1000,
        },
      }
    );

    return response.data.topartists.artist.map(
      (artist) => ({
        _id: uuidv4(),
        name: artist.name,
        createdAt: new Date(),
        isActive: true,
      })
    );

  } catch (error) {
    console.error(error);
  }
}
