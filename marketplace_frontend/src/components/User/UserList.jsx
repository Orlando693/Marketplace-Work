import React, {useEffect, useState} from "react";
import { Link, useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import {
    getAllUsers,
    deleteUser,
} from "../../services/UserService.js";


const UserList = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadUsers()
    })

    const loadUsers = async () => {
        try{
            const res = await getAllUsers();
            setUsers(res.data);
        } catch (error) {
            console.error("Error loading users", error);
            Swal.fire("Error", "Error loading users", "error");
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This user will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteUser(id);
                    Swal.fire("Deleted!", "User has been deleted.", "success");
                    loadUsers();
                } catch (error) {
                    console.error("Error deleting user:", error);
                    Swal.fire("Error", "Failed to delete user", "error");
                }
            }
        });
    }

    return (
        <div className='container mt-4'>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>User List</h2>
                <button
                    className='btn btn-primary'
                    onClick={()=>navigate("/users/add")}
                >
                    Add User
                </button>
            </div>

            <table className='table table-striped align-middle'>
                <thead className="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Role</th>
                    <th style={{ width: "160px" }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.length > 0 ? (
                    users.map((e) => (
                        <tr key={e.id}>
                            <td>{e.id}</td>
                            <td>{e.firstName} {e.lastName}</td>
                            <td>{e.email}</td>
                            <td>{e.phone}</td>
                            <td>{e.address}</td>
                            <td>{e.role}</td>
                            <td>
                                <Link
                                    to={`/users/edit/${e.id}`}
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
                            No users found.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;