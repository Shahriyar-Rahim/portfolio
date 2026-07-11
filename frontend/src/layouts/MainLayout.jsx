import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToHash from "../components/ScrollToHash";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col">
      <ScrollToHash />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
