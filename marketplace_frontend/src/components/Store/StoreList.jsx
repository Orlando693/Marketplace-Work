import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getStores,
    DeleteStore,
} from "../../services/StoreService.js";

const StoreList = () => {
    const [stores, setStores] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadStores();
    }, []);

    const loadStores = async () => {
        try {
            const res = await getStores();
            const formatted = res.data.map((s) => ({
                ...s,
                userId: s.userId,
                createdDate: s.createdDate
                    ? new Date(s.createdDate.replace(' ', 'T')).toLocaleDateString("es-BO")
                    : "",
            }));
            setStores(formatted);
        } catch (error) {
            console.error("Error loading Stores", error);
            Swal.fire("Error", "Failed to load Stores", "error");
        }
    };
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This store will be permanently deleted",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await DeleteStore(id);
                    Swal.fire("Deleted!", "Product has been deleted", "success");
                    loadStores();
                } catch (error) {
                    console.error("Error deleting Product", error);
                    Swal.fire("Error", "Failed to delete Product", "error");
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Store List</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/stores/add")}
                >
                    Add Product
                </button>
            </div>
            <table className="table table-striped align-middle">
                <thead className="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>CreatedAt</th>
                    <th>Active</th>
                    <th>UserID</th>
                    <th style={{ width: "160px" }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {stores.length > 0 ? (
                    stores.map((p) => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.name}</td>
                            <td>{p.description}</td>
                            <td>{p.category}</td>
                            <td>{p.createdDate}</td>
                            <td>{p.isActive? "Yes" : "No"}</td>
                            <td>{p.userId }</td>
                            <td>
                                <Link
                                    to={`/stores/edit/${p.id}`}
                                    className="btn btn-warning btn-sm me-2"
                                >
                                    Edit
                                </Link>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(p.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="8" className="text-center text-muted">
                            No Products Found
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default StoreList;
