import React from "react";
import { Routes, Route } from "react-router-dom";
import StoreList from "../components/Store/StoreList.jsx";
import StoreForm from "../components/Store/StoreForm.jsx";

const StorePage = () => {
    return (
        <Routes>
            <Route index element={<StoreList />} />
            <Route path="add" element={<StoreForm/>} />
            <Route path="edit/:id" element={<StoreForm />} />
        </Routes>
    );
};

export default StorePage;