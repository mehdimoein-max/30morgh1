import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { EditIcon, TrashIcon, PlusIcon } from '../../components/Icons';

const TrainingListPage: React.FC = () => {
    const { holdingData, updateHoldingData } = useData();

    const handleDelete = (idToDelete: string) => {
        if (window.confirm('آیا از حذف این کیت آموزشی اطمینان دارید؟')) {
            const updatedModules = holdingData.trainingModules.filter(module => module.id !== idToDelete);
            updateHoldingData({ ...holdingData, trainingModules: updatedModules });
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">مدیریت آموزش و تمرین</h1>
                <Link
                    to="/admin/training/new"
                    className="flex items-center gap-2 px-4 py-2 bg-[#00bfa6] text-white font-semibold rounded-md hover:bg-[#00a793] transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    افزودن کیت جدید
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                عنوان کیت آموزشی
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                وضعیت
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                نمایش پاسخ
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">عملیات</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {holdingData.trainingModules.map((module) => (
                            <tr key={module.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{module.title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${module.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {module.isActive ? 'فعال' : 'غیرفعال'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                     <span className={`text-sm ${module.assignment.isSolutionVisible ? 'text-green-600' : 'text-gray-500'}`}>
                                        {module.assignment.isSolutionVisible ? 'منتشر شده' : 'منتشر نشده'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                    <div className="flex items-center justify-end gap-4">
                                        <Link to={`/admin/training/${module.id}`} className="text-[#00bfa6] hover:text-[#00a793]">
                                            <EditIcon className="w-5 h-5" />
                                        </Link>
                                        <button onClick={() => handleDelete(module.id)} className="text-red-600 hover:text-red-900">
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

export default TrainingListPage;