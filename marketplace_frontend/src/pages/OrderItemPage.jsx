import React from "react";
import { Routes, Route } from "react-router-dom";
import OrderItemList from "../components/OrderItem/OrderItemList";
import OrderItemForm from "../components/OrderItem/OrderItemForm";


const OrderItemPage = () => {
    return (
        <Routes>
            <Route index element={<OrderItemList />} />
            <Route path="add" element={<OrderItemForm />} />
            <Route path="edit/:id" element={<OrderItemForm />} />
        </Routes>
    );
};

export default OrderItemPage;