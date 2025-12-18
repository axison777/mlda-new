import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

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
