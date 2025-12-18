import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import UserSidebar from './UserSidebar';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
    const { user } = useAuth();
    const isUserDashboard = user?.role === 'client' || user?.role === 'student';

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar - Conditional Rendering */}
            {isUserDashboard ? <UserSidebar /> : <Sidebar />}

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-64">
                <div className="min-h-screen">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
