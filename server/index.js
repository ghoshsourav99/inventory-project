const express = require("express");
const mySql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mySql.createConnection({
  host: "localhost",
  user: "root",
  password: "YourNewPassword123",
  database: "inventory_db",
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed", err);
  } else {
    console.log("Connected to database");
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the Inventory Management System API");
});

app.post("/add-item", (req, res) => {
  const name = req.body.name;
  const quantity = req.body.quantity;
  const price = req.body.price;

  const sqlInsert =
    "INSERT INTO products (name, quantity, price) VALUES (?, ?, ?)";
  db.query(sqlInsert, [name, quantity, price], (err, result) => {
    if (err) {
      console.log("Error inserting item", err);
      res.status(500).send("error inserting item");
    } else {
      res.send("Item added successfully");
    }
  });
});

app.get("/products", (req, res) => {
  const sqlSelect = "SELECT * FROM products";

  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log("Error fetching products", err);
      res.status(500).send("errr fetching products");
    } else {
      res.send(result);
    }
  });
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sqlDelete = "DELETE FROM products WHERE id = ?";

  db.query(sqlDelete, [id], (err, result) => {
    if (err) {
      console.log("Error deleting product", err);
      res.status(500).send("error deleting data");
    } else {
      res.send("Product deleted successfully");
    }
  });
});

app.put("/update", (req, res) => {
  const id = req.body.id;
  const quantity = req.body.quantity;
  const sqlUpdate = "UPDATE products SET quantity = ? Where id = ?";

  db.query(sqlUpdate, [quantity, id], (err, result) => {
    if (err) {
      console.log("Error updating product", err);
      res.status(500).send("error updating data");
    } else {
      res.send("Product updated successfully");
    }
  });
})

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
