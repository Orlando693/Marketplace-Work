import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { createProduct, updateProduct, getProductById } from "../../services/ProductService.js";

// URL de la API: http://localhost:8080/api/products

const ProductForm = () => {
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        publishedDate: "", // Se puede dejar vacío y que el Backend lo establezca
        isAvailable: true,
        storeId: "", // ID de la tienda asociada

        category: {
            name: "",
            description: ""
        }
    });

    const navigate = useNavigate();
    const { id } = useParams(); // Usar para saber si es edición

    // Función para manejar cambios en campos simples y anidados (Category)
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith("category.")) {
            // Maneja campos anidados (category.name, category.description)
            const categoryField = name.split(".")[1];
            setProduct(prevProduct => ({
                ...prevProduct,
                category: {
                    ...prevProduct.category,
                    [categoryField]: value
                }
            }));
        } else {
            // Maneja campos de primer nivel
            setProduct({
                ...product,
                [name]: type === "checkbox" ? checked : value,
            });
        }
    };

    // Lógica para cargar datos si es edición
    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    const response = await getProductById(id);
                    // Aseguramos que el estado del formulario refleje la estructura del DTO,
                    // incluyendo la categoría (si existe) o un objeto vacío si no.
                    setProduct({
                        ...response.data,
                        storeId: response.data.storeId || "",
                        category: response.data.category || { name: "", description: "" }
                    });
                } catch (error) {
                    Swal.fire("Error", "Failed to load Product data", "error");
                    navigate("/products");
                }
            };
            fetchProduct();
        }
    }, [id, navigate]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Preparamos el payload: parsear a números y asegurar el formato
        const payload = {
            ...product,
            storeId: Number(product.storeId),
            price: Number(product.price),
            stock: Number(product.stock),

            category: product.category,
            // Opcional: si publishedDate está vacío, no lo enviamos y dejamos que el BE lo establezca
            publishedDate: product.publishedDate || null
        };

        try {
            if (id) {
                await updateProduct(id, payload);
            } else {
                await createProduct(payload);
            }
            Swal.fire("Éxito", "Producto guardado exitosamente", "success");
            navigate("/products");
        } catch (error) {
            console.error("Error al guardar producto:", error);
            const errorMessage = error.response?.data?.message || "Error de conexión/servidor";
            Swal.fire("Error", `Fallo al guardar Producto: ${errorMessage}`, "error");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">{id ? "Editar Producto" : "Registrar Nuevo Producto"}</h2>
            <form onSubmit={handleSubmit} className="row g-3">

                {/* Campos de Producto Básicos */}
                <div className="col-md-6">
                    <label htmlFor="name" className="form-label">Nombre del Producto</label>
                    <input type="text" className="form-control" id="name" name="name" value={product.name} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                    <label htmlFor="storeId" className="form-label">ID de Tienda (Store)</label>
                    <input type="number" className="form-control" id="storeId" name="storeId" value={product.storeId} onChange={handleChange} required />
                </div>

                {/* Campos de Precio y Stock */}
                <div className="col-md-3">
                    <label htmlFor="price" className="form-label">Precio</label>
                    <input type="number" step="0.01" className="form-control" id="price" name="price" value={product.price} onChange={handleChange} required />
                </div>
                <div className="col-md-3">
                    <label htmlFor="stock" className="form-label">Stock</label>
                    <input type="number" className="form-control" id="stock" name="stock" value={product.stock} onChange={handleChange} required />
                </div>

                <div className="col-md-6">
                    <label htmlFor="description" className="form-label">Descripción del Producto</label>
                    <textarea className="form-control" id="description" name="description" value={product.description} onChange={handleChange} required />
                </div>

                <div className="col-12">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="isAvailable" name="isAvailable" checked={product.isAvailable} onChange={handleChange} />
                        <label className="form-check-label" htmlFor="isAvailable">Disponible</label>
                    </div>
                </div>

                <hr className="my-4"/>

                {/* **NUEVOS CAMPOS DE CATEGORÍA (One-to-One)** */}
                <h4 className="col-12">Detalles de Categoría</h4>

                <div className="col-md-6">
                    <label htmlFor="categoryName" className="form-label">Nombre de Categoría</label>
                    {/* El 'name' del input es 'category.name' para el manejo anidado */}
                    <input type="text" className="form-control" id="categoryName" name="category.name" value={product.category.name} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                    <label htmlFor="categoryDescription" className="form-label">Descripción de Categoría</label>
                    {/* El 'name' del input es 'category.description' */}
                    <input type="text" className="form-control" id="categoryDescription" name="category.description" value={product.category.description} onChange={handleChange} />
                </div>

                <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-primary me-2">
                        {id ? "Actualizar Producto" : "Registrar Producto"}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/products")}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;