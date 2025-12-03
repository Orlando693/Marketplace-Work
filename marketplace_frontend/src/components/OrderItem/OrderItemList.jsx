import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getAllOrderItems,
    deleteOrderItem,
} from "../../services/OrderItemService"

const OrderItemList = () => {
    const [orderItems, setOrderItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadOrderItems();
    })

    const loadOrderItems = async () => {
        try{
            const res = await getAllOrderItems();
            setOrderItems(res.data);
        } catch (error) {
            console.error("Error loading OrderItems", error);
            Swal.fire("Error", "Failed to load OrderItems", "error");
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This orderItem will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteOrderItem(id);
                    Swal.fire("Deleted!", "Employee has been deleted.", "success");
                    loadOrderItems();
                } catch (error) {
                    console.error("Error deleting employee:", error);
                    Swal.fire("Error", "Failed to delete employee", "error");
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Order Item List</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/orderItems/add")}
                >
                    Add Order Item
                </button>
            </div>

            <table className="table table-striped align-middle">
                <thead className="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                    <th>Order ID</th>
                    <th style={{ width: "160px" }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {orderItems.length > 0 ? (
                    orderItems.map((e) => (
                        <tr key={e.id}>
                            <td>{e.id}</td>
                            <td>
                                {e.productName}
                            </td>
                            <td>{e.quantity}</td>
                            <td>{e.price}</td>
                            <td>
                                {e.subtotal}
                            </td>
                            <td>{e.orderId}</td>
                            <td>
                                <Link
                                    to={`/orderItems/edit/${e.id}`}
                                    className="btn btn-warning btn-sm me-2"
                                >
                                    Edit
                                </Link>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(e.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7" className="text-center text-muted">
                            No Order items found.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default OrderItemList;