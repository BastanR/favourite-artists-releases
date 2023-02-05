import * as dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();

const mongoDbUri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/?retryWrites=true&w=majority`;

export const config = {
  // Last.FM
  lastFmUser: process.env.LASTFM_USER,
  lastFmApiKey: process.env.LASTFM_API_KEY,
  // MongoDB
  mongoClient: new MongoClient(mongoDbUri, { serverApi: ServerApiVersion.v1 }),
  // Spotify
  spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
  spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  // Discogs
  discogsConsumerKey: process.env.DISCOGS_CONSUMER_KEY,
  discogsConsumerSecret: process.env.DISCOGS_CONSUMER_SECRET,
  // Sendgrid
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  sendgridVerifiedSender: process.env.SENDGRID_VERIFIED_SENDER,
  sendgridRecipient: process.env.SENDGRID_RECIPIENT
};
