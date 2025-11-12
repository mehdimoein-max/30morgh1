import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';

const DashboardPage: React.FC = () => {
    const { holdingData } = useData();
    const stats = [
        { name: 'تعداد شرکت‌های زیرمجموعه', value: holdingData.subsidiaries.length, link: '/admin/companies' },
        { name: 'ارزش‌های کلیدی', value: holdingData.values.items.length, link: '/admin/holding' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">داشبورد مدیریت</h1>
            <p className="mb-8 text-gray-600">به پنل مدیریت وب‌سایت هلدینگ سیمرغ خوش آمدید. از این بخش می‌توانید محتوای سایت را مدیریت کنید.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="p-6 bg-white rounded-lg shadow-md">
                        <h3 className="text-lg font-medium text-gray-500">{stat.name}</h3>
                        <p className="mt-2 text-4xl font-bold text-[#00bfa6]">{stat.value}</p>
                        <Link to={stat.link} className="mt-4 inline-block text-sm font-medium text-[#00bfa6] hover:underline">
                            مشاهده و ویرایش
                        </Link>
                    </div>
                ))}
            </div>

             <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">راهنمای سریع</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>برای ویرایش اطلاعات کلی سایت مانند معرفی‌نامه، چشم‌انداز و اطلاعات تماس، به بخش <Link to="/admin/holding" className="font-semibold text-[#00bfa6] hover:underline">تنظیمات هلدینگ</Link> بروید.</li>
                    <li>برای افزودن، ویرایش یا حذف شرکت‌های زیرمجموعه، از بخش <Link to="/admin/companies" className="font-semibold text-[#00bfa6] hover:underline">مدیریت شرکت‌ها</Link> استفاده کنید.</li>
                    <li>تمام تغییرات شما به صورت خودکار در حافظه مرورگر ذخیره می‌شود.</li>
                </ul>
            </div>
        </div>
    );
};

export default DashboardPage;
