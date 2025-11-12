import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import type { HoldingData, Department } from '../../types';
import OrgChartEditor from '../../components/OrgChartEditor';
import ImageUpload from '../../components/ImageUpload';

const HoldingSettingsPage: React.FC = () => {
  const { holdingData, updateHoldingData } = useData();
  const [formData, setFormData] = useState<HoldingData>(holdingData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    
    setFormData(prevData => {
      const newData = { ...prevData };
      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleFieldChange = (name: string, value: string) => {
    const keys = name.split('.');
    setFormData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };
  
  const handleValueChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     const { name, value } = e.target;
     const newItems = [...formData.values.items];
     (newItems[index] as any)[name] = value;
     setFormData(prevData => ({ ...prevData, values: {...prevData.values, items: newItems }}));
  }

  const handleOrgChartChange = (newDepartments: Department[]) => {
      setFormData(prevData => ({ ...prevData, organizationalChart: newDepartments }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateHoldingData(formData);
    alert('اطلاعات با موفقیت به‌روزرسانی شد!');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">تنظیمات هلدینگ</h1>
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-md space-y-6">
        
        {/* General Info */}
        <section className="space-y-4 border-b pb-6">
          <h2 className="text-xl font-semibold text-gray-700">اطلاعات عمومی</h2>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">نام هلدینگ</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">شعار هلدینگ</label>
            <input type="text" name="slogan" value={formData.slogan} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">معرفی کوتاه</label>
            <textarea name="intro" value={formData.intro} onChange={handleChange} rows={4} className="w-full p-2 border rounded-md" />
          </div>
          <ImageUpload
            label="تصویر اصلی صفحه نخست"
            value={formData.heroImageUrl}
            onChange={(value) => handleFieldChange('heroImageUrl', value)}
            helpText="تصویر را مستقیماً بارگذاری کنید یا مسیر آن را وارد نمایید. اندازه پیشنهادی: 1920x1080 پیکسل."
          />
        </section>
        
        {/* Vision & Mission */}
        <section className="space-y-4 border-b pb-6">
          <h2 className="text-xl font-semibold text-gray-700">چشم‌انداز و مأموریت</h2>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">متن چشم‌انداز</label>
            <textarea name="vision.text" value={formData.vision.text} onChange={handleChange} rows={3} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">متن مأموریت</label>
            <textarea name="mission.text" value={formData.mission.text} onChange={handleChange} rows={3} className="w-full p-2 border rounded-md" />
          </div>
        </section>

        {/* Values */}
        <section className="space-y-4 border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-700">ارزش‌ها</h2>
            {formData.values.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md">
                     <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">عنوان ارزش</label>
                        <input type="text" name="name" value={item.name} onChange={(e) => handleValueChange(index, e)} className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">توضیح ارزش</label>
                        <input type="text" name="description" value={item.description} onChange={(e) => handleValueChange(index, e)} className="w-full p-2 border rounded-md" />
                    </div>
                </div>
            ))}
        </section>

        {/* Org Chart Editor */}
        <section className="border-b pb-6">
            <OrgChartEditor 
                departments={formData.organizationalChart || []} 
                onDepartmentsChange={handleOrgChartChange} 
            />
        </section>

        {/* Contact & Social */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">اطلاعات تماس و شبکه‌های اجتماعی</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">آدرس</label>
                <input type="text" name="contact.address" value={formData.contact.address} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">تلفن</label>
                <input type="text" name="contact.phone" value={formData.contact.phone} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">ایمیل</label>
                <input type="email" name="contact.email" value={formData.contact.email} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">لینک لینکدین</label>
                <input type="url" name="socialLinks.linkedin" value={formData.socialLinks.linkedin} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">لینک اینستاگرام</label>
                <input type="url" name="socialLinks.instagram" value={formData.socialLinks.instagram} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">لینک توییتر</label>
                <input type="url" name="socialLinks.twitter" value={formData.socialLinks.twitter} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
          </div>
        </section>

        <button type="submit" className="w-full md:w-auto px-6 py-3 bg-[#00bfa6] text-white font-bold rounded-md hover:bg-[#00a793] transition-colors">
          ذخیره تغییرات
        </button>
      </form>
    </div>
  );
};

export default HoldingSettingsPage;
