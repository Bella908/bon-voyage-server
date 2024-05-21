const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;




app.use(cors(
  {
    origin :['https://aquamarine-lolly-14003a.netlify.app'],
    credentials: true,
    optionSuccessStatus: 200,
  }
));
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
    // await client.connect();
    const countryCollection = client.db('bonVoyageDB').collection('Contries');

    const spotCollection = client.db('bonVoyageDB').collection('spot');

    // show data in server
    app.get('/newSpot', async (req, res) => {
      const cursor = spotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.get('/services', async (req, res) => {
      const filter = req.query;
      console.log(filter);
      const query = {
          // price: { $lt: 150, $gt: 50 }
          // db.InspirationalWomen.find({first_name: { $regex: /Harriet/i} })
          title: {$regex: filter.search, $options: 'i'}
      };

      const options = {
          sort: {
            average_cost: filter.sort === 'asc' ? 1 : -1
          }
      };

      const cursor = spotCollection.find(query, options);
      const result = await cursor.toArray();
      res.send(result);
  })



    
    app.get('/countries', async (req, res) => {
      const cursor = countryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.get('/countries/:country_Name', async (req, res) => {
      try {
          const cursor = spotCollection.find({ country_Name: req.params.country_Name });
          const result = await cursor.toArray();
          res.send(result);
      } catch (error) {
          console.error("Error fetching subcountries:", error);
          res.status(500).send("Internal Server Error");
      }
  });
  
    



    app.post('/newSpot', async (req, res) => {
      const newSpot = req.body;
      console.log(newSpot);
      const result = await spotCollection.insertOne(newSpot);
      res.send(result);
    })

    app.get("/showList/:email", async (req, res) => {
      // const newSpot = req.body;
      
      const result = await spotCollection.find({ email: req.params.email }).toArray();
      // const result = await spotCollection.insertOne(newSpot);
      res.send(result);
    })


    app.get("/viewDetails/:_id", async (req, res) => {
     
      const result = await spotCollection.findOne({ _id: new ObjectId(req.params._id) });
      
      res.send(result)
    })


    app.delete("/showList/delete/:_id", async (req, res) => {
      const result = await spotCollection.deleteOne({ _id: new ObjectId(req.params._id) });

      res.send(result)
    })


    app.get("/showList/update/:_id", async (req, res) => {
      console.log(req.params._id);
      const result = await spotCollection.findOne({ _id: new ObjectId(req.params._id) });
      console.log(result)
      res.send(result)
    })


    app.put("/showList/update/:_id", async (req, res) => {
      const id = req.params._id;
     
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