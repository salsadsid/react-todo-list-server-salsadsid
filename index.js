const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

app.use(cors())
app.use(express.json())
const uri = "mongodb+srv://DB_USER_TODO_LIST:UOvUhyyu6la6fGeh@cluster0.9agzn.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect()
        const todoListCollection = client.db('todoList').collection('todo');
        app.get('/todo', async (req, res) => {
            const query = {};
            const cursor = todoListCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        app.post('/todo', async (req, res) => {
            const newTodo = req.body;
            console.log(newTodo)
            const result = await todoListCollection.insertOne(newTodo);
            res.send(result)
        })
        app.delete('/todo/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await todoListCollection
                .deleteOne(query)
            res.send(result);
        })
        app.put('/todo', async (req, res) => {
            const id = req.body.id;
            const completed = req.body.completed;
            const query = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    completed: completed
                },
            };
            const result = await todoListCollection.updateOne(query, updateDoc, options);
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(console.dir)
app.get('/', async (req, res) => {
    res.send('TODO LIST')
})
app.listen(port, () => {
    console.log("TODOLIST Server", port);
})