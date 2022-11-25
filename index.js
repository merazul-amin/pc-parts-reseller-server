const express = require('express');
const cors = require('cors');
require('dotenv').config();
// const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_password}@cluster0.jnuj2ye.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const categoriesCollection = client.db('assignment12').collection('categories');
const productsCollection = client.db('assignment12').collection('products');
const usersCollection = client.db('assignment12').collection('users');
const sellersProductsCollection = client.db('assignment12').collection('sellersProducts');


//function for check the validity of jwt token

function verify(req, res, next) {
    const token = req.headers.token;
    jwt.verify(token, process.env.jwt_code, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Unauthorized User' })
        }
        req.decoded = decoded;
        next()
    })
}



//Implement jwt token

app.post('/jwt', async (req, res) => {
    const email = req.body;
    const token = jwt.sign(email, process.env.jwt_code, { expiresIn: '60h' });
    res.send({ token });
})

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

//set sellers Products

app.post('/products', async (req, res) => {
    const product = req.body;
    console.log(product);
    const result = await productsCollection.insertOne(product);
    res.send(result);
})


//get my products

app.get('/myProducts/:email', async (req, res) => {
    const email = req.params.email;
    const products = await productsCollection.find({ sellerEmail: email }).toArray();
    res.send(products);
})


//set advertise product

// app.patch('/advertise/:id', async (req, res) => {
//     const id = req.params.id;
//     console.log(id, 'hitted');
//     res.send("hello")
// })

app.patch('/advertise/:id', (req, res) => {
    res.send({ hello: 'hello' })
})


//get all sellers

app.get('/sellers', async (req, res) => {
    const query = { role: 'seller' };
    const users = await usersCollection.find(query).toArray();
    res.send(users);
})

//delete a seller
app.delete('/seller/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await usersCollection.deleteOne(query);
    res.send(result);
})

//get all buyers

app.get('/buyers', async (req, res) => {
    const query = { role: 'buyer' };
    const users = await usersCollection.find(query).toArray();
    res.send(users);
})

//delete a seller
app.delete('/buyer/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await usersCollection.deleteOne(query);
    res.send(result);
})


app.get('/', (req, res) => {
    res.send('hello');
})

app.listen(port, () => {
    console.log('Running')
})

