import React, {useEffect, useState} from 'react'
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    addUser,
    getUser,
    updateUser
} from "../../services/UserService.js";


const UserForm = () => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        role: '',
    });

    const navigate = useNavigate();
    const {id} = useParams();

    //Cargar el formulario que se desea modificar
    useEffect(() => {
        if (id) loadUser();
    }, [id])

    const loadUser = async () => {
        try{
            const res = await getUser(id);
            const data = res.data;
            setUser({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone || 0,
                address: data.address || "",
                password: data.password,
                role: data.role || ""
            });
        } catch (error) {
            console.error("Error loading User", error);
            Swal.fire("Error", "Failed to load User", "error");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({...user, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            password: user.password,
            role: user.role,
        };

        try{
            if(id) {
                await updateUser(id, payload);
                Swal.fire("Updated", "User updated successfully", "success").then(() => {navigate("/users")});
            } else{
                await addUser(payload);
                Swal.fire("Created", "User created successfully", "success").then(() => {navigate("/users")});
            }
        } catch (error) {
            console.error("Error saving User", error);
            Swal.fire("Error", "Failed to load User", "error");
        }
    }

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        role: "",
    });

    /*function validateForm() {
        let valid = true;

        const errorsCopy = {...errors}
        if (firstName.trim()){
            errorsCopy.firstName = '';
        } else {
            errorsCopy.firstName = 'First Name required!';
            valid = false;
        }

        if (lastName.trim()){
            errorsCopy.lastName = '';
        } else {
            errorsCopy.lastName = 'Last Name required!';
            valid = false;
        }

        if (email.trim()){
            errorsCopy.email = '';
        } else {
            errorsCopy.email = 'Email required!';
            valid = false;
        }

        if (email.trim()) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                errorsCopy.email = 'Email is not correct';
                valid = false;
            }
        }

        if (phone.length === 8){
            errorsCopy.phone = '';
        } else {
            errorsCopy.phone = 'Phone number required!';
            valid = false;
        }

        if (address.trim()){
            errorsCopy.address = '';
        } else {
            errorsCopy.address = 'Address required!';
            valid = false;
        }

        if (password.trim()){
            errorsCopy.password = '';
        } else {
            errorsCopy.password = 'Password required!';
            valid = false;
        }

        if (role.trim().toLowerCase() === "comprador" || role.trim().toLowerCase() === "vendedor"){
            errorsCopy.role = '';
        } else {
            errorsCopy.role = 'Role required!';
            valid = false;
        }

        setErrors(errorsCopy);
        return valid;
    }

     */


    return (
        <div className="container">
            <h2>{id ? "Edit User" : "Add user"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleChange}
                    required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="lastName"
                        value={user.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="text"
                        className="form-control"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                        type="number"
                        className="form-control"
                        name="phone"
                        value={user.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={user.address}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="text"
                        className="form-control"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select
                        name="role"
                        className="form-select"
                        value={user.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="">--Select Role</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="USER">USER</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-success me-2">
                    Save
                </button>
                <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/users")}
                >
                    Cancel
                </button>
            </form>
        </div>
    )
}

export default UserForm;