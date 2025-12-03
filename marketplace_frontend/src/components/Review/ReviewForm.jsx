import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    createReview,
    updateReview,
    getReviewById,
    getAllproducts,

} from "../../services/ReviewService.js"
import{getAllUsers} from "../../services/UserService.js";
const ReviewForm = () => {
    const [review, setReview] = useState({
        rating: 0,
        comment: "",
        createdAt:"",
        updatedAt:"",
        userId:"",
        productId:"",
    });
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState([]);
    const {id} = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        loadProducts();
        loadUsers();
        if (id) loadReviews();
    }, [id]);
    const loadReviews =async () => {
        try{
            const res=await getReviewById(id);
            const data=res.data;
            setReview({
                rating: data.rating || 0,
                comment: data.comment || "",
                createdAt: data.createdAt || "",
                updatedAt: data.updatedAt || "",
                userId: data.userId || "",
                productId: data.productId || "",
            });

        }catch(error){
            console.error("Error loading review",error);
            Swal.fire("Error","Failed to load review data","error")
        }
    };
    const loadUsers = async () => {
        try{
            const res=await getAllUsers();
            setUser(res.data);
        }catch(error){
            console.error("Error loading all users",error);
            Swal.fire("Error","Failed to load all users","error")
        }
    };
    const loadProducts = async () => {
        try{
            const res=await getAllproducts();
            setProducts(res.data);
        }catch(error){
            console.error("Error loading all products",error);
            Swal.fire("Error","Failed to load all products","error")
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setReview({...review, [name]: value});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            rating: review.rating,
            comment: review.comment,
            createdAt:review.createdAt,
            updatedAt: review.updatedAt,
            userId:review.userId,
            productId:review.productId,
        };
        try{
            if(id){
                await updateReview(id, payload);
                Swal.fire("Success","Review successfully updated","success")
            }else{
                await createReview(payload);
                Swal.fire("Success","Review successfully created","success")
            }
            navigate(`/reviews`);

        }catch(error){
            console.error("Error loading review",error);
            Swal.fire("Error","Failed to save review","error")
        }

    };
    return (
        <div className="containter mt-4">
            <h2>{id?"Edit review":"Add Review"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Rating</label>
                    <input
                        type="number"
                        className="form-control"
                        name="rating"
                        value={review.rating}
                        onChange={handleChange}
                        required
                        />
                </div>
                <div className="mb-3">
                    <label className="form-label">Comment</label>
                    <input
                        type="textarea"
                        className="form-control"
                        name="comment"
                        value={review.comment}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">User</label>
                    <select
                        className="form-select"
                        name="userId"
                        value={review.userId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">--Select User--</option>
                        {user && user.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.firstName} {p.lastName}
                            </option>
                        ))}
                        </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Product</label>
                    <select
                        className="form-select"
                        name="productId"
                        value={review.productId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">--Select Product--</option>
                        {products && products.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name}</option>
                            ))}
                        </select>
                    <small className="text-muted">
                        Hold Ctrl (Windows) or Cmd (Mac) to select multiple.
                    </small>
                </div>
                {/* Buttons */}
                <button type="submit" className="btn btn-success me-2">
                    Save
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/reviews")}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};
export default ReviewForm;