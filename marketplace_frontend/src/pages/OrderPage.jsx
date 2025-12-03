import React from "react";
import { Routes, Route } from "react-router-dom";
import OrderList from "../components/Order/OrderList";
import OrderForm from "../components/Order/OrderForm";
import OrderItemForm from "../components/OrderItem/OrderItemForm";


const OrderPage = () => {
    return (
        <Routes>
            <Route index element={<OrderList />} />
            <Route path="add" element={<OrderForm/>} />
            <Route path="edit/:id" element={<OrderForm />} />
            <Route path="/:orderId/add-item" element={<OrderItemForm />} />
        </Routes>
    );
};

export default OrderPage;