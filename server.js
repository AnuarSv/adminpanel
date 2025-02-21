const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/softwarestoreDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Database Connection Failed:', err));

app.use(bodyParser.json());
app.use(express.static(__dirname));

const collections = {
    customers: mongoose.model('Customers', new mongoose.Schema({
        name: { type: String, index: true },
        email: { type: String, unique: true, index: true }
    }, { strict: false })),

    carts: mongoose.model('Carts', new mongoose.Schema({
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customers', index: true }
    }, { strict: false })),

    orders: mongoose.model('Orders', new mongoose.Schema({
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customers', index: true },
        status: { type: String, index: true }
    }, { strict: false })),

    payments: mongoose.model('Payments', new mongoose.Schema({
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Orders', index: true }
    }, { strict: false })),

    softwares: mongoose.model('Softwares', new mongoose.Schema({
        name: { type: String, index: true },
        category: { type: String, index: true }
    }, { strict: false })),

    cartItems: mongoose.model('CartItems', new mongoose.Schema({
        cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Carts', index: true },
        softwareId: { type: mongoose.Schema.Types.ObjectId, ref: 'Softwares', index: true }
    }, { strict: false }))
};

app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));

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

app.get('/api/:collection/search/:query', async (req, res) => {
    try {
        const collection = collections[req.params.collection];
        if (!collection) return res.status(400).send('Invalid collection');

        const query = req.params.query;
        const regex = new RegExp(query, 'i');
        let objectIdQuery = null;

        const results = await collection.find({
            $or: [
                { name: regex },
                { email: regex },
                { id: regex },
                { address: regex },
                { purchasedSoftwares: regex },
                { orderDate: regex },
                { totalAmount: regex },
                { items: regex },
                { amount: regex },
                { paymentDate: regex },
                { paymentMethod: regex },
                { price: regex },
                { version: regex },
                { category: regex },
                { status: regex }
            ].filter(condition => condition !== null)
        });
        res.json(results);
    } catch (err) {
        res.status(500).send('Error searching');
    }
});

app.get('/api/:collection/indexes', async (req, res) => {
    try {
        const collection = collections[req.params.collection];
        if (!collection) return res.status(400).send('Invalid collection');
        const indexes = await collection.collection.indexes();
        res.json(indexes);
    } catch (err) {
        res.status(500).send('Error fetching indexes');
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
