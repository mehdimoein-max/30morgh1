import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import type { Company, Department } from '../../types';
import { PlusIcon, TrashIcon } from '../../components/Icons';
import * as Icons from '../../components/Icons';
import OrgChartEditor from '../../components/OrgChartEditor';
import ImageUpload from '../../components/ImageUpload';

const iconOptions = Object.keys(Icons).filter(key => key.endsWith('Icon')).map(key => ({
    name: key.replace('Icon', ''),
    component: (Icons as any)[key]
}));


const emptyCompany: Company = {
    slug: '', name: '', logoUrl: './assets/images/logo-placeholder.webp', slogan: '', sloganImageUrl: './assets/images/slogan-placeholder.webp', managementIntro: '', shortDescription: '',
    services: [], targetCustomers: [], competitiveAdvantages: [], assets: [],
    brandIdentity: { colors: [], personality: '', tone: '' },
    ceo: { name: '', quote: '' },
    organizationalChart: [],
};

const CompanyEditPage: React.FC = () => {
    const { slug } = useParams<{ slug?: string }>();
    const navigate = useNavigate();
    const { holdingData, updateHoldingData } = useData();
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
    
    // Robust check for new company page
    const isNew = !slug || slug === 'new';

    const [company, setCompany] = useState<Company>(emptyCompany);

    useEffect(() => {
        if (!isNew && slug) {
            const existingCompany = holdingData.subsidiaries.find(c => c.slug === slug);
            if (existingCompany) {
                setCompany(existingCompany);
                setIsSlugManuallyEdited(true); // Slug for existing companies is considered manually set and fixed.
            }
        } else {
            // Reset form for 'new' page
            setCompany(emptyCompany);
            setIsSlugManuallyEdited(false);
        }
    }, [slug, isNew, holdingData]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        // Auto-generate slug from name for new companies, if not manually edited
        if (name === 'name' && isNew && !isSlugManuallyEdited) {
            const newSlug = value.trim().toLowerCase()
                .replace(/[^a-z0-9-\s]/g, '') // Only allow english, numbers, hyphens, spaces
                .replace(/\s+/g, '-');
            setCompany(prev => ({ ...prev, name: value, slug: newSlug }));
            return; // Exit after handling both name and slug
        }

        const keys = name.split('.');
        setCompany(prev => {
            const newState = { ...prev };
            let current: any = newState;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newState;
        });
    };

    const handleFieldChange = (fieldName: string, value: string) => {
        const keys = fieldName.split('.');
        setCompany(prev => {
            const newState = JSON.parse(JSON.stringify(prev));
            let current: any = newState;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newState;
        });
    };

    const handleListChange = (listName: 'services' | 'competitiveAdvantages' | 'assets', index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newList = [...company[listName]];
        
        if (name === 'icon') {
            const selectedIcon = iconOptions.find(opt => opt.name === value);
            (newList[index] as any)[name] = selectedIcon ? selectedIcon.component : Icons.StarIcon;
        } else {
            (newList[index] as any)[name] = value;
        }
        setCompany(prev => ({ ...prev, [listName]: newList }));
    };

    const addListItem = (listName: 'services' | 'competitiveAdvantages' | 'assets') => {
        const newItem = { icon: Icons.StarIcon, title: '', description: '' };
        setCompany(prev => ({ ...prev, [listName]: [...prev[listName], newItem] }));
    };
    
    const removeListItem = (listName: 'services' | 'competitiveAdvantages' | 'assets', index: number) => {
        setCompany(prev => ({...prev, [listName]: prev[listName].filter((_, i) => i !== index)}));
    };

    const handleOrgChartChange = (newDepartments: Department[]) => {
        setCompany(prev => ({...prev, organizationalChart: newDepartments}));
    };
    
    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsSlugManuallyEdited(true);
        const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
        setCompany(prev => ({...prev, slug: newSlug}));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!company.slug || !company.name) {
            alert('نام و اسلاگ (آدرس) شرکت الزامی است.');
            return;
        }

        let updatedSubsidiaries;
        if (isNew) {
             if (holdingData.subsidiaries.some(c => c.slug === company.slug)) {
                alert('این اسلاگ قبلاً استفاده شده است. لطفاً یک اسلاگ دیگر انتخاب کنید.');
                return;
            }
            updatedSubsidiaries = [...holdingData.subsidiaries, company];
        } else {
            updatedSubsidiaries = holdingData.subsidiaries.map(c => (c.slug === slug ? company : c));
        }
        updateHoldingData({ ...holdingData, subsidiaries: updatedSubsidiaries });
        alert(`شرکت با موفقیت ${isNew ? 'ایجاد' : 'ویرایش'} شد!`);
        navigate('/admin/companies');
    };

    const getIconName = (IconComponent: React.FC<any>): string => {
        const option = iconOptions.find(opt => opt.component === IconComponent);
        return option ? option.name : '';
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{isNew ? 'افزودن شرکت جدید' : `ویرایش شرکت: ${company.name}`}</h1>
            <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-md space-y-8">
                {/* Basic Info */}
                <fieldset className="border p-4 rounded-md space-y-4">
                    <legend className="px-2 font-semibold">اطلاعات پایه</legend>
                    <div>
                        <label className="block text-sm font-medium">نام شرکت</label>
                        <input type="text" name="name" value={company.name} onChange={handleChange} className="w-full p-2 border rounded-md" required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">اسلاگ (آدرس صفحه)</label>
                        <input type="text" value={company.slug} onChange={handleSlugChange} className="w-full p-2 border rounded-md ltr" required disabled={!isNew} />
                        <p className="text-xs text-gray-500 mt-1">این فیلد به صورت خودکار از نام شرکت ساخته می‌شود اما قابل ویرایش است. فقط از حروف انگلیسی، اعداد و خط تیره (-) استفاده کنید.</p>
                    </div>
                    <ImageUpload
                        label="لوگو شرکت"
                        value={company.logoUrl}
                        onChange={(value) => handleFieldChange('logoUrl', value)}
                        helpText="تصویر را مستقیماً بارگذاری کنید یا مسیر آن را وارد نمایید. نسبت تصویر پیشنهادی: 1:1 (مربع)."
                    />
                     <div>
                        <label className="block text-sm font-medium">شعار</label>
                        <input type="text" name="slogan" value={company.slogan} onChange={handleChange} className="w-full p-2 border rounded-md" />
                    </div>
                    <ImageUpload
                        label="تصویر پس‌زمینه شعار"
                        value={company.sloganImageUrl}
                        onChange={(value) => handleFieldChange('sloganImageUrl', value)}
                        helpText="تصویر را مستقیماً بارگذاری کنید یا مسیر آن را وارد نمایید. اندازه پیشنهادی: 1200x400 پیکسل."
                    />
                    <div>
                        <label className="block text-sm font-medium">توضیحات کوتاه (برای کارت)</label>
                        <textarea name="shortDescription" value={company.shortDescription} onChange={handleChange} rows={2} className="w-full p-2 border rounded-md"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">معرفی مدیریتی (کامل)</label>
                        <textarea name="managementIntro" value={company.managementIntro} onChange={handleChange} rows={5} className="w-full p-2 border rounded-md"/>
                    </div>
                </fieldset>

                {/* Dynamic Lists: Services, Advantages, Assets */}
                {(['services', 'competitiveAdvantages', 'assets'] as const).map(listName => (
                    <fieldset key={listName} className="border p-4 rounded-md space-y-4">
                        <legend className="px-2 font-semibold">{ {services: 'خدمات', competitiveAdvantages: 'مزایای رقابتی', assets: 'دارایی‌ها'}[listName] }</legend>
                        {company[listName].map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 border-b pb-2">
                                <select name="icon" value={getIconName(item.icon)} onChange={e => handleListChange(listName, index, e)} className="p-2 border rounded-md">
                                    {iconOptions.map(opt => <option key={opt.name} value={opt.name}>{opt.name}</option>)}
                                </select>
                                <input type="text" name="title" value={item.title} onChange={e => handleListChange(listName, index, e)} placeholder="عنوان" className="p-2 border rounded-md md:col-span-1"/>
                                <input type="text" name="description" value={item.description} onChange={e => handleListChange(listName, index, e)} placeholder="توضیحات" className="p-2 border rounded-md md:col-span-1"/>
                                <button type="button" onClick={() => removeListItem(listName, index)} className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                                    <TrashIcon className="w-5 h-5 mx-auto" />
                                </button>
                            </div>
                        ))}
                         <button type="button" onClick={() => addListItem(listName)} className="flex items-center gap-2 mt-2 px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600">
                            <PlusIcon className="w-4 h-4"/> افزودن آیتم
                        </button>
                    </fieldset>
                ))}
                
                 {/* Target Customers */}
                <fieldset className="border p-4 rounded-md">
                    <legend className="px-2 font-semibold">مشتریان هدف</legend>
                    <textarea 
                        value={company.targetCustomers.join('\\n')}
                        onChange={e => setCompany(prev => ({...prev, targetCustomers: e.target.value.split('\\n')}))}
                        rows={3} className="w-full p-2 border rounded-md"
                        placeholder="هر مشتری در یک خط جداگانه"
                    />
                </fieldset>

                 {/* CEO and Brand */}
                 <fieldset className="border p-4 rounded-md space-y-4">
                    <legend className="px-2 font-semibold">مدیرعامل و برند</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">نام مدیرعامل</label>
                            <input type="text" name="ceo.name" value={company.ceo.name} onChange={handleChange} className="w-full p-2 border rounded-md"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">جمله الهام‌بخش</label>
                            <input type="text" name="ceo.quote" value={company.ceo.quote} onChange={handleChange} className="w-full p-2 border rounded-md"/>
                        </div>
                        <div>
                             <label className="block text-sm font-medium">شخصیت برند</label>
                            <input type="text" name="brandIdentity.personality" value={company.brandIdentity.personality} onChange={handleChange} className="w-full p-2 border rounded-md"/>
                        </div>
                         <div>
                             <label className="block text-sm font-medium">لحن ارتباطی</label>
                            <input type="text" name="brandIdentity.tone" value={company.brandIdentity.tone} onChange={handleChange} className="w-full p-2 border rounded-md"/>
                        </div>
                         <div className="md:col-span-2">
                             <label className="block text-sm font-medium">رنگ‌های برند (کد هگز، جدا شده با کاما)</label>
                            <input 
                                type="text"
                                value={company.brandIdentity.colors.join(', ')}
                                onChange={e => setCompany(prev => ({...prev, brandIdentity: {...prev.brandIdentity, colors: e.target.value.split(',').map(c => c.trim())}}))}
                                className="w-full p-2 border rounded-md ltr"
                                placeholder="#00bfa6, #d4af37, #555555"
                            />
                        </div>
                    </div>
                 </fieldset>

                 {/* Org Chart */}
                 <OrgChartEditor 
                    departments={company.organizationalChart || []}
                    onDepartmentsChange={handleOrgChartChange}
                />

                <div className="flex justify-end gap-4">
                     <button type="button" onClick={() => navigate('/admin/companies')} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                        انصراف
                    </button>
                    <button type="submit" className="px-6 py-2 bg-[#00bfa6] text-white font-bold rounded-md hover:bg-[#00a793]">
                       {isNew ? 'ایجاد شرکت' : 'ذخیره تغییرات'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompanyEditPage;