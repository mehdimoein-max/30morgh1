import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import type { Company } from '../types';
import { EyeIcon, TargetIcon } from '../components/Icons';
import OrgChart from '../components/OrgChart';

const Hero: React.FC = () => {
    const { holdingData } = useData();
    return (
        <section id="hero" className="relative h-[60vh] md:h-[80vh] bg-cover bg-center" style={{ backgroundImage: `url('${holdingData.heroImageUrl}')` }}>
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 leading-tight" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
                    {holdingData.name}
                </h1>
                <p className="text-xl md:text-3xl font-light" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>
                    {holdingData.slogan}
                </p>
            </div>
        </section>
    )
};

const About: React.FC = () => {
    const { holdingData } = useData();
    return (
        <section id="about" className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl font-bold mb-6 text-[#555555]">درباره ما</h2>
                <div className="w-24 h-1 bg-[#d4af37] mx-auto mb-8"></div>
                <p className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-600">
                    {holdingData.intro}
                </p>
            </div>
        </section>
    )
};

const VisionMission: React.FC = () => {
    const { holdingData } = useData();
    return (
        <section id="vision-mission" className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-center md:text-right">
                        <EyeIcon className="w-16 h-16 mx-auto md:mx-0 mb-4 text-[#00bfa6]" />
                        <h3 className="text-3xl font-bold mb-4 text-[#555555]">{holdingData.vision.title}</h3>
                        <p className="text-lg text-gray-600 leading-relaxed">{holdingData.vision.text}</p>
                    </div>
                    <div className="text-center md:text-right">
                        <TargetIcon className="w-16 h-16 mx-auto md:mx-0 mb-4 text-[#d4af37]" />
                        <h3 className="text-3xl font-bold mb-4 text-[#555555]">{holdingData.mission.title}</h3>
                        <p className="text-lg text-gray-600 leading-relaxed">{holdingData.mission.text}</p>
                    </div>
                </div>
            </div>
        </section>
    )
};

const Values: React.FC = () => {
    const { holdingData } = useData();
    return (
        <section id="values" className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl font-bold mb-6 text-[#555555]">{holdingData.values.title}</h2>
                <div className="w-24 h-1 bg-[#d4af37] mx-auto mb-12"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {holdingData.values.items.map((value) => (
                        <div key={value.name} className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-2 transition-transform duration-300">
                            <div className="bg-[#00bfa6]/10 p-4 rounded-full mb-4">
                                <value.icon className="w-12 h-12 text-[#00bfa6]" />
                            </div>
                            <h4 className="text-xl font-bold mb-2 text-[#555555]">{value.name}</h4>
                            <p className="text-gray-600">{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
};

const SubsidiaryCard: React.FC<{ company: Company }> = ({ company }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
        <img src={company.logoUrl} alt={`${company.name} Logo`} className="w-full h-48 object-cover" />
        <div className="p-6">
            <h3 className="text-2xl font-bold mb-2 text-[#555555]">{company.name}</h3>
            <p className="text-gray-600 mb-4 h-20">{company.shortDescription}</p>
            <Link to={`/company/${company.slug}`} className="inline-block bg-[#00bfa6] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#00a793] transition-colors duration-300 group-hover:bg-[#d4af37] group-hover:text-black">
                مشاهده بیشتر
            </Link>
        </div>
    </div>
);

const Subsidiaries: React.FC = () => {
    const { holdingData } = useData();
    return (
        <section id="subsidiaries" className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold text-center mb-6 text-[#555555]">شرکت‌های زیرمجموعه</h2>
                <div className="w-24 h-1 bg-[#d4af37] mx-auto mb-12"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {holdingData.subsidiaries.map(company => (
                        <SubsidiaryCard key={company.slug} company={company} />
                    ))}
                </div>
            </div>
        </section>
    )
};

const Contact: React.FC = () => (
    <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-6 text-[#555555]">تماس با ما</h2>
            <div className="w-24 h-1 bg-[#d4af37] mx-auto mb-12"></div>
            <div className="grid lg:grid-cols-2 gap-12">
                <form className="space-y-6">
                    <input type="text" placeholder="نام شما" className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bfa6]" />
                    <input type="email" placeholder="ایمیل شما" className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bfa6]" />
                    <textarea placeholder="پیام شما" rows={5} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bfa6]"></textarea>
                    <button type="submit" className="w-full bg-[#00bfa6] text-white font-bold py-3 px-6 rounded-md hover:bg-[#00a793] transition-colors duration-300">
                        ارسال پیام
                    </button>
                </form>
                <div className="bg-gray-200 rounded-lg overflow-hidden h-96 lg:h-auto">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.878951887373!2d51.41103681525948!3d35.70465298018884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e010a3f0d4f4d%3A0x9d3a4b6b1b6b!2sTehran%2C%20Tehran%20Province%2C%20Iran!5e0!3m2!1sen!2sus!4v1622033000000"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        title="Google Maps Location"
                    ></iframe>
                </div>
            </div>
        </div>
    </section>
);

const HomePage: React.FC = () => {
    const { holdingData } = useData();
    if (!holdingData) {
        return <div>در حال بارگذاری...</div>;
    }
    return (
        <>
            <Hero />
            <About />
            <VisionMission />
            <Values />
            {holdingData.organizationalChart && holdingData.organizationalChart.length > 0 && (
                <section id="org-chart" className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl font-bold mb-6 text-[#555555]">ساختار سازمانی هلدینگ</h2>
                        <div className="w-24 h-1 bg-[#d4af37] mx-auto mb-12"></div>
                        <OrgChart departments={holdingData.organizationalChart} />
                    </div>
                </section>
            )}
            <Subsidiaries />
            <Contact />
        </>
    );
};

export default HomePage;