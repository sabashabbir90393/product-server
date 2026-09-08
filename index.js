import express from "express";
import Product from "./model/Product.js";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();

import dns from "node:dns/promises";
dns.setServers(["1.1.1.1" ,"8.8.8.8"]);
  
async function ConnectDB() {
  try {
    await mongoose.connect(process.env.  
      MONGODB_URL);
      console.log(" MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}


ConnectDB();

app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST" , "PUT", "DELETE"],
  
  })
);
app.use(express.json());

app.get("/products",async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });

  }
});

app.post("/products",async (req, res) => {
  try{
     const newProductFields = req.body;
   const  newProduct = new Product(newProductFields);
   await newProduct.save();
    res.status(201).json(newProduct);
  }catch (error) {
    res.status(500).json({ message: "Error fetching products" });

  }
   
  });


app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      message: "Error deleting product",
    });
  }
});



  
 app.put("/products/:id", async (req, res) => {
  try{
    const { id } = req.params;
     const updatedProductFields = req.body;
     const updatedProduct = await Product.findByIdAndUpdate(
  id,
  updatedProductFields,
  { new: true }
);

if (!updatedProduct) {
  return res.status(404).json({
    message: "Product not found",
  });
}

res.status(200).json(updatedProduct);
 
      /* res.status(200).json( updatedProduct); */
    }catch (error) {
  console.error("Update error:", error);
  res.status(500).json({
    message: "Error updating product",
  });
}
  }); 

app.listen(5050, () => {
  console.log("Server is running on port 5050");
});