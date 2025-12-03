import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    RegisterNewStore,
    UpdateStore,
    getStoreById,

} from "../../services/StoreService.js"
import{getAllUsers} from "../../services/UserService.js";
const StoreForm = () => {
    const [store, setStore] = useState({
        name:"",
        description:"",
        category:"",
        createdDate:"",
        isActive:null,
        userId:"",
    });
    const [user, setUser] = useState([]);
    const {id} = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        loadUsers();
        if (id) loadStores();
    }, [id]);
    const loadStores =async () => {
        try{
            const res=await getStoreById(id);
            const data=res.data;
            setStore({
                name:data.name,
                description:data.description,
                category:data.category,
                createdDate:data.createdDate,
                isActive:data.isActive,
                userId:data.userId,
            });
        }catch(error){
            console.error("Error loading store",error);
            Swal.fire("Error","Failed to load store data","error")
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
    const handleChange = (e) => {
        const { name, value } = e.target;
        setStore({...store, [name]: value});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name: store.name,
            description: store.description,
            category: store.category,
            createdDate: store.createdDate,
            isActive: store.isActive,
            userId: store.userId,
        };

        try {
            if (id) {
                await UpdateStore(id, payload);
                Swal.fire("Éxito", "Tienda actualizada exitosamente", "success");
            } else {
                await RegisterNewStore(payload);
                Swal.fire("Éxito", "Tienda creada exitosamente", "success");
            }
            navigate(`/stores`);
        } catch (error) {
            console.error("Error saving store", error);

            // Aquí usamos data directamente si existe
            const backendMessage = error.response?.data;

            if (backendMessage && backendMessage.includes("ya está en uso")) {
                Swal.fire("Error", backendMessage, "error");
            } else {
                Swal.fire("Error", "Error saving store", "error");
            }
        }
    }; //Una tienda no deberia poder cambiar de dueño

    return (
        <div className="containter mt-4">
            <h2>{id?"Edit store":"Add store"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={store.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input
                        type="text"
                        className="form-control"
                        name="description"
                        value={store.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Category</label>
                    <input
                        type="text"
                        className="form-control"
                        name="category"
                        value={store.category}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">User</label>
                    <select
                        className="form-select"
                        name="userId"
                        value={store.userId}
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
                {/* Buttons */}
                <button type="submit" className="btn btn-success me-2">
                    Save
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/stores")}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};
export default StoreForm;