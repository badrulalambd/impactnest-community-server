
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { MongoClient, ObjectId } from 'mongodb';

const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const MONGODB_BASE_URL = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@ac-n9vqlya-shard-00-00.d1i0h77.mongodb.net:27017,ac-n9vqlya-shard-00-01.d1i0h77.mongodb.net:27017,ac-n9vqlya-shard-00-02.d1i0h77.mongodb.net:27017/?ssl=true&replicaSet=atlas-7upjpt-shard-0&authSource=admin`

const client = new MongoClient(MONGODB_BASE_URL);

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

//GET............................
//API for getting all events data from mongoDB databse
app.get('/events', async (req, res) => {
  const eventsData = await eventsCollection.find().toArray();
  res.send(eventsData);
  console.log('Fetched all events data from MongoDB');
})

//API for getting single user events data from mongoDB databse
app.get('/events/:email', async (req, res) => {
  const { email } = req.params;
  const eventsData = await eventsCollection.find({ email }).toArray();
  res.send(eventsData);
  console.log('Fetched events data for user from MongoDB');
})
//Create API for getting single data from mongoDB database
app.get(`/events/single/:id`, async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await eventsCollection.findOne(query);
  res.send(result);
  console.log('Fetched single event data from MongoDB');
})


//POST............................
//API for Posting data to mongoDB database or add-event
app.post('/events', async (req, res) => {
  const formData = req.body;
   const result = await eventsCollection.insertOne(formData); 
  console.log("Data form Event", formData);
  res.send(result);
})

//DELETE............................
//API for deleting event from the database
app.delete('/events/single/:id', async (req, res) => {
  const id = req.params.id;
  const result = await eventsCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
  console.log(result);
})

app.listen(port, () => {
  console.log(`ImpactNest Community server is running on port ${port}`)
})

export default app;