const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


//db connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aoyfd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try{
        await client.connect();
        const booksCollection = client.db('booksInventory').collection('books');
        const suppliersCollection = client.db('booksInventory').collection('suppliers');

        app.get('/inventory', async (req, res)=> {
            const query = {};
            const cursor = booksCollection.find(query);
            const books = await cursor.toArray();

            res.send(books);
        })

        app.get('/inventory/:id', async (req, res)=> {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};

            const book = await booksCollection.findOne(query);

            res.send(book);
        })

        app.put('/inventory/:id', async (req, res)=> {
            const id = req.params.id;
            const updatedBook = req.body;
            console.log(updatedBook);

            const query = {_id: ObjectId(id)};
            const options = {upsert: true};

            const updatedDoc = {
                $set: {
                    name: updatedBook.name,
                    img: updatedBook.img,
                    description: updatedBook.description,
                    price: updatedBook.price,
                    quantity: updatedBook.quantity,
                    supplier_name: updatedBook.supplier_name
                }
            };

            const result = await booksCollection.updateOne(query, updatedDoc, options);

            res.send(result);
        })

        app.delete('/inventory/:id', async (req, res)=> {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await booksCollection.deleteOne(query);
            res.send(result);
        });


        app.post('/inventory', async (req, res)=> {
            const newBook = req.body;
            const result = await booksCollection.insertOne(newBook);
            res.send(result);
        })

    } finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res)=> {
    res.send('server running');
})

app.listen(port, ()=> {
    console.log('server working');
})