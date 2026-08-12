import express from "express";
const app = express();
app.use(express.json());
let products = [
    {
        id: 1,
        name: "Product 1",
        price: 3000,
        imgurl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBTLWdch1o43N-Zir53M_TRK0hbPLWjfCQz3mi3WkPAQbYuo8s7WYqKT-i&s=10",
        description: "This is product 1"
    },
    {
        id: 2,
        name: "Product 2",
        price: 4000,
        imgurl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6d8A7LkVFq8F10Z2Gagheng7Esqdh1AR05orXtSp3ng&s",
        description: "This is product 2"
    }
];
app.get("/products", (req, res) => {
    res.json(products);
});

app.post("/products", (req, res) => {
    const newProduct = req.body;
    products.push(newProduct);
    res.status(201).json(newProduct);
});
app.delete("/products/:id", (req, res) => {
    const { id } = req.params;
    
    products = products.filter((product) => product.id !== parseInt(id));
    res.status(204).send();
});

app.put("/products/:id", (req, res) => {
    const { id } = req.params;

    const product = products.find((product) => product.id === parseInt(id));

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    product.name = req.body.name;
    product.price = req.body.price;
    product.imgurl = req.body.imgurl;
    product.description = req.body.description;

    res.json(product);
});





app.listen(5050, () => {
  console.log("Server is running on port 5050");
});

