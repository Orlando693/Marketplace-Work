import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getAllReviews,
    deleteReview,
}from "../../services/ReviewService.js";

const ReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadReviews();
    },[]);
    const loadReviews = async () => {
        try{
            const res=await getAllReviews();
            const formatted = res.data.map((r) => ({
                ...r,
                createdAt: r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString("es-BO")
                    : "",
                updatedAt: r.updatedAt
                    ? new Date(r.updatedAt).toLocaleDateString("es-BO")
                    : "",
            }));
            setReviews(formatted);
        }catch(error){
            console.error("Error loading Reviews",error);
            Swal.fire("Error","Failed to load Reviews","error");
        }
    };
    const handleDelete=(id)=>{
        Swal.fire({
            title: 'Are you sure?',
            text:"This revire will be permanently deleted",
            icon:"warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try{
                    await deleteReview(id);
                    Swal.fire("Deleted!","Review has been Deleted!","success");
                    loadReviews();
                }catch(error){
                    console.error("Error loading Reviews",error);
                    Swal.fire("Error","Failed to delete Reviews","error");
                }
            }
        });
    };
    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Review List</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/reviews/add")}
                    >
                    Add Review
                </button>
            </div>

            <table className="table table-striped align-middle">
                <thead className="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>CreatedAt</th>
                    <th>UpdatedAT</th>
                    <th>ProductID</th>
                    <th>UserID</th>
                    <th style={{width:'160px'}}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {reviews.length > 0 ? (
                    reviews.map((r) => (
                        <tr key={r.id}>
                            <td>{r.id}</td>
                            <td>{r.rating}</td>
                            <td>{r.comment}</td>
                            <td>{r.createdAt}</td>
                            <td>{r.updatedAt}</td>
                            <td>{r.productId}</td>
                            <td>{r.userId}</td>

                            <td>
                                <Link
                                    to={`/reviews/edit/${r.id}`}
                                    className="btn btn-warning btn-sm me-2"
                                    >
                                    Edit</Link>
                                <button
                                    className="btn btn-danger btn-sm "
                                    onClick={()=>handleDelete(r.id)}
                                    >Delete</button>
                            </td>
                        </tr>

                    ))
                    ):(
                        <tr>
                            <td colSpan="8" className="text-center text-muted">
                                No Reviews Found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
export default ReviewList;