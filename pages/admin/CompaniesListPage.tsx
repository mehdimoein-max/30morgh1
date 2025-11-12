import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { EditIcon, TrashIcon, PlusIcon } from '../../components/Icons';

const CompaniesListPage: React.FC = () => {
    const { holdingData, updateHoldingData } = useData();

    const handleDelete = (slugToDelete: string) => {
        if (window.confirm('آیا از حذف این شرکت اطمینان دارید؟ این عمل قابل بازگشت نیست.')) {
            const updatedSubsidiaries = holdingData.subsidiaries.filter(company => company.slug !== slugToDelete);
            updateHoldingData({ ...holdingData, subsidiaries: updatedSubsidiaries });
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">مدیریت شرکت‌ها</h1>
                <Link
                    to="/admin/company/new"
                    className="flex items-center gap-2 px-4 py-2 bg-[#00bfa6] text-white font-semibold rounded-md hover:bg-[#00a793] transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    افزودن شرکت جدید
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                نام شرکت
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                اسلاگ (آدرس)
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                توضیحات کوتاه
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">عملیات</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {holdingData.subsidiaries.map((company) => (
                            <tr key={company.slug}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{company.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{company.slug}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-500 max-w-sm truncate">{company.shortDescription}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                    <div className="flex items-center justify-end gap-4">
                                        <Link to={`/admin/company/${company.slug}`} className="text-[#00bfa6] hover:text-[#00a793]">
                                            <EditIcon className="w-5 h-5" />
                                        </Link>
                                        <button onClick={() => handleDelete(company.slug)} className="text-red-600 hover:text-red-900">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CompaniesListPage;
