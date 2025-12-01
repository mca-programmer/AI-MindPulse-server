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

  //get home data from mongo db
  app.get("/allai",async(req,res)=>{
    const cursor = allAiCollection.find().sort({createdAt:-1}).limit(6);
    const result = await cursor.toArray();
    res.send(result);
  })



  //GEt all modals

  app.get("/allmodals",async(req,res)=>{
    const cursor = allAiCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  })

  
//all purchase collection
 app.get("/userpurchase/:purchasedby",async(req,res)=>{
    const purchasedby = req.params.purchasedby;
    const filter = {purchasedby:purchasedby}
    const result = await purchaseColl.find(filter).toArray();
    res.send(result);
  })

  //get certai data for details
  app.get("/models/:id", async(req,res) =>{
      const id = req.params.id;
        const filter = {_id: new ObjectId(id)}

        const result = await allAiCollection.findOne(filter);
        res.send(result);
  })


  //get my modals through email
   app.get("/model/:email", async(req,res) =>{
      const email = req.params.email;
        const filter = {createdBy: email}

        const result = await allAiCollection.find(filter).toArray();
        res.send(result);
  })





  // get data through framework
   app.get("/find/:framework", async(req,res) =>{
      const framework = req.params.framework;
        const filter = {framework: framework}

        const result = await allAiCollection.find(filter).toArray();
        res.send(result);
  })



  // DELETE a specific model by its ID
    app.delete('/models/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      // Try to delete the document
      const result = await allAiCollection.deleteOne(filter);

      if (result.deletedCount === 1) {
        res.status(200).send({ message: 'Item deleted successfully' });
      } else {
        res.status(404).send({ message: 'Item not found' });
      }
    });


 
  // Post purchase data
app.post("/purchase", async (req, res) => {
  const data = req.query;
 console.log(data.email);

  const filter = { _id: new ObjectId(data.id) };

  try {
  
    const purchasedModel = await allAiCollection.findOne(filter);
    if (!purchasedModel) {
      return res.status(404).send({ message: 'Model not found' });
    }

   
    const updatedModel = {
      ...purchasedModel,
      purchased: purchasedModel.purchased + 1 ,
      purchasedby:data.email
    };

    await purchaseColl.insertOne(updatedModel); 

   
    await allAiCollection.updateOne(
      filter,
      { $inc: { purchased: 1 } } 
    );

    
    res.send({ message: 'Purchase successful', model: updatedModel });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Something went wrong' });
  }
});





   // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 