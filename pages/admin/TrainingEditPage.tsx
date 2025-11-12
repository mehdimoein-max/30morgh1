import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import type { TrainingModule } from '../../types';
import { PlusIcon, TrashIcon } from '../../components/Icons';

const emptyModule: TrainingModule = {
    id: '',
    title: '',
    description: '',
    textContent: '',
    fileUrl: '',
    isActive: true,
    assignment: {
        question: '',
        solution: '',
        isSolutionVisible: false,
        questionFiles: [],
        solutionFiles: [],
    },
};

const TrainingEditPage: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const { holdingData, updateHoldingData } = useData();
    const [module, setModule] = useState<TrainingModule>(emptyModule);
    
    // Robust check for new module page
    const isNew = !id || id === 'new';

    useEffect(() => {
        if (!isNew && id) {
            const existingModule = holdingData.trainingModules.find(m => m.id === id);
            if (existingModule) {
                // Ensure file arrays exist to prevent errors
                const moduleData = { ...existingModule };
                if (!moduleData.assignment.questionFiles) {
                    moduleData.assignment.questionFiles = [];
                }
                if (!moduleData.assignment.solutionFiles) {
                    moduleData.assignment.solutionFiles = [];
                }
                setModule(moduleData);
            }
        } else {
            setModule(emptyModule);
        }
    }, [id, isNew, holdingData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setModule(prev => ({ ...prev, [name]: value }));
    };

    const handleAssignmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setModule(prev => ({
            ...prev,
            assignment: { ...prev.assignment, [name]: value },
        }));
    };
    
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        if (name === 'isActive') {
            setModule(prev => ({...prev, isActive: checked}));
        } else if (name === 'isSolutionVisible') {
             setModule(prev => ({
                ...prev,
                assignment: { ...prev.assignment, isSolutionVisible: checked },
            }));
        }
    };
    
    const handleFileChange = (type: 'questionFiles' | 'solutionFiles', index: number, field: 'name' | 'url', value: string) => {
        setModule(prev => {
            const newAssignment = { ...prev.assignment };
            const newFiles = [...(newAssignment[type] || [])];
            newFiles[index] = { ...newFiles[index], [field]: value };
            newAssignment[type] = newFiles;
            return { ...prev, assignment: newAssignment };
        });
    };

    const handleAddFile = (type: 'questionFiles' | 'solutionFiles') => {
        setModule(prev => {
            const newAssignment = { ...prev.assignment };
            const newFiles = [...(newAssignment[type] || []), { name: '', url: '' }];
            newAssignment[type] = newFiles;
            return { ...prev, assignment: newAssignment };
        });
    };

    const handleRemoveFile = (type: 'questionFiles' | 'solutionFiles', index: number) => {
        setModule(prev => {
            const newAssignment = { ...prev.assignment };
            const newFiles = (newAssignment[type] || []).filter((_, i) => i !== index);
            newAssignment[type] = newFiles;
            return { ...prev, assignment: newAssignment };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!module.title) {
            alert('عنوان کیت آموزشی الزامی است.');
            return;
        }

        let updatedModules;
        if (isNew) {
            const newModuleWithId = { ...module, id: `module-${Date.now()}` };
            updatedModules = [...holdingData.trainingModules, newModuleWithId];
        } else {
            updatedModules = holdingData.trainingModules.map(m => (m.id === id ? module : m));
        }
        updateHoldingData({ ...holdingData, trainingModules: updatedModules });
        alert(`کیت آموزشی با موفقیت ${isNew ? 'ایجاد' : 'ویرایش'} شد!`);
        navigate('/admin/training');
    };

    const FileEditor: React.FC<{ type: 'questionFiles' | 'solutionFiles'; label: string }> = ({ type, label }) => (
         <div>
            <label className="block text-sm font-medium mb-2">{label}</label>
            <div className="space-y-2">
                {module.assignment[type]?.map((file, index) => (
                    <div key={index} className="flex gap-2 items-center">
                        <input type="text" placeholder="نام فایل" value={file.name} onChange={(e) => handleFileChange(type, index, 'name', e.target.value)} className="w-1/3 p-2 border rounded-md" />
                        <input type="url" placeholder="URL فایل" value={file.url} onChange={(e) => handleFileChange(type, index, 'url', e.target.value)} className="flex-1 p-2 border rounded-md ltr" />
                        <button type="button" onClick={() => handleRemoveFile(type, index)} className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
            <button type="button" onClick={() => handleAddFile(type)} className="mt-2 text-sm px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-1">
                <PlusIcon className="w-4 h-4" />
                افزودن فایل
            </button>
        </div>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{isNew ? 'افزودن کیت آموزشی جدید' : `ویرایش کیت: ${module.title}`}</h1>
            <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-md space-y-8">
                {/* Basic Info */}
                <fieldset className="border p-4 rounded-md space-y-4">
                    <legend className="px-2 font-semibold">اطلاعات پایه کیت</legend>
                    <div>
                        <label className="block text-sm font-medium">عنوان</label>
                        <input type="text" name="title" value={module.title} onChange={handleChange} className="w-full p-2 border rounded-md" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">توضیحات کوتاه</label>
                        <textarea name="description" value={module.description} onChange={handleChange} rows={3} className="w-full p-2 border rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">محتوای اصلی</label>
                        <textarea name="textContent" value={module.textContent} onChange={handleChange} rows={6} className="w-full p-2 border rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">لینک فایل کلی دوره (اختیاری)</label>
                        <input type="text" name="fileUrl" value={module.fileUrl || ''} onChange={handleChange} placeholder="https://example.com/file.pdf" className="w-full p-2 border rounded-md ltr" />
                    </div>
                </fieldset>
                
                {/* Assignment Info */}
                <fieldset className="border p-4 rounded-md space-y-6">
                    <legend className="px-2 font-semibold">تمرین</legend>
                    <div>
                        <label className="block text-sm font-medium">سوال تمرین</label>
                        <textarea name="question" value={module.assignment.question} onChange={handleAssignmentChange} rows={3} className="w-full p-2 border rounded-md"/>
                    </div>
                    <FileEditor type="questionFiles" label="فایل‌های ضمیمه سوال" />
                     <div className="border-t pt-6 space-y-6">
                        <label className="block text-sm font-medium">پاسخ تمرین</label>
                        <textarea name="solution" value={module.assignment.solution} onChange={handleAssignmentChange} rows={3} className="w-full p-2 border rounded-md"/>
                         <FileEditor type="solutionFiles" label="فایل‌های ضمیمه پاسخ" />
                    </div>
                </fieldset>

                {/* Status */}
                 <fieldset className="border p-4 rounded-md space-y-4">
                    <legend className="px-2 font-semibold">وضعیت انتشار</legend>
                    <div className="flex items-center">
                        <input type="checkbox" id="isActive" name="isActive" checked={module.isActive} onChange={handleCheckboxChange} className="h-4 w-4 text-[#00bfa6] focus:ring-[#00a793] border-gray-300 rounded" />
                        <label htmlFor="isActive" className="mr-2 block text-sm text-gray-900">
                            کیت آموزشی فعال و قابل نمایش در سایت باشد.
                        </label>
                    </div>
                     <div className="flex items-center">
                        <input type="checkbox" id="isSolutionVisible" name="isSolutionVisible" checked={module.assignment.isSolutionVisible} onChange={handleCheckboxChange} className="h-4 w-4 text-[#00bfa6] focus:ring-[#00a793] border-gray-300 rounded" />
                        <label htmlFor="isSolutionVisible" className="mr-2 block text-sm text-gray-900">
                           پاسخ تمرین برای کاربران نمایش داده شود.
                        </label>
                    </div>
                 </fieldset>

                <div className="flex justify-end gap-4">
                     <button type="button" onClick={() => navigate('/admin/training')} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                        انصراف
                    </button>
                    <button type="submit" className="px-6 py-2 bg-[#00bfa6] text-white font-bold rounded-md hover:bg-[#00a793]">
                       {isNew ? 'ایجاد کیت' : 'ذخیره تغییرات'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TrainingEditPage;