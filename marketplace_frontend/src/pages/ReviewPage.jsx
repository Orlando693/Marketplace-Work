import React from "react";
import { Routes, Route } from "react-router-dom";
import ReviewForm from "../components/Review/ReviewForm.jsx";
import ReviewList from "../components/Review/ReviewList.jsx";

const ReviewPage = () => {
    return (
        <Routes>
            <Route index element={<ReviewList />} />
            <Route path="add" element={<ReviewForm/>} />
            <Route path="edit/:id" element={<ReviewForm />} />
        </Routes>
    );
};

export default ReviewPage;