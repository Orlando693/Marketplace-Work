import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Importa SweetAlert2 para modales bonitos
import {
    getAllProducts,
    deleteProduct,
} from "../../services/ProductService.js";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadProducts(); // Llama a la función para cargar productos al montar o cuando cambien las dependencias
    }, [products]);

    // Funcion asincrona que no detiene la ejecucion del programa mientras espera la respuesta
    const loadProducts = async () => {
        try {
            const res = await getAllProducts(); // Espera la respuesta de la API que devuelve todos los productos
            const formatted = res.data.map((p) => ({ // Recorre cada producto y transforma/normaliza campos necesarios
                ...p, // Conserva el resto de campos tal cual
                storeName: p.storeName,
                price: Number(p.price).toFixed(2), // Convierte el precio a número y lo formatea a 2 decimales como string
                stock: Number(p.stock),
                publishedDate: p.publishedDate
                    ? new Date(p.publishedDate).toLocaleDateString("es-BO")
                    : "",
            }));
            setProducts(formatted);
        } catch (error) {
            console.error("Error loading Products", error);
            Swal.fire("Error", "Failed to load Products", "error"); // Muestra alerta de error al usuario
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This product will be permanently deleted",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) { // Si el usuario confirma la eliminación
                try {
                    await deleteProduct(id);
                    Swal.fire("Deleted!", "Product has been deleted", "success");
                    loadProducts(); // Recarga la lista de productos para reflejar cambios
                } catch (error) {
                    console.error("Error deleting Product", error);
                    Swal.fire("Error", "Failed to delete Product", "error");
                }
            }
        });
    };

    return (
        <div className="container mt-4"> {/* Contenedor principal con margen superior */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Product List</h2> {/* Título de la página */}
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/products/add")} // Navega a la ruta para agregar un producto
                >
                    Add Product
                </button>
            </div>
            <table className="table table-striped align-middle"> {/* Tabla para listar productos */}
                <thead className="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Published Date</th>
                    <th>Available</th>
                    <th>StoreName</th>
                    <th style={{ width: "160px" }}>Actions</th> {/* Columna para botones Edit/Delete */}
                </tr>
                </thead>
                <tbody>
                {products.length > 0 ? ( // Si hay productos, los mapea a filas
                    products.map((p) => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.name}</td>
                            <td>{p.description}</td>
                            <td>{p.price}</td>
                            <td>{p.stock}</td>
                            <td>{p.publishedDate}</td>
                            <td>{p.isAvailable ? "Yes" : "No"}</td> {/* Muestra disponibilidad */}
                            <td>{p.storeName}</td>
                            <td>
                                <Link
                                    to={`/products/edit/${p.id}`} // Link a la ruta de edición del producto
                                    className="btn btn-warning btn-sm me-2"
                                >
                                    Edit
                                </Link>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(p.id)} // Botón que dispara la eliminación con confirmación
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="9" className="text-center text-muted">
                            No Products Found
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;
