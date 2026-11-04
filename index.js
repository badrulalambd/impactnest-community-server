import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { MongoClient, ObjectId } from 'mongodb';
import { createRemoteJWKSet, jwtVerify } from 'jose';

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

const verifyUserWithMiddlewareToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("authHeader", authHeader);
  if (!authHeader) {
    return res.status(401).send({ msg: "Unauthorized" });
  }
  console.log("I'm Middleware!!!");

  const token = authHeader.split(" ")[1];
  console.log(token);
  if (!token) {
    return res.status(401).send({ msg: "Unauthorized" });
  }

  const JWKS = createRemoteJWKSet(
    new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
  )

  try {
    const { payload } = await jwtVerify(token, JWKS);
    console.log("PayLoad: ", payload);
    next();
  } catch (error) {
    return res.status(500).send({ msg: "Server Error" }, error);
  }

}

app.get('/', (req, res) => {
  res.send('Hello ImpactNest Community Member!')
})

//GET............................
//API for getting all events data from mongoDB databse
app.get('/events', verifyUserWithMiddlewareToken, async (req, res) => {
  const eventsData = await eventsCollection.find().toArray();
  res.send(eventsData);
  console.log('Fetched all events data from MongoDB');
})
// API for getting the 6 most recent upcoming events from MongoDB
app.get("/recentevents", verifyUserWithMiddlewareToken, async (req, res) => {
  try {
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    const eventsData = await eventsCollection
      .find({ date: { $gte: today } })
      .sort({ date: 1 })
      .limit(6)
      .toArray();

    res.send(eventsData);

    console.log("Fetched the 6 nearest upcoming events from MongoDB");
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    res.status(500).send({ message: "Failed to fetch upcoming events" });
  }
});
//API for getting single user events data from mongoDB databse
app.get('/events/:email', verifyUserWithMiddlewareToken, async (req, res) => {
  const { email } = req.params;
  const eventsData = await eventsCollection.find({ email }).toArray();
  res.send(eventsData);
  console.log('Fetched events data for user from MongoDB');
})
//API for getting single data from mongoDB database
app.get(`/events/single/:id`, verifyUserWithMiddlewareToken, async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await eventsCollection.findOne(query);
  res.send(result);
  console.log('Fetched single event data from MongoDB');
})
//API for getting all joinedevents data from mongoDB databse
app.get('/joinedevents/:email', verifyUserWithMiddlewareToken, async (req, res) => {
  const email = req.params.email;
  const joinedEventsData = await joinedeventsCollection.find({ userEmail: email }).toArray();
  res.send(joinedEventsData);
  console.log('Fetched joinedEvents data for userEmail from MongoDB', joinedEventsData);
})

// API for getting past events data from MongoDB
app.get("/pastevents", verifyUserWithMiddlewareToken, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const eventsData = await eventsCollection
      .find({ date: { $lt: today } }).limit(5)
      .sort({ date: -1 })
      .toArray();

    res.send(eventsData);

    console.log("Fetched past events from MongoDB");
  } catch (error) {
    console.error("Error fetching past events:", error);
    res.status(500).send({ message: "Failed to fetch past events" });
  }
});

//POST............................
//API for Posting data to mongoDB database or add-event
app.post('/events', verifyUserWithMiddlewareToken, async (req, res) => {
  const formData = req.body;
  const result = await eventsCollection.insertOne(formData);
  console.log("Data form Event", formData);
  res.send(result);
})

app.post('/joinedevents', verifyUserWithMiddlewareToken, async (req, res) => {
  const data = req.body;
  const result = await joinedeventsCollection.insertOne(data);
  console.log('joinedEvent:', result);
  res.send(result);
});

//PATCH............................
//API for update the event data
app.patch("/events/:id", verifyUserWithMiddlewareToken, async (req, res) => {
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
app.delete('/events/single/:id', verifyUserWithMiddlewareToken, async (req, res) => {
  const id = req.params.id;
  const result = await eventsCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
  console.log(result);
})

app.listen(port, () => {
  console.log(`ImpactNest Community server is running on port ${port}`)
})

export default app;