import React, { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FeatherIcon, LogoutIcon } from '../../components/Icons';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        navigate('/admin');
    };

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center px-4 py-2 mt-2 text-gray-100 transition-colors duration-200 transform rounded-md hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`;


    return (
        <div className="flex h-screen bg-gray-200" dir="rtl">
            <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-gray-800 border-l border-gray-700">
                <div className="flex items-center gap-2 px-4">
                     <FeatherIcon className="h-8 w-8 text-[#00bfa6]" />
                    <span className="text-2xl font-bold text-white">پنل مدیریت</span>
                </div>

                <div className="flex flex-col justify-between flex-1 mt-6">
                    <nav>
                        <NavLink to="/admin/dashboard" className={navLinkClasses}>
                            داشبورد
                        </NavLink>
                        <NavLink to="/admin/holding" className={navLinkClasses}>
                            تنظیمات هلدینگ
                        </NavLink>
                        <NavLink to="/admin/companies" className={navLinkClasses}>
                            مدیریت شرکت‌ها
                        </NavLink>
                        <NavLink to="/admin/training" className={navLinkClasses}>
                            آموزش و تمرین
                        </NavLink>
                    </nav>

                    <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 mt-2 text-gray-100 transition-colors duration-200 transform rounded-md hover:bg-red-500"
                    >
                        <LogoutIcon className="w-5 h-5 ml-2" />
                        خروج
                    </button>
                </div>
            </aside>

            <main className="flex-1 w-full h-full overflow-y-auto bg-gray-100">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;