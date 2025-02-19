const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/softwarestoreDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ Database Connection Failed:', err));

app.use(bodyParser.json());
app.use(express.static(__dirname));

// Define collection schemas
const collections = {
    customers: mongoose.model('Customers', new mongoose.Schema({}, { strict: false })),
    carts: mongoose.model('Carts', new mongoose.Schema({}, { strict: false })),
    orders: mongoose.model('Orders', new mongoose.Schema({}, { strict: false })),
    payments: mongoose.model('Payments', new mongoose.Schema({}, { strict: false })),
    softwares: mongoose.model('Softwares', new mongoose.Schema({}, { strict: false })),
    cartItems: mongoose.model('CartItems', new mongoose.Schema({}, { strict: false }))
};

// Serve admin page
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));

// Get all data from a collection
app.get('/api/:collection', async (req, res) => {
    try {
        const collection = collections[req.params.collection];
        if (!collection) return res.status(400).send('Invalid collection');
        const docs = await collection.find({});
        res.json(docs);
    } catch (err) {
        res.status(500).send('Error fetching data');
    }
});

// Create a new document
app.post('/api/:collection', async (req, res) => {
    try {
        const collection = collections[req.params.collection];
        if (!collection) return res.status(400).send('Invalid collection');
        const newDoc = await collection.create(req.body);
        res.status(201).json(newDoc);
    } catch (err) {
        res.status(500).send('Error adding document');
    }
});

// Update a document
app.put('/api/:collection/:id', async (req, res) => {
    try {
        const collection = collections[req.params.collection];
        if (!collection) return res.status(400).send('Invalid collection');
        const updatedDoc = await collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDoc) return res.status(404).send('Document not found');
        res.json(updatedDoc);
    } catch (err) {
        res.status(500).send('Error updating document');
    }
});

// Delete a document
app.delete('/api/:collection/:id', async (req, res) => {
    try {
        const collection = collections[req.params.collection];
        if (!collection) return res.status(400).send('Invalid collection');
        const deletedDoc = await collection.findByIdAndDelete(req.params.id);
        if (!deletedDoc) return res.status(404).send('Document not found');
        res.send('Document deleted');
    } catch (err) {
        res.status(500).send('Error deleting document');
    }
});

// Search for documents
app.get('/api/:collection/search/:query', async (req, res) => {
    try {
        const collection = collections[req.params.collection];
        if (!collection) return res.status(400).send('Invalid collection');
        const query = req.params.query;
        const results = await collection.find({ $text: { $search: query } });
        res.json(results);
    } catch (err) {
        res.status(500).send('Error searching');
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
