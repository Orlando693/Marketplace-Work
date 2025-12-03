import React from "react";

const FooterComponent = () => {
    return (
        <footer className="bg-primary text-white py-3 mt-auto shadow-sm w-100">
            <div className="container-fluid text-center small">
        <span>
          © {new Date().getFullYear()} All Rights Reserved by Humberto, Julio & Fabio
        </span>
            </div>
        </footer>
    );
};

export default FooterComponent;
