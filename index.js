const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://pro-gamer-720d5.web.app',
        'https://pro-gamer-720d5.firebaseapp.com',
    ],
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ytced.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const uri = `mongodb+srv://roGamerServer:RUjnwPa1cLTnmc8H@cluster0.ytced.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const uri = `mongodb+srv://proGamerServer:TJXmncPZdc1f63MU@cluster0.ytced.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const database = client.db('gamerDB');
        const reviewCollection = client.db('gamerDB').collection('reviews');
        const WatchlistCollection = client.db('gamerDB').collection('wachlist');


        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find();
            const result = await cursor.toArray();

            res.send(result);

        });
        app.get('/high', async (req, res) => {
            const result = await reviewCollection.find().sort({ ratting: -1 }).limit(6).toArray();
            res.send(result)

        })
        app.get('/details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await reviewCollection.findOne(query);
            res.send(result);
        })
        app.get('/myreview/:userEmail', async (req, res) => {
            const email = req.params.userEmail;
            const query = { userEmail:email}
            const result = await reviewCollection.find(query).toArray();
            res.send(result);
        })
        app.get('/GameWatchlist/:userEmail', async (req, res) => {
            const email = req.params.userEmail;
            const query = { userEmail:email}
            const result = await WatchlistCollection.find(query).toArray();
            res.send(result);
        })


        app.post('/reviews', async (req, res) => {
            const newReview = req.body;
            const result = await reviewCollection.insertOne(newReview);
            res.send(result);
        });

        app.post('/wachlist', async (req, res) => {
            const newWachList = req.body;
            const result = await WatchlistCollection.insertOne(newWachList);
            res.send(result);
        });


        app.put('/updatereview/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateReview = req.body
            const updateItems = {
                $set: {
                    gameCover: updateReview.gameCover,
                    gameTitle: updateReview.gameTitle,
                    reviewDescription: updateReview.reviewDescription,
                    rating: updateReview.rating,
                    publishingYear: updateReview.publishingYear,
                    genre: updateReview.genre,
                },
            };
            const result = await reviewCollection.updateOne(filter, updateItems, options)
            res.send(result);

        })


        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });

        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('PRO GAMER SERVER IS RUNNING')
})

app.listen(port, () => {
    console.log(`pro gamer server is running on port :${port} `);
})
