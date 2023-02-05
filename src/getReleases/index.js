import * as dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
import { getReleases } from "./getReleases.js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    const newReleases = await getReleases();
    const database = client.db("fard");
    const topArtists = await database.collection('topArtists').find().toArray();
    const singlesCollection = database.collection('singles');
    const albumsCollection = database.collection('albums');
    const topArtistsNames = topArtists.map(artist => artist.name);

    for (const release of newReleases.singles) {
      if (topArtistsNames.includes(release.artist)) {
        await singlesCollection.insertOne({
          _id: uuidv4(),
          createdAt: new Date(),
          ...release
        });
      }
    }

    for (const release of newReleases.albums) {
      if (topArtistsNames.includes(release.artist)) {
        await albumsCollection.insertOne({
          _id: uuidv4(),
          createdAt: new Date(),
          ...release
        });
      }
    }

  } catch (error) {
    if (error.code === 11000) {
      // Duplicate, do nothing
    } else {
      console.error(error);
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);
