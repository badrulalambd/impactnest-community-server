
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { MongoClient } from 'mongodb';

const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URL);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const mongoClient = await connectToMongoDB();
const db = mongoClient.db('impactnestdb');
const eventsCollection = db.collection('events');



app.get('/', (req, res) => {
  res.send('Hello ImpactNest Community Member!')
})

//API for getting all events data from mongoDB databse
app.get('/events', async (req, res) => {
  const eventsData = await eventsCollection.find().toArray();
  res.send(eventsData);
  console.log('Fetched all events data from MongoDB');
})

//Create API for Posting data to mongoDB database or add-destination
app.post('/events', async (req, res) => {
  const formData = req.body;
   const result = await eventsCollection.insertOne(formData); 
  console.log("Data form Event", formData);
  res.send(result);
})

app.listen(port, () => {
  console.log(`ImpactNest Community server is running on port ${port}`)
})