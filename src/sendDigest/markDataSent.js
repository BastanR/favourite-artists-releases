import { config } from "../../config.js";

const client = config.mongoClient;

export async function markDataSent() {
  try {
    const database = client.db("fard");
    const singles = database.collection('singles');
    const albums = database.collection('albums');

    await singles.updateMany({ sent: false }, { $set: { sent: true } });
    await albums.updateMany({ sent: false }, { $set: { sent: true } });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};