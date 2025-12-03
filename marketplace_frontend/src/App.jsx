import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import MainLayout from "./layouts/MainLayout";
import ErrorBoundary from "./components/ErrorBoundary"; // ✅ nuevo import

import LoginPage from "./components/Auth/LoginPage";
import Home from "./pages/Home";
import UserPage from "./pages/UserPage";
import OrderPage from "./pages/OrderPage";
import OrderItemPage from "./pages/OrderItemPage";
import ProductPage from "./pages/ProductPage";
import StorePage from "./pages/StorePage";
import ReviewPage from "./pages/ReviewPage";

function App() {
  return (
      <ThemeProvider>
          <AuthProvider>
              {/* 🧩 ErrorBoundary captura cualquier fallo en renderizado */}
              <ErrorBoundary>
                  <Router>
                      <Routes>
                          {/* 🔓 Public route (Login) */}
                          <Route path="/login" element={<LoginPage />} />

                          {/* 🔐 Private routes under MainLayout */}
                          <Route element={<MainLayout />}>
                              <Route
                                  path="/"
                                  element={
                                      <PrivateRoute>
                                          <Home />
                                      </PrivateRoute>
                                  }
                              />

                              <Route
                                  path="orders/*"
                                  element={
                                      <PrivateRoute>
                                          <OrderPage />
                                      </PrivateRoute>
                                  }
                              />

                              <Route
                                  path="orderItems/*"
                                  element={
                                      <PrivateRoute>
                                          <OrderItemPage />
                                      </PrivateRoute>
                                  }
                              />

                              <Route
                                  path="users/*"
                                  element={
                                      <PrivateRoute>
                                          <UserPage />
                                      </PrivateRoute>
                                  }
                              />

                              <Route
                                  path="products/*"
                                  element={
                                      <PrivateRoute>
                                          <ProductPage />
                                      </PrivateRoute>
                                  }
                              />

                              <Route
                                  path="stores/*"
                                  element={
                                      <PrivateRoute>
                                          <StorePage />
                                      </PrivateRoute>
                                  }
                              />

                              <Route
                                  path="reviews/*"
                                  element={
                                      <PrivateRoute>
                                          <ReviewPage />
                                      </PrivateRoute>
                                  }
                              />

                              {/* Redirect unknown paths to home */}
                              <Route path="*" element={<Navigate to="/" replace />} />
                          </Route>
                      </Routes>
                  </Router>
              </ErrorBoundary>
          </AuthProvider>
      </ThemeProvider>
  )
}

export default App;
