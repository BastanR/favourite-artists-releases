import * as dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

export async function getDigestData() {
  try {
    const database = client.db("fard");
    const singles = await database.collection('singles').find().toArray();
    const albums = await database.collection('albums').find().toArray();

    const unsentSingles = [];
    const unsentAlbums = [];

    singles.forEach((single) => {
      !single.sent && unsentSingles.push(single)
    })

    albums.forEach((album) => {
      !album.sent && unsentAlbums.push(album)
    })

    return { singles: unsentSingles, albums: unsentAlbums };
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};