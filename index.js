const mongoose = require("mongoose");
const express = require("express");
// const { product, products } = require("./sample-data/products");
// const categories = require("./sample-data/categories");
// const categories = require('./sample-data/categories')
const app = express();
app.use(express.json())
const host = "localhost";
const port = 8000;

async function dbConnect() {
  try {
  await mongoose.connect("mongodb://127.0.0.1:27017/olxClone");
  console.log(`App is connected with host ${host} at port ${port}`)
  } catch(error) {
      console.log(`Unable to connect with database sevrver. the error is ${error.message}`)
  }
}
dbConnect();



const CatagoriesSchema = new mongoose.Schema({
  title: String,
  isAvail: Boolean,
  Age: String 
});
const Catagories = mongoose.model("catagory", CatagoriesSchema);


app.get("/", (req, res) => {
  // res.send("Hello World, wao this is message")
  res.send({ message: "Hello world wao this is test message" });
});

// get method for catagories section

app.get("/catagories", async (req, res) => {
  try {
    const catagories = await Catagories.find({});
    if (catagories.length < 1){
        res.status(404).json({message : "section is empty"})
    }
    res.status(200).json(catagories);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// get method for single catagory
app.get("/catagories/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const catagory = await Catagories.findOne({ _id: id });
    if (!catagory) {
      res.status(404).json({ message: "This product doesn't exist" });
    }else{

        res.status(200).json(catagory);
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }

});

// delete method for single catagory
app.delete("/catagories/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const catagory = await Catagories.findByIdAndDelete({ _id: id });
    if (!catagory) {
      res.status(404).json({ message: "this product doesn't exist"});
      return
    }
    res
      .status(200)
      .json({ message: "This product has been deleted", data: catagory });

    res.status(200).json(catagory);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }

});

// post method for single catagory
app.post("/catagories/", async(req, res)=>{

    try {
        const data = req.body
        console.log(data)
        const catagory = new Catagories(data)
        await catagory.save()
        res.status(201).json({message: "catagory is posted", data : catagory})
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "internal server error", error: error.message})
    }
    
})

app.listen(port, host, () => {
  console.log("Server is running");
});
    

// product schema

const productsSchema = new mongoose.Schema({
  title : String,
  price : String,
  description: String,
  rating : Object

})

// get method for products section
const Products = mongoose.model("product", productsSchema);

app.get("/products", async(req, res)=>{

  try {
    const products = await Products.find({})
    res.status(200).json(products)
  } catch (error) {
    res.status(404).json({message: "theres sever error", error : error.message})
  }

})

// get method for single product

app.get("/products/:id", async(req, res)=>{
  const {id} = req.params

  try {
    const products = await Products.findOne({_id: id})
    res.status(200).json(products)
  } catch (error) {
    res.status(404).json({message: "theres sever error", error : error.message})
  }

})

// delete method for product

app.delete("/products/:id", async(req,res)=>{
  
  const {id} = req.params 

  try {
    const product = await Products.findByIdAndDelete({_id: id})
    if (!product) {
      res.json({message:"this product doesn't exist"})
      return
    }
    res
    .status(200)
    .json({message : "the product has deleted",data: product})
    
  } catch (error) {
    res.status(404).json({message: "theres server error", error : error.message})
  }
})


app.post("/products", async (req,res)=>{

try {
  const data = req.body
  console.log(data)
  const product = new Products(data)
  await product.save()
  res.status(201).json({message: "catagory is posted", data : product})
} catch (error) {
  console.log(error)
  res.status(500).json({message : "internal server error", error: error.message})
}

})

const usersSchema = new mongoose.Schema({
    email: String,
    name: Object,
    
  });
  const Users = mongoose.model("users", usersSchema);

  app.get("/users", async (req, res) => {
    try {
      const users = await Users.find({});
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  });

  app.get("/users/:id", async (req,res)=>{
    const {id} = req.params
    try {
      const user = await Users.findOne({_id : id})
      if (!user) {
        res.status(404).json({message: "this user does not exist"})
        return
      }
      res.status(200).json(user)
    } catch (error) {
      res.status(404).json({message: "theres server error", error : error.message})
    }
  })

  app.delete("/users/:id", async (req, res)=>{
    const {id} = req.params
    
    try {
      const user = await Users.findByIdAndDelete({_id:id})
      if (!user) {
        res.status(500).json({message :"this product doesnot exist"})
        return
      }
      res.status(200).json({message : "the product has been deleted",data : user})
    } catch (error) {
      res.status(404).json({message : "theres server error", error : error.message})
    }
  })

app.post("/users", async (req, res)=>{
  try {
    
  const data = req.body
  console.log(data)
  const user = new Users(data)
  await user.save()
  res.status(201).json({message: "the new user has been added" , data:user})

} catch (error) {
    res.status(404).json({message : "theres some server error", error : error.message})
}
})