
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
const joinedeventsCollection = db.collection('joinedevents');



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
//API for getting single data from mongoDB database
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

//API for posting booking data to mongoDB
// app.post('/joinedevents', async (req, res) => {
//   const data = req.body;
//   const result = await joinedeventsCollection.insertOne(data);
//   console.log("joinedEvent: ", result);
//   res.send(result);
// })
app.post('/joinedevents', async (req, res) => {
  try {
    const data = req.body;

    // Check whether the user has already joined this event
    const existingEvent = await joinedeventsCollection.findOne({
      eventId: data.eventId,
      email: data.email,
    });

    if (existingEvent) {
      return res.status(409).send({
        message: 'You have already joined this event.',
      });
    }

    // Insert only if no duplicate exists
    const result = await joinedeventsCollection.insertOne(data);

    console.log('joinedEvent:', result);

    res.status(201).send({
      message: 'Successfully joined the event.',
      result,
    });
  } catch (error) {
    console.error('Error joining event:', error);

    res.status(500).send({
      message: 'Failed to join the event.',
    });
  }
});


//PATCH............................
//API for update the event data
app.patch("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      type,
      date,
      location,
      imageUrl,
      description,
    } = req.body;

    const result = await eventsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          type,
          date,
          location,
          imageUrl,
          description,
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Event not found.",
      });
    }

    return res.status(200).json({
      message: "Event updated successfully.",
    });
  } catch (error) {
    console.error("Error updating event:", error);

    return res.status(500).json({
      message: "Failed to update the event.",
    });
  }
});


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