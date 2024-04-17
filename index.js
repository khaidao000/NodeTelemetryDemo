const tracer = require("./tracing")("todo-service");
const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
app.use(express.json());
const port = 3000;
let db;

// Connect to MongoDB and start the server
const startServer = async () => {
    try {
        const client = await MongoClient.connect("mongodb://localhost:27017/");
        db = client.db("todo");
        await db.collection("todos").insertMany([
            { id: "1", title: "Buy groceries" },
            { id: "2", title: "Install Aspecto" },
            { id: "3", title: "buy my own name domain" },
        ]);
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    } catch (error) {
        console.error("Database connection failed", error);
        process.exit(1);
    }
};

// Route to get all todos
app.get("/todo", async (req, res) => {
    const todos = await db.collection("todos").find({}).toArray();
    res.send(todos);
});

// Route to get a single todo by ID
app.get("/todo/:id", async (req, res) => {
    const todo = await db.collection("todos").findOne({ id: req.params.id });
    res.send(todo);
});

// 404 handler for undefined routes
app.use((req, res, next) => {
    res.status(404).send("The route you are trying to access does not exist.");
});

app.use((err, req, res, next) => {
    console.error(err.stack); // Log the stack trace for debugging
    res.status(500).send('Something broke on the server!');
});

// Start the server
startServer();
