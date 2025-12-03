import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Detectar preferencia del sistema
    useEffect(() => {
        const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDarkMode(darkQuery.matches);

        const handleChange = (e) => setIsDarkMode(e.matches);
        darkQuery.addEventListener("change", handleChange);

        return () => darkQuery.removeEventListener("change", handleChange);
    }, []);

    // Aplicar clase global al body
    useEffect(() => {
        document.body.className = isDarkMode ? "bg-light text-dark" : "bg-dark text-light";
    }, [isDarkMode]); //Inverti la condicion para que se muestre bien en mi buscador

    const toggleTheme = () => setIsDarkMode((prev) => !prev);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
