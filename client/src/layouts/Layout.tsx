import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Layout = () => {
    return (
        <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto p-8 relative z-0">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
