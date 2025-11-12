import React, { useState } from 'react';
import type { Department } from '../types';
import { PlusIcon, TrashIcon } from './Icons';

interface OrgChartEditorProps {
    departments: Department[];
    onDepartmentsChange: (newDepartments: Department[]) => void;
}

const OrgChartEditor: React.FC<OrgChartEditorProps> = ({ departments, onDepartmentsChange }) => {
    const [newDepartment, setNewDepartment] = useState({ name: '', manager: '', parentId: '', description: '' });

    const handleEdit = (index: number, field: 'name' | 'manager' | 'parentId' | 'description', value: string) => {
        const updatedDepartments = [...departments];
        if (field === 'parentId') {
             updatedDepartments[index] = { ...updatedDepartments[index], [field]: value || null };
        } else {
             updatedDepartments[index] = { ...updatedDepartments[index], [field]: value };
        }
        onDepartmentsChange(updatedDepartments);
    };

    const handleAdd = () => {
        if (!newDepartment.name || !newDepartment.manager) {
            alert('نام دپارتمان و مدیر الزامی است.');
            return;
        }
        const newDept: Department = {
            id: `dept-${Date.now()}`,
            name: newDepartment.name,
            manager: newDepartment.manager,
            description: newDepartment.description,
            parentId: newDepartment.parentId || null,
        };
        onDepartmentsChange([...departments, newDept]);
        setNewDepartment({ name: '', manager: '', parentId: '', description: '' });
    };

    const handleDelete = (idToDelete: string) => {
        if (departments.some(d => d.parentId === idToDelete)) {
            alert('ابتدا باید دپارتمان‌های زیرمجموعه را حذف یا جابجا کنید.');
            return;
        }
        if (window.confirm('آیا از حذف این دپارتمان اطمینان دارید؟')) {
            onDepartmentsChange(departments.filter(d => d.id !== idToDelete));
        }
    };
    
    return (
        <fieldset className="border p-4 rounded-md space-y-4">
            <legend className="px-2 font-semibold">چارت سازمانی</legend>
            <div className="space-y-3">
                {departments.map((dept, index) => (
                    <div key={dept.id} className="border p-3 rounded-md space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                            <input
                                type="text"
                                value={dept.name}
                                onChange={e => handleEdit(index, 'name', e.target.value)}
                                placeholder="نام دپارتمان"
                                className="p-2 border rounded-md"
                            />
                            <input
                                type="text"
                                value={dept.manager}
                                onChange={e => handleEdit(index, 'manager', e.target.value)}
                                placeholder="نام مدیر"
                                className="p-2 border rounded-md"
                            />
                            <select
                                value={dept.parentId || ''}
                                onChange={e => handleEdit(index, 'parentId', e.target.value)}
                                className="p-2 border rounded-md"
                            >
                                <option value="">بدون والد (سطح بالا)</option>
                                {departments.filter(d => d.id !== dept.id).map(parent => (
                                    <option key={parent.id} value={parent.id}>{parent.name}</option>
                                ))}
                            </select>
                            <button type="button" onClick={() => handleDelete(dept.id)} className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                                 <TrashIcon className="w-5 h-5 mx-auto" />
                            </button>
                        </div>
                        <textarea
                            value={dept.description || ''}
                            onChange={e => handleEdit(index, 'description', e.target.value)}
                            placeholder="شرح وظایف (اختیاری)"
                            rows={2}
                            className="w-full p-2 border rounded-md text-sm"
                        />
                    </div>
                ))}
            </div>

            <div className="border-t pt-4 mt-4 space-y-2">
                <h4 className="font-semibold">افزودن دپارتمان جدید</h4>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                        type="text"
                        value={newDepartment.name}
                        onChange={e => setNewDepartment({ ...newDepartment, name: e.target.value })}
                        placeholder="نام دپارتمان"
                        className="p-2 border rounded-md"
                    />
                    <input
                        type="text"
                        value={newDepartment.manager}
                        onChange={e => setNewDepartment({ ...newDepartment, manager: e.target.value })}
                        placeholder="نام مدیر"
                        className="p-2 border rounded-md"
                    />
                     <select
                        value={newDepartment.parentId}
                        onChange={e => setNewDepartment({ ...newDepartment, parentId: e.target.value })}
                        className="p-2 border rounded-md"
                    >
                        <option value="">بدون والد (سطح بالا)</option>
                        {departments.map(parent => (
                            <option key={parent.id} value={parent.id}>{parent.name}</option>
                        ))}
                    </select>
                </div>
                <textarea
                    value={newDepartment.description}
                    onChange={e => setNewDepartment({ ...newDepartment, description: e.target.value })}
                    placeholder="شرح وظایف (اختیاری)"
                    rows={2}
                    className="w-full p-2 border rounded-md"
                />
                <button type="button" onClick={handleAdd} className="w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center justify-center gap-2">
                    <PlusIcon className="w-5 h-5"/> افزودن
                </button>
            </div>
        </fieldset>
    );
};

export default OrgChartEditor;