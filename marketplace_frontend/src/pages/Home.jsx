import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Users, ShoppingCart, NotebookText, Boxes, Store, ShoppingBag } from "lucide-react";

const Home = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();

    const modules = [
        {
            title: "Users",
            description: "Manages user data, orders and shows reviews",
            icon: <Users size={32}/>,
            path: "/users",
            color: "primary",
        },
        {
            title: "Orders",
            description: "Manages orders and order data",
            icon: <ShoppingCart size={32}/>,
            path: "/orders",
            color: "black",
        },
        {
            title: "OrderItems",
            description: "Manages orderItems",
            icon: <Boxes size={32}/>,
            path: "/orderItems",
            color: "success",
        },
        {
            title: "Reviews",
            description: "Manages reviews and shows reviews",
            icon: <NotebookText size={32}/>,
            path: "/reviews",
            color: "info"
        },
        {
            title: "Products",
            description: "Manages products",
            icon: <ShoppingBag size={32}/>,
            path: "/products",
            color: "warning"
        },
        {
            title: "Store",
            description: "Manages and shows store",
            icon: <Store size={32}/>,
            path: "/stores",
            color: "secondary"
        },
    ];

    return (
        <div
            className={`container text-center py-5 theme-transition ${
                theme === "dark" ? "text-light" : "text-dark"
            }`}>
            <h1 className ="fw-bold mb-3">Welcome to Marketplace</h1>
            <p className="lead mb-5">
                Wide free market for everyone.
            </p>

            <div className="row g-4 justify-content-center">
                {modules.map((mod, index) => (
                    <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <div
                            className={`card border-${mod.color} shadow-sm h-100 hover-scale`}
                            style={{
                                cursor: "pointer",
                                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                            }}
                            onClick={() => navigate(mod.path)}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.transform = "scale(1.03)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                            }
                        >
                            <div className={`card-body text-${mod.color}`}>
                                <div className="mb-3">{mod.icon}</div>
                                <h5 className="card-title fw-semibold">{mod.title}</h5>
                                <p className="card-text text-secondary">{mod.description}</p>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
            <div className="mt-5">
                <p className="text-muted small">
                    Empowering organizations with efficient employee management tools.
                </p>
            </div>
        </div>

    );
};

export default Home;