import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    createOrder,
    updateOrder,
    getOrderById,
} from "../../services/OrderService";
import { getAllUsers } from "../../services/UserService";

const OrderForm = () => {
    const [order, setOrder] = useState({
        tax: 0,
        currency: "",
        payMethod: "",
        paymentStatus: "",
        orderDate: "",
        userId: "",
    });

    const [user, setUser] = useState([])
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadUsers()
        if (id) loadOrder();
    }, [id]);

    const loadUsers = async () => {
        try{
            const res = await getAllUsers();
            setUser(res.data);
        } catch (error) {
            console.error("Error getting user list", error);
            Swal.fire("Error", "Failed to load users", "error");
        }
    };

    const loadOrder = async () => {
        try {
            const res = await getOrderById(id);
            const data = res.data;
            setOrder({
                tax: data.tax || 0,
                currency: data.currency || "",
                payMethod: data.payMethod || "",
                paymentStatus: data.paymentStatus || "",
                userId: data.userId || "",
            });
        } catch (error) {
            console.error("Error loading order", error);
            Swal.fire("Error", "Failed to load order data", "error");
        }
    };

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setOrder({
            ...order,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            tax: order.tax || 0,
            currency: order.currency,
            payMethod: order.payMethod || "",
            paymentStatus: order.paymentStatus || "",
            userId: Number(order.userId),
        };

        try{
            if (id) {
                await updateOrder(id, payload);
                Swal.fire("Updated", "Order updated successfully", "success");
            } else {
                await createOrder(payload);
                Swal.fire("Created", "Order created successfully", "success");
            }
            navigate("/orders");
        } catch (error) {
            console.error("Error saving order", error);
            Swal.fire("Error", "Failed to save order", "error");
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Edit Order" : "Add Order"}</h2>
            <form onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label className="form-label">Tax</label>
                    <input
                    type="number"
                    name="tax"
                    className="form-control"
                    value={order.tax}
                    onChange={handleChange}
                    required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Currency</label>
                    <select
                        name="currency"
                        className="form-select"
                        value={order.currency}
                        onChange={handleChange}
                        required
                    >
                        <option value="">--Select Currency--</option>
                        <option value="Bs">Bolivianos</option>
                        <option value="USD">Dolares Estadounidenses</option>
                        <option value="Eur">Euros</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Payment Method</label>
                    <select
                        name="payMethod"
                        className="form-select"
                        value={order.payMethod}
                        onChange={handleChange}
                        required
                    >
                        <option value="">--Select Payment Method--</option>
                        <option value="Visa">Visa</option>
                        <option value="MasterCard">MasterCard</option>
                        <option value="Paypal">Paypal</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Payment Status</label>
                    <select
                        name="paymentStatus"
                        className="form-select"
                        value={order.paymentStatus}
                        onChange={handleChange}
                    >
                        <option value="">--Null--</option>
                        <option value="Complete">Completed</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">User</label>
                    <select
                        name="userId"
                        className="form-select"
                        value={order.userId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">--Select User--</option>
                        {user.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.firstName} {user.lastName}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn btn-success me-2">
                    Save
                </button>
                <buttona
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/orders")}
                >
                    Cancel
                </buttona>
            </form>
        </div>
    )
}

export default OrderForm;