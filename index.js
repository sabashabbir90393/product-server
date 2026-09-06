import express from "express";
import Product from "./model/Product.js";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Direct fallback URL taakay env missing hone par server crash na ho
const MONGO_URI = process.env.MONGODB_URL || "mongodb+srv://admin:RgVQFeVvzuoooSOU@cluster0.n4qkvcw.mongodb.net/?retryWrites=true&w=majority";

async function ConnectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

ConnectDB();

app.use(cors());
app.options("*", cors());
app.use(express.json());

// GET PRODUCTS
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
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

// DELETE PRODUCT
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Product.findByIdAndDelete(id);
    } else {
      await Product.findOneAndDelete({ id });
    }
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
});

// PUT PRODUCT
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

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});