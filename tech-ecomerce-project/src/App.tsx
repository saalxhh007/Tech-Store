import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BuildCollection from "./pages/BuildCollection";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/adminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import AdminCategories from "./pages/Admin/Categories"
import Products from "./pages/Admin/Products";
import Orders from "./pages/Admin/Orders";
import Customers from "./pages/Admin/Customers";
import Analytics from "./pages/Admin/Analytics";
import Settings from "./pages/Admin/Settings";
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Favorites from "./pages/Favorites"
import MyOrders from "./pages/MyOrders"
import MyAccount from "./pages/MyAccount"


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Public Routes */}
          <Route path="/" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Home />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/categories/:category" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Categories />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/products/:id" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <ProductDetail />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/contact-us" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Contact />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/about" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <About />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/login" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Login />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/signup" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Signup />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/build-my-collection" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <BuildCollection />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/cart" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Cart />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/checkout" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Checkout />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/my-favorites" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Favorites />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/my-orders" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <MyOrders />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/my-account" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <MyAccount />
              </main>
              <Footer />
            </div>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;