import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Layout from "./components/Layout";
import CreateComplaint from "./pages/CreateComplaint";
import MyComplaints from "./pages/MyComplaints";
import AllComplaints from "./pages/AllComplaints";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default Route */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Layout Protected Routes */}
        <Route element={<Layout />}>

          {/* User */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateComplaint />} />
          <Route path="/my-complaints" element={<MyComplaints />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/complaints" element={<AllComplaints />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;