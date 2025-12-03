import React, { useEffect, useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import {
    getAllOrders,
    deleteOrder,
} from "../../services/OrderService";

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        loadOrders();
    })

    const loadOrders = async () => {
        try{
            const res = await getAllOrders();
            setOrders(res.data);
        } catch (error) {
            console.error("Error loading orders", error);
            Swal.fire("Error", "Error loading orders", "error");
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This order will be deleted permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if(result.isConfirmed){
                try{
                    await deleteOrder(id);
                    Swal.fire("Deleted!", "Order deleted", "success");
                    loadOrders();
                } catch (error) {
                    console.error("Error deleting order", error);
                    Swal.fire("Error", "Failed to delete order", "error");
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Order List</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/orders/add")}
                >
                    Add Order
                </button>
            </div>

            <table className="table table-striped align-middle">
                <thead className="table-dark">
                <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Order Date</th>
                    <th>Total Amount</th>
                    <th>Tax</th>
                    <th>Currency</th>
                    <th>Payment Method</th>
                    <th>Payment Status</th>
                    <th>Subtotal</th>
                    <th style ={{ width: "160px"}}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {orders.length > 0 ? (
                    orders.map((e) => (
                        <tr key={e.id}>
                            <td>{e.id}</td>
                            <td>{e.userName}</td>
                            <td>{e.orderDate}</td>
                            <td>{e.totalAmount}</td>
                            <td>{e.tax}</td>
                            <td>{e.currency}</td>
                            <td>{e.payMethod}</td>
                            <td>{e.paymentStatus}</td>
                            <td>{e.subtotal}</td>
                            <td>
                                <Link
                                    to={`/orders/edit/${e.id}`}
                                    className="btn btn-warning btn-sm me-2"
                                >
                                    Edit
                                </Link>
                                <Link
                                    to={`/orders/${e.id}/add-item`}
                                    className="btn btn-info btn-sm me-2"
                                >
                                    Add Item
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
                        <td colSpan="10" className="text-center text-muted">
                            No Orders Found
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default OrderList;