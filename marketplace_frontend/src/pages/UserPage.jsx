import React from "react";
import { Routes, Route } from "react-router-dom";
import UserList from "../components/User/UserList";
import UserForm from "../components/User/UserForm";

const UserPage = () => {
    return (
        <Routes>
            <Route index element={<UserList />} />
            <Route path="add" element={<UserForm/>} />
            <Route path="edit/:id" element={<UserForm />} />
        </Routes>
    );
};

export default UserPage;