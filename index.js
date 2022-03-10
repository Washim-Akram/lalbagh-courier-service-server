const express = require('express');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x32av.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        const database = client.db('lalbaghCourierService');
        const servicesCollection = database.collection('services');

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // GET API (A SINGLE SERVICE)
        app.get('/services/:id', async (req, res) => {
            const { id } = req.params;
            // console.log('Getting A Specific Id', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            // console.log('hit the post api', service);
            const result = await servicesCollection.insertOne(service);
            // console.log(result);
            res.json(result);
        });

        // UPDATE API
        app.put('/services/:id', async (req, res) => {
            const { id } = req.params;
            // console.log(req.body);
            const updatedService = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedService.name,
                    price: updatedService.price,
                    description: updatedService.description,
                    img: updatedService.img,
                },
            };
            const result = await servicesCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        });
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Server On Lalbagh Courier Service');
});

app.listen(port, () => {
    console.log(`Lalbagh Courier Service server running on port ${port}`);
});
