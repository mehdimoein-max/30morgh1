import React, { useRef } from 'react';

interface ImageUploadProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    helpText?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, value, onChange, helpText }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };
    
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    }

    // A simple placeholder for when the image source is invalid or missing
    const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 24 24' fill='none' stroke='%23d1d5db' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";

    return (
        <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
            <div className="flex items-center gap-4">
                <img 
                    src={value || placeholderImage} 
                    alt="Preview" 
                    className="w-20 h-20 object-cover rounded-md border bg-gray-100"
                    onError={(e) => (e.currentTarget.src = placeholderImage)}
                />
                <div className="flex-1">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/png, image/jpeg, image/webp, image/gif"
                    />
                     <button
                        type="button"
                        onClick={handleButtonClick}
                        className="w-full px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                    >
                        بارگذاری تصویر
                    </button>
                    <input 
                        type="text"
                        value={value}
                        onChange={handleTextChange}
                        className="w-full p-2 border rounded-md ltr mt-2"
                        placeholder="... یا مسیر/آدرس تصویر را وارد کنید"
                    />
                </div>
            </div>
             {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
        </div>
    );
};

export default ImageUpload;
