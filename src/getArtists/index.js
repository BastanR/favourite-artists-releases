import * as dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
import { getArtists } from "./getArtists.js";

dotenv.config();

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    const database = client.db("fard");
    const collection = database.collection("topArtists");

    await collection.insertMany(await getArtists(process.env.LASTFM_USER, process.env.LASTFM_API_KEY), { ordered: false });
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
