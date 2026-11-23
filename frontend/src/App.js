import React, { Suspense, lazy } from "react";
import "@/App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import ProtectedRoute from "@/components/ProtectedRoute";

// Eager load HomePage for instant first render
import HomePage from "@/pages/HomePage";

// Code-split / lazy-load remaining public & admin routes
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const EstimatorPage = lazy(() => import("@/pages/EstimatorPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const GalleryPage = lazy(() => import("@/pages/GalleryPage"));
const ReviewPage = lazy(() => import("@/pages/ReviewPage"));

const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminInquiries = lazy(() => import("@/pages/admin/AdminInquiries"));
const AdminProjects = lazy(() => import("@/pages/admin/AdminProjects"));
const AdminReviews = lazy(() => import("@/pages/admin/AdminReviews"));

const PageLoader = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 pt-20">
    <div className="w-12 h-12 border-4 border-gray-200 border-t-[#D69A55] rounded-full animate-spin mb-4" />
    <span
      className="text-xs uppercase font-bold tracking-widest text-[#D69A55]"
      style={{ fontFamily: "Oswald, sans-serif" }}
    >
      Loading Dhota Construction...
    </span>
  </div>
);

function App() {
  return (
    <div className="App min-h-screen flex flex-col">
      <HashRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <HomePage />
                  </main>
                  <Footer />
                  <WhatsAppButton />
                </>
              }
            />
            <Route
              path="/about"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <AboutPage />
                  </main>
                  <Footer />
                  <WhatsAppButton />
                </>
              }
            />
            <Route
              path="/services"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <ServicesPage />
                  </main>
                  <Footer />
                  <WhatsAppButton />
                </>
              }
            />
            <Route
              path="/estimator"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <EstimatorPage />
                  </main>
                  <Footer />
                  <WhatsAppButton />
                </>
              }
            />
            <Route
              path="/contact"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <ContactPage />
                  </main>
                  <Footer />
                  <WhatsAppButton />
                </>
              }
            />
            <Route
              path="/gallery"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <GalleryPage />
                  </main>
                  <Footer />
                  <WhatsAppButton />
                </>
              }
            />
            <Route
              path="/reviews"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <ReviewPage />
                  </main>
                  <Footer />
                  <WhatsAppButton />
                </>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/inquiries"
              element={
                <ProtectedRoute>
                  <AdminInquiries />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/projects"
              element={
                <ProtectedRoute>
                  <AdminProjects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reviews"
              element={
                <ProtectedRoute>
                  <AdminReviews />
                </ProtectedRoute>
              }
            />

            {/* Catch-all fallback */}
            <Route
              path="*"
              element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <HomePage />
                  </main>
                  <Footer />
                  <WhatsAppButton />
                </>
              }
            />
          </Routes>
        </Suspense>
        <Toaster position="top-right" />
      </HashRouter>
    </div>
  );
}

export default App;
