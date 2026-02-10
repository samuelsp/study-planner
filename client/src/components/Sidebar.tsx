import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, BookOpen, Settings } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    const links = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Calendar', path: '/calendar', icon: Calendar },
        { name: 'Resources', path: '/resources', icon: BookOpen },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <div className="w-64 h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col p-4">
            <div className="flex items-center gap-2 mb-8 px-2">
                <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">S</span>
                </div>
                <h1 className="text-xl font-bold text-zinc-100">StudyPlan</h1>
            </div>

            <nav className="space-y-1">
                {links.map((link) => {
                    const isActive = location.pathname.startsWith(link.path);
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                                    ? 'bg-violet-500/10 text-violet-400'
                                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default Sidebar;
