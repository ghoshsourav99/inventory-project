import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = () => {
    axios.get("http://localhost:3001/products").then((response) => {
      setProducts(response.data);
    });
  };

  const submitProduct = () => {
    axios.post("http://localhost:3001/add-item",{
      name: name,
      quantity: quantity,
      price: price,
    }).then(() => {   
         getProducts();
         alert("Product added successfully");
         setName("");
         setQuantity(0);
         setPrice(0);
    });
  }

  const deleteProduct = (id ) => {
    axios.delete(`http://localhost:3001/delete/${id}`).then((response) => {
getProducts();
      // products.filter((product) => product.id !== id);
      alert("Product deleted successfully");
    })
  }

  const updateProduct = (id, quantity) => {
    if (quantity < 0) {
      alert("Quantity cannot be negative");
      return;
    }
    axios.put("http://localhost:3001/update", {
      id: id,
      quantity: quantity,
    }).then((response) => {
      getProducts();
      alert("Product updated successfully");
    })
  }

  return (
    <div className="App">
      <h1>Inventory Management System</h1>

      <div className="form">
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            value={name}
            placeholder="e.g. Laptop"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label>Price ($)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
          />
        </div>

        <button className="btn-add" onClick={submitProduct}>
          Add Product
        </button>
      </div>

      <h2>Product List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index ) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              {/* Visual Cue: If quantity < 5, apply 'low-stock' class */}
              <td className={product.quantity < 5 ? "low-stock" : ""}>
                {product.quantity} {product.quantity < 5 && "(Low!)"}
              </td>
              <td>${Number(product.price).toFixed(2)}</td>
              <td>
                <button
                  className="btn-qty"
                  onClick={() =>
                    updateProduct(product.id, product.quantity + 1)
                  }
                >
                  +
                </button>
                <button
                  className="btn-qty"
                  onClick={() =>
                    updateProduct(product.id, product.quantity - 1)
                  }
                >
                  -
                </button>
                <button
                  className="btn-delete"
                  onClick={() => deleteProduct(product.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
