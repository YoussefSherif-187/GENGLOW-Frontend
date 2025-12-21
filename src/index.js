import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { CartProvider } from "./cart/CartContext";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
   <CartProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
   </CartProvider>
  </AuthProvider>,
);
