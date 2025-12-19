import React, { useEffect, useState } from "react";
import axios from "axios";

import AdminSidebar from "../comp/AdminSidebar";
import Alerts from "../comp/Alerts";
import ConfirmModal from "../comp/ConfirmModal";

import "../pagesstyles/dashboard.css";
import "../adminstyles/allproducts.css";

const AllProducts = () => {
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  // CREATE FORM (FULL)
  const [createForm, setCreateForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    supplier: "",
    image: null
  });

  // UPDATE FORM (LIMITED)
  const [updateForm, setUpdateForm] = useState({
    name: "",
    category: "",
    description: "",
    price: ""
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const showAlert = (type, msg) => {
    setAlertType(type);
    setAlertMessage(msg);
    setTimeout(() => {
      setAlertType(null);
      setAlertMessage("");
    }, 3000);
  };

  // ================= FETCH =================
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "https://genglow-backend.vercel.app/api/products",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch {
      showAlert("error", "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // ================= CREATE =================
  const handleCreateProduct = async () => {
    if (!createForm.image) {
      showAlert("error", "Image is required");
      return;
    }

    try {
      const body = new FormData();
      body.append("name", createForm.name);
      body.append("category", createForm.category);
      body.append("description", createForm.description);
      body.append("price", createForm.price);
      body.append("stock", createForm.stock);
      body.append("supplier", createForm.supplier);
      body.append("image", createForm.image);

      await axios.post(
        "https://genglow-backend.vercel.app/api/products",
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showAlert("success", "Product created successfully");
      setCreateForm({
        name: "",
        category: "",
        description: "",
        price: "",
        stock: "",
        supplier: "",
        image: null
      });
      fetchProducts();
    } catch (err) {
      console.error(err.response?.data || err.message);
      showAlert("error", "Failed to create product");
    }
  };

  // ================= UPDATE =================
  const handleUpdateProduct = async () => {
    try {
      const body = new FormData();
      body.append("name", updateForm.name);
      body.append("description", updateForm.description);
      body.append("category", updateForm.category);
      body.append("price", updateForm.price);

      await axios.put(
        `https://genglow-backend.vercel.app/api/products/${editProduct._id}`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showAlert("success", "Product updated successfully");
      setEditProduct(null);
      fetchProducts();
    } catch {
      showAlert("error", "Failed to update product");
    }
  };

  // ================= DELETE =================
  const handleDeleteProduct = async () => {
    try {
      await axios.delete(
        `https://genglow-backend.vercel.app/api/products/${deleteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showAlert("success", "Product deleted successfully");
      setDeleteId(null);
      fetchProducts();
    } catch {
      showAlert("error", "Failed to delete product");
    }
  };

  return (
    <div className="layout">
      <AdminSidebar />

      <main className="main-content all-products">
        {alertType && <Alerts type={alertType} message={alertMessage} />}

        <ConfirmModal
          show={!!deleteId}
          message="Are you sure you want to delete this product?"
          confirmText="Yes, Delete Product"
          cancelText="Cancel"
          onCancel={() => setDeleteId(null)}
          onConfirm={handleDeleteProduct}
        />

        {loading ? (
          <div className="loading-state">Loading products...</div>
        ) : (
          <>
            <h2 className="page-title">All Products</h2>

            {/* CREATE */}
            <div className="card">
              <h3 className="card-title">Create Product</h3>

              <div className="form-grid">
                <input className="form-input" placeholder="Name"
                  value={createForm.name}
                  onChange={e => setCreateForm({ ...createForm, name: e.target.value })} />

                <input className="form-input" placeholder="Category"
                  value={createForm.category}
                  onChange={e => setCreateForm({ ...createForm, category: e.target.value })} />

                <textarea className="form-input" placeholder="Description"
                  value={createForm.description}
                  onChange={e => setCreateForm({ ...createForm, description: e.target.value })} />

                <input type="number" className="form-input" placeholder="Price"
                  value={createForm.price}
                  onChange={e => setCreateForm({ ...createForm, price: e.target.value })} />

                <input type="number" className="form-input" placeholder="Stock"
                  value={createForm.stock}
                  onChange={e => setCreateForm({ ...createForm, stock: e.target.value })} />

                <input className="form-input" placeholder="Supplier ID"
                  value={createForm.supplier}
                  onChange={e => setCreateForm({ ...createForm, supplier: e.target.value })} />

                <div className="file-upload">
  <input
    type="file"
    id="supplier-image"
    accept="image/*"
    hidden
    onChange={(e) =>
      setCreateForm({ ...createForm, image: e.target.files[0] })
    }
  />

  <label htmlFor="supplier-image" className="file-upload-btn">
    Choose Image
  </label>

  {createForm.image && (
    <span className="file-name">{createForm.image.name}</span>
  )}
</div>
              </div>

              <button className="primary-btn" onClick={handleCreateProduct}>
                Create Product
              </button>
            </div>

            {/* UPDATE */}
            {editProduct && (
              <div className="card danger">
                <h3 className="card-title">Update Product</h3>

                <div className="form-grid">
                  <input className="form-input"
                    value={updateForm.name}
                    onChange={e => setUpdateForm({ ...updateForm, name: e.target.value })} />

                  <input className="form-input"
                    value={updateForm.category}
                    onChange={e => setUpdateForm({ ...updateForm, category: e.target.value })} />

                  <textarea className="form-input"
                    value={updateForm.description}
                    onChange={e => setUpdateForm({ ...updateForm, description: e.target.value })} />

                  <input type="number" className="form-input"
                    value={updateForm.price}
                    onChange={e => setUpdateForm({ ...updateForm, price: e.target.value })} />
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button className="primary-btn" onClick={handleUpdateProduct}>
                    Update Product
                  </button>
                  <button className="secondary-btn" onClick={() => setEditProduct(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* LIST */}
            <div className="card">
              <h3 className="card-title">Products List</h3>

              <table className="products-table">
                <tbody>
                  {products.map(p => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>${p.price}</td>
                      <td>{p.stock}</td>
                      <td>
                       <div className="btn-row">
  <button
    className="secondary-btn"
    onClick={() => {
      setEditProduct(p);
      setUpdateForm({
        name: p.name,
        category: p.category,
        description: p.description,
        price: p.price
      });
    }}
  >
    Edit
  </button>

  <button
    className="danger-btn"
    onClick={() => setDeleteId(p._id)}
  >
    Delete
  </button>
</div>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AllProducts;
