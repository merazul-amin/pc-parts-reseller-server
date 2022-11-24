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
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const categoriesCollection = client.db('assignment12').collection('categories');
const productsCollection = client.db('assignment12').collection('products');
const usersCollection = client.db('assignment12').collection('users');

//get all categories

app.get('/categories', async (req, res) => {
    const categories = await categoriesCollection.find({}).toArray();
    res.send(categories);
})


//get products by category id

app.get('/category/:id', async (req, res) => {
    const id = req.params.id;
    const query = { categoryId: id };
    const products = await productsCollection.find(query).toArray();
    res.send(products);
})

//set users in db

app.post('/users', async (req, res) => {
    const user = req.body;
    const result = await usersCollection.insertOne(user);
    res.send(result);
})

//get user role
app.get('/role/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email };
    const role = await usersCollection.findOne(query);
    res.send(role);
})


app.get('/', (req, res) => {
    res.send('hello');
})

app.listen(port, () => {
    console.log('Running')
})

