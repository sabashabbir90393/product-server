
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
id: {
type: String,
required: true,
},
name:{
type:  String,
} ,
price:{
    type: String,

},
imgurl:{
    type: String
},
desc:{
type: String

},

})
const Product = mongoose.model("product", ProductSchema);
export default Product;