import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    createOrderItem,
    updateOrderItem,
    getOrderItemById,
    getAllProducts,
    getAllOrders,
} from "../../services/OrderItemService"

const OrderItemForm = () => {
    const [orderItem, setOrderItem] = useState({
        quantity: "",
        price:"",
        subtotal:"",
        orderId: "",
        productId: "",
    });

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const { id, orderId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadProducts();
        loadOrders()
        if (id) loadOrderItem();
    }, [id]);

    const loadOrderItem = async () => {
        try{
            const res = await getOrderItemById(id);
            const data = res.data;
            setOrderItem({
                quantity: data.quantity || 0,
                price: data.price || 0,
                subtotal: data.subtotal || 0,
                orderId: data.orderId,
                productId: data.productId,
            });
        } catch(error) {
            console.error("Error loading OrderItem", error);
            Swal.fire("Error", "failed to load OrderItem", "error")
        }
    };

    const loadProducts = async () => {
        try {
            const res = await getAllProducts();
            setProducts(res.data);
        } catch(error) {
            console.error("Error loading Products", error);
            Swal.fire("Error", "Failed to load Products", "error")
        }
    };

    const loadOrders = async () => {
        try{
            const res = await getAllOrders();
            setOrders(res.data);
        } catch(error) {
            console.error("Error loading Orders", error);
            Swal.fire("Error", "Failed to load Orders", "error")
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "productId") {
            const selectedProduct = products.find((p) => p.id === Number(value));
            const price = selectedProduct ? selectedProduct.price : 0;
            setOrderItem((prev) => ({
                ...prev,
                productId: value,
                price,
                subtotal: price * prev.quantity,
            }));
        } else if (name === "quantity") {
            setOrderItem((prev) => ({
                ...prev,
                quantity: value,
                subtotal: prev.price * value,
            }));
        } else {
            setOrderItem((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            quantity: Number(orderItem.quantity),
            price: Number(orderItem.price),
            subtotal: Number(orderItem.subtotal),
            productId: Number(orderItem.productId),
            orderId: orderId ? Number(orderId) : Number(orderItem.orderId),
        };

        try{
            if (id) {
                await updateOrderItem(id, payload);
                Swal.fire("Updated", "OrderItem Updated", "success").then(() => {
                    if (orderId) {
                        navigate(`/orders`)
                    } else {
                        navigate("/orderItems")
                    }
                });
            } else {
                await createOrderItem(payload);
                Swal.fire("Created", "OrderItem Created", "success").then(() => {
                    if (orderId) {
                        navigate(`/orders`);
                    } else {
                        navigate("/orderItems")
                    }
                });
            }
        } catch(error) {
            console.error("Error loading Products", error);
            Swal.fire("Error", "Failed to save OrderItem", "error");
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Edit OrderItem" : "Add OrderItem"}</h2>
            <form onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label className="form-label">Product</label>
                    <select
                        className="form-select"
                        name="productId"
                        value={orderItem.productId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Select Product</option>
                        {products.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Quantity</label>
                    <input
                        type="number"
                        className="form-control"
                        name="quantity"
                        value={orderItem.quantity}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={orderItem.price}
                        onChange={handleChange}
                        readOnly
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Subtotal</label>
                    <input
                        type="number"
                        className="form-control"
                        name="subtotal"
                        value={orderItem.subtotal}
                        onChange={handleChange}
                        readOnly
                    />
                </div>

                {!orderId && (
                    <div className="mb-3">
                        <label className="form-label">Order</label>
                        <select
                            className="form-select"
                            name="orderId"
                            value={orderItem.orderId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Select Order --</option>
                            {orders.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.id}
                                </option>
                            ))}
                        </select>
                    </div>
                )}


                {/* Buttons */}
                <button type="submit" className="btn btn-success me-2">
                    Save
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/orderItems")}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default OrderItemForm;