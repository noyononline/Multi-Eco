import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Shops from "./pages/Shops";
import Card from "./pages/Card";
import Details from "./pages/Details";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Shipping from "./pages/Shipping";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { get_category } from "./store/reducers/homeReducer";
import CategoryShop from "./pages/CategoryShop";
import SearchProducts from "./pages/SearchProducts";
import Payment from "./pages/Payment";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import Index from "./components/dashboard/Index";
import Orders from "./components/dashboard/Orders";
import Wishlist from "./components/dashboard/Wishlist";
import ChangePassword from "./components/dashboard/ChangePassword";
import OrderDetails from "./components/dashboard/OrderDetails";
import Chat from "./components/dashboard/Chat";
import ConfirmOrder from "./pages/ConfirmOrder";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_category());
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={<Home />}></Route>
        <Route path="/shops" element={<Shops />}></Route>
        <Route path="/products?" element={<CategoryShop />} />
        <Route path="/products/search?" element={<SearchProducts />} />
        <Route path="/card" element={<Card />}></Route>
        <Route path="/product/details/:slug" element={<Details />}></Route>
        <Route path="/shipping" element={<Shipping />}></Route>
        <Route path="/payment" element={<Payment />}></Route>
        <Route path="/order/confirm?" element={<ConfirmOrder />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="" element={<Index />} />
            <Route path="my-orders" element={<Orders />} />
            <Route path="order-details/:orderId" element={<OrderDetails />} />
            <Route path="chat" element={<Chat />} />
            <Route path="chat/:sellerId" element={<Chat />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
