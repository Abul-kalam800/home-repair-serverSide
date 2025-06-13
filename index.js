const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { ServerApiVersion, MongoClient, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

//midlearwar
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const collectionAllservices = client
      .db("Home_repair_services")
      .collection("Popular_services");
    const collectionBooking = client
      .db("Home_repair_services")
      .collection("Booking");

    // popular services  api
    app.get("/popular_services", async (req, res) => {
      const result = await collectionAllservices.find().limit(6).toArray();

      res.send(result);
    });
    //all services Api
    app.get("/allservices", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.providrEmail = email;
      }

      const result = await collectionAllservices.find(query).toArray();
      res.send(result);
    });
    //  service Details api

    app.get("/allservices/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await collectionAllservices.findOne(query);
      res.send(result);
    });

    //add services
    app.post("/allservices", async (req, res) => {
      const newService = req.body;
      const result = await collectionAllservices.insertOne(newService);
      res.send(result);
    });

    // update services
    app.put("/allservices/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const serviceUpdate = req.body;
      const updateDoc = {
        $set: serviceUpdate,
      };
      console.log(updateDoc);
      const result = await collectionAllservices.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    //delet api
    app.delete("/allservices/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await collectionAllservices.deleteOne(query);
      res.send(result);
    });

    // Booking Api
    app.post("/booking", async (req, res) => {
      const bookingData = req.body;
      const result = await collectionBooking.insertOne(bookingData);
      res.send(result);
    });
    //booking service get api
    app.get("/booking", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.currenUserEmail = email;
      }
      const result = await collectionBooking.find(query).toArray();
      res.send(result);
    });

    //my services booking api

    app.get('/myservicesbookings',async(req,res)=>{
      const provider = req.query.providerEmail;
      const query ={providerEmail:provider}
    
       const result = await collectionBooking.find(query).toArray();
       res.send(result)

    })

    //status update
    app.patch('/myservicesbookings/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = { _id: new ObjectId(id)}
      const updateDoc={
        $set:{
          status:req.body.status
        } 
            
        }
        const result = await collectionBooking.updateOne(filter,updateDoc)
        res.send(result)

      
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //  await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("My server is runing");
});

app.listen(port, () => {
  console.log(`MY server is rouning this : ${port}`);
});
