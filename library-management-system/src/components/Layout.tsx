import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Library, ArrowRightLeft, Users, LogOut, Menu, X, Bell } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { cn } from '../lib/utils';

export default function Layout() {
  const { user, logout, notifications } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const unreadNotificationsCount = notifications.filter(n => n.userId === user.id && !n.read).length;

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/books', icon: BookOpen, label: 'Books' },
    { to: '/transactions', icon: ArrowRightLeft, label: 'Transactions' },
    { to: '/users', icon: Users, label: 'Users' },
    { to: '/notifications', icon: Bell, label: 'Notifications', badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined },
  ];

  const getBgColor = () => {
    if (location.pathname === '/') return 'bg-blue-50/50';
    if (location.pathname.startsWith('/books')) return 'bg-emerald-50/50';
    if (location.pathname.startsWith('/transactions')) return 'bg-amber-50/50';
    if (location.pathname.startsWith('/users')) return 'bg-purple-50/50';
    if (location.pathname.startsWith('/notifications')) return 'bg-rose-50/50';
    return 'bg-gray-50';
  };

  const getNavActiveColor = (path: string) => {
    if (path === '/') return 'bg-blue-100 text-blue-900';
    if (path.startsWith('/books')) return 'bg-emerald-100 text-emerald-900';
    if (path.startsWith('/transactions')) return 'bg-amber-100 text-amber-900';
    if (path.startsWith('/users')) return 'bg-purple-100 text-purple-900';
    if (path.startsWith('/notifications')) return 'bg-rose-100 text-rose-900';
    return 'bg-gray-200/80 text-gray-900';
  };

  return (
    <div className="flex h-screen bg-white text-gray-900 font-sans overflow-hidden">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-3">
          <Library className="w-6 h-6 text-gray-900" />
          <h1 className="text-xl font-semibold tracking-tight">Library System</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-500 hover:text-gray-900">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-50 border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 flex items-center gap-3 border-b border-gray-200 h-16 lg:h-auto hidden lg:flex">
          <Library className="w-6 h-6 text-gray-900" />
          <h1 className="text-xl font-semibold tracking-tight">Library System</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-16 lg:mt-0">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? getNavActiveColor(item.to)
                    : "text-gray-600 hover:bg-gray-200/50 hover:text-gray-900"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {item.badge !== undefined && (
                <span className="ml-auto inline-flex items-center justify-center rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-900 truncate max-w-[140px]">{user.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
            title="Log out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn("flex-1 overflow-auto pt-16 lg:pt-0 transition-colors duration-300", getBgColor())}>
        <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
