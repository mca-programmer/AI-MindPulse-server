const express = require('express')
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors());
app.use(express.json())


//vIguEMDXiP3GEI4G
//assignment10
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mca-programmer.xd7qlcv.mongodb.net/?appName=mca-programmer`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
app.get('/', (req, res) => {
  res.send('Hello server!')
})


async function run() {
  try {
    // await client.connect();

    const db = client.db('ai_model');
    const allAiCollection = db.collection("allAiCollection")
     const purchaseColl = db.collection("purchaseColl");

  
  //post all ai data
   app.post("/allai",async(req,res) =>{
    const newAi = req.body;
    const result = await allAiCollection.insertOne(newAi);
    res.send(result);
   })


  
   //post my modal
   app.post("/mymodal",async(req,res) =>{
    const myAi = req.body;
    const result = await allAiCollection.insertOne(myAi);
    res.send(result);
   })

  


   // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 