
import express from 'express'
import 'dotenv/config' // for esm
import { MongoClient } from 'mongodb';

const app = express()
const port = process.env.PORT || 5000

const client = new MongoClient(process.env.MONGODB_URL);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
  } catch (err) {
    console.dir(err);
  }
}
connectToMongoDB();

app.get('/', (req, res) => {
  res.send('Hello ImpactNest Community Member!')
})

app.listen(port, () => {
  console.log(`ImpactNest Community server is running on port ${port}`)
})