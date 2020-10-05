const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.extbg.mongodb.net/volunteerNetwork?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(cors());
app.use(bodyParser.json());
// Show data from form
app.use(bodyParser.urlencoded({ extended: false }));


client.connect((err) => {
  const allTaskCollection = client
    .db('volunteerNetwork')
    .collection('volunteertasks');
  const newTaskCollection = client
    .db('volunteerNetwork')
    .collection('newtaskcollection');

  // Show All Task from database
  app.get('/tasks', (req, res) => {
      allTaskCollection.find({}).limit(20)
          .toArray((err, documents) => {
      res.send(documents);
    });
  });

  // Add new Volunteer Task
  app.post('/newVolunteer', (req, res) => {
    const newUserTask = req.body;
    newTaskCollection.insertOne(newUserTask).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  // Show Logged in user Task
  app.get('/newVolunteer', (req, res) => {
    const requestEmail = req.query.email;
    newTaskCollection
      .find({ 'newVolunteer.email': requestEmail })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  // Show new volunteer data for admin
  app.get('/allVolunteer', (req, res) => {
      newTaskCollection.find({})
          .toArray((err, documents) => {
      res.send(documents);
    });
  });

  // Delete user Task
  app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
      newTaskCollection.deleteOne({ _id: ObjectId(id) })
          .then((result) => {
      res.send(result.deletedCount > 0);
    });
  });

  // Admin Delete user Task
  app.delete('/adminDelete/:id', (req, res) => {
    const id = req.params.id;
      newTaskCollection.deleteOne({ _id: ObjectId(id) })
          .then((result) => {
      res.send(result.deletedCount > 0);
    });
  });

  // Add Event
  app.post('/newEvent', (req, res) => {
      const newEvent = req.body;
      allTaskCollection.insertOne(newEvent)
          .then((result) => {
        res.send(result.insertedCount > 0);
      });
  });
    
    
});

app.listen(5000)