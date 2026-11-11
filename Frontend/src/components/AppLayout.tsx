import { Outlet } from "react-router";
import Navbar from "./Navbar";
import "../styles/layout.scss";

const AppLayout = () => {
    return (
        <div className="app-layout">
            <Navbar />
            <main className="app-layout__content">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;
