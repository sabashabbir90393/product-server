import express from "express";
import Product from "./model/Product.js";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns/promises";

dotenv.config();
const app = express();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

async function ConnectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

ConnectDB();

// FIX 1: Allow all origins so Netlify & Localhost both work seamlessly
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// GET PRODUCTS
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// POST PRODUCT
app.post("/products", async (req, res) => {
  try {
    const newProductFields = req.body;
    const newProduct = new Product(newProductFields);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error adding product" });
  }
});

// DELETE PRODUCT (FIX 2: Handles both Mongoose _id and custom id)
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Product.findByIdAndDelete(id);
    } else {
      await Product.findOneAndDelete({ id });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
});

// PUT PRODUCT (FIX 3: Handles both Mongoose _id and custom id)
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProductFields = req.body;
    let updatedProduct;

    if (mongoose.Types.ObjectId.isValid(id)) {
      updatedProduct = await Product.findByIdAndUpdate(
        id,
        updatedProductFields,
        { new: true }
      );
    } else {
      updatedProduct = await Product.findOneAndUpdate(
        { id },
        updatedProductFields,
        { new: true }
      );
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
});

// Dynamic Port for Railway Deployment
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});