const express = require('express');
const cors = require('cors');
require('dotenv').config();
// const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;




//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_password}@cluster0.jnuj2ye.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const categoriesCollection = client.db('assignment12').collection('categories');



//get all categories

app.get('/categories', async (req, res) => {
    const categories = await categoriesCollection.find({}).toArray();
    res.send(categories);
})



app.get('/', (req, res) => {
    res.send('hello');
})

app.listen(port, () => {
    console.log('Running')
})

