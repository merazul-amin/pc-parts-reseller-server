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
const bookingCollection = client.db('assignment12').collection('bookings');


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

//update seller verification

app.patch('/users/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: ObjectId(id) };
    const doc = {
        $set: {
            isVerified: true
        }
    }
    const result = await usersCollection.updateOne(filter, doc);
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
    const result = await productsCollection.insertOne(product);
    res.send(result);
})

//remove sellers product

app.delete('/products/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await productsCollection.deleteOne(query);
    res.send(result);
})


//get my products

app.get('/myProducts/:email', async (req, res) => {
    const email = req.params.email;
    const products = await productsCollection.find({ sellerEmail: email }).toArray();
    res.send(products);
})


//set advertise product

app.patch('/advertise/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: ObjectId(id) };
    const doc = {
        $set: {
            isAdvertised: true
        }
    }
    const result = await productsCollection.updateOne(filter, doc)
    res.send(result);
})


//get advertised Products

app.get('/advertised', async (req, res) => {
    const products = await productsCollection.find({ isAdvertised: true }).toArray();
    res.send(products);
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

app.get('/buyers/:email', verify, async (req, res) => {
    const email = req.params.email;
    if (req.decoded.email !== email) {
        return res.status(403).send({ message: 'Unauthorized User' })
    }
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

//add booking in db

app.post('/booking', async (req, res) => {
    const bookingDetails = req.body;
    const result = await bookingCollection.insertOne(bookingDetails);
    res.send(result);
})

//get all bookings

app.get('/bookings/:email', verify, async (req, res) => {
    const email = req.params.email;
    if (req.decoded.email !== email) {
        return res.status(403).send({ message: 'Unauthorized User' })
    }
    const bookings = await bookingCollection.find({ email }).toArray();
    res.send(bookings);
})


app.get('/', (req, res) => {
    res.send('hello');
})

app.listen(port, () => {
    console.log('Running')
})

