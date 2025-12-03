import React from "react";
import { Routes, Route } from "react-router-dom";
import ProductList from "../components/Product/ProductList.jsx";
import ProductForm from "../components/Product/ProductForm.jsx";

const ProductPage = () => {
    return (
        <Routes>
            <Route index element={<ProductList />} />
            <Route path="add" element={<ProductForm/>} />
            <Route path="edit/:id" element={<ProductForm />} />
        </Routes>
    );
};

export default ProductPage;