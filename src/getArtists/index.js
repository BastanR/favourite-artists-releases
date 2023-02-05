import { getArtists } from "./getArtists.js";
import { config } from "../../config.js";

const client = config.mongoClient;

async function run() {
  try {
    const database = client.db("fard");
    const collection = database.collection("topArtists");

    await collection.insertMany(await getArtists(config.lastFmUser, config.lastFmApiKey), { ordered: false });
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
