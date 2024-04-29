const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;




app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ld1lprp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const spotCollection = client.db('bonVoyageDB').collection('spot');

    // show data in server
    app.get('/newSpot', async (req, res) => {
      const cursor = spotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })



    app.post('/newSpot', async (req, res) => {
      const newSpot = req.body;
      console.log(newSpot);
      const result = await spotCollection.insertOne(newSpot);
      res.send(result);
    })

    app.get("/showList/:email", async (req, res) => {
      // const newSpot = req.body;
      console.log(req.params.email);
      const result = await spotCollection.find({ email: req.params.email }).toArray();
      // const result = await spotCollection.insertOne(newSpot);
      res.send(result);
    })


    app.get("/viewDetails/:_id", async (req, res) => {
      console.log(req.params._id);
      const result = await spotCollection.findOne({ _id: new ObjectId(req.params._id) });
      console.log(result)
      res.send(result)
    })


    app.delete("/showList/delete/:_id", async (req, res) => {
      const result = await spotCollection.deleteOne({ _id: new ObjectId(req.params._id) });
      console.log(result)
      res.send(result)
    })


    app.put("/showList/update/:_id", async (req, res) => {
      const id = req.params._id; // Use req.params._id to access the _id parameter
      const query = { _id: new ObjectId(id) };
      const data = {
        $set:{
          tourists_spot_name:req.body.tourists_spot_name,
          country_Name:req.body.country_Name,
          location:req.body.location,
          average_cost:req.body.average_cost,
          short_description:req.body.short_description,
          seasonality:req.body.seasonality,
          travel_time:req.body.travel_time,
          totaVisitorsPerYear:req.body.totaVisitorsPerYear,
          image:req.body.image,
         
        }
      }
      const result = await spotCollection.updateOne(query ,data);
      console.log(result);
      res.send(result);
  });

   

  

    


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('bon voyge is running')

})

app.listen(port, () => {
  console.log(`bon voyge is running on port:${port}`)
})