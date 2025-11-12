import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import type { TrainingModule } from '../types';

const TrainingModuleItem: React.FC<{ module: TrainingModule }> = ({ module }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showSolution, setShowSolution] = useState(false);

    const FileList: React.FC<{ files: { name: string; url: string }[] }> = ({ files }) => (
        <div className="mt-4">
            <h5 className="font-semibold text-gray-700">فایل‌های ضمیمه:</h5>
            <ul className="list-disc list-inside mt-2 space-y-1">
                {files.map((file, index) => (
                    <li key={index}>
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {file.name || 'دانلود فایل'}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-right p-6 flex justify-between items-center bg-gray-50 hover:bg-gray-100 focus:outline-none"
            >
                <div className="flex items-center gap-4">
                    <span className={`inline-block w-3 h-3 rounded-full ${module.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    <h3 className="text-xl font-bold text-[#555555]">{module.title}</h3>
                </div>
                <svg className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isOpen && (
                <div className="p-6 space-y-6">
                    <p className="text-gray-600">{module.description}</p>
                    <div className="prose max-w-none text-gray-700 bg-gray-50 p-4 rounded-md">
                        <p>{module.textContent}</p>
                    </div>
                    {module.fileUrl && module.fileUrl !== '#' && (
                        <a href={module.fileUrl} download className="inline-block bg-[#00bfa6] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#00a793] transition-colors">
                            دانلود فایل کلی دوره
                        </a>
                    )}
                    <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold text-[#d4af37] mb-2">تمرین</h4>
                        <p className="p-4 bg-yellow-50 border-r-4 border-yellow-400 text-yellow-800 rounded-r-md">{module.assignment.question}</p>
                        
                        {module.assignment.questionFiles && module.assignment.questionFiles.length > 0 && (
                            <FileList files={module.assignment.questionFiles} />
                        )}

                        {module.assignment.isSolutionVisible && (
                            <div className="mt-4">
                                <button
                                    onClick={() => setShowSolution(!showSolution)}
                                    className="text-[#00bfa6] font-semibold"
                                >
                                    {showSolution ? 'پنهان کردن پاسخ' : 'مشاهده پاسخ'}
                                </button>
                                {showSolution && (
                                    <div className="mt-2 p-4 bg-green-50 border-r-4 border-green-400 rounded-r-md animate-fade-in">
                                        <p className="text-green-800">{module.assignment.solution}</p>
                                        {module.assignment.solutionFiles && module.assignment.solutionFiles.length > 0 && (
                                            <FileList files={module.assignment.solutionFiles} />
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};


const TrainingPage: React.FC = () => {
    const { holdingData } = useData();

    if (!holdingData) {
        return <div>در حال بارگذاری...</div>;
    }

    const activeModules = holdingData.trainingModules.filter(m => m.isActive);

    return (
        <div className="bg-gray-100 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-[#555555]">آموزش و تمرین</h1>
                    <p className="mt-4 text-lg text-gray-600">کیت‌های آموزشی برای توسعه دانش و مهارت‌های شما</p>
                    <div className="w-24 h-1 bg-[#d4af37] mx-auto mt-4"></div>
                </div>

                <div className="max-w-4xl mx-auto space-y-6">
                    {activeModules.length > 0 ? (
                        activeModules.map(module => <TrainingModuleItem key={module.id} module={module} />)
                    ) : (
                        <p className="text-center text-gray-500 bg-white p-8 rounded-lg shadow-md">
                            در حال حاضر هیچ کیت آموزشی فعالی وجود ندارد.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrainingPage;