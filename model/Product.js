import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  price: {
    type: String,
    required: true,
  },

  imgurl: {
    type: String,
    required: true,
  },

  desc: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("product", ProductSchema);

export default Product;