import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import OrgChart from '../components/OrgChart';

const CompanyPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { holdingData } = useData();
  
  if (!holdingData) {
    return <div>در حال بارگذاری...</div>;
  }
  
  const company = holdingData.subsidiaries.find(c => c.slug === slug);

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-4xl font-bold text-[#d4af37] mb-4">شرکت مورد نظر یافت نشد</h1>
        <p className="text-lg text-gray-600 mb-8">متأسفانه صفحه‌ای با این آدرس وجود ندارد.</p>
        <Link to="/" className="bg-[#00bfa6] text-white font-semibold py-3 px-8 rounded-md hover:bg-[#00a793] transition-colors duration-300">
          بازگشت به صفحه اصلی
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Slogan Section */}
      <section className="relative bg-gray-800 text-white py-20 text-center" style={{ backgroundImage: `url('${company.sloganImageUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
         <div className="bg-black/60 absolute inset-0"></div>
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>«{company.slogan}»</h1>
        </div>
      </section>

      {/* Single Column Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Intro */}
        <section>
          <h2 className="text-3xl font-bold text-[#555555] mb-4 border-r-4 border-[#00bfa6] pr-4">{company.name}</h2>
          <p className="text-lg leading-relaxed text-gray-600">{company.managementIntro}</p>
        </section>

        {/* Services */}
        <section>
          <h3 className="text-2xl font-bold text-[#555555] mb-6 border-r-4 border-[#d4af37] pr-4">حوزه فعالیت و خدمات</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {company.services.map((service, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className="bg-[#00bfa6]/10 p-3 rounded-full">
                    <service.icon className="w-10 h-10 text-[#00bfa6]" />
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-[#555555] mb-2">{service.title}</h4>
                <p className="text-sm text-gray-500">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Target Customers */}
        <section>
            <h3 className="text-2xl font-bold text-[#555555] mb-6 border-r-4 border-[#d4af37] pr-4">مشتریان هدف</h3>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <ul className="space-y-2 list-disc list-inside text-gray-600 md:columns-2">
                    {company.targetCustomers.map((customer, index) => <li key={index}>{customer}</li>)}
                </ul>
            </div>
        </section>

        {/* Advantages */}
        <section>
          <h3 className="text-2xl font-bold text-[#555555] mb-6 border-r-4 border-[#d4af37] pr-4">مزیت رقابتی</h3>
          <div className="space-y-4">
            {company.competitiveAdvantages.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <item.icon className="w-8 h-8 text-[#00bfa6] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-700">{item.title}</h4>
                  <p className="text-gray-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Assets */}
        <section>
          <h3 className="text-2xl font-bold text-[#555555] mb-6 border-r-4 border-[#d4af37] pr-4">دارایی‌ها</h3>
          <div className="space-y-4">
            {company.assets.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <item.icon className="w-8 h-8 text-[#00bfa6] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-700">{item.title}</h4>
                  <p className="text-gray-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Brand Identity */}
        <section>
             <h3 className="text-2xl font-bold text-[#555555] mb-6 border-r-4 border-[#d4af37] pr-4">هویت برند</h3>
             <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center md:text-right">
                     <div>
                        <h4 className="font-semibold text-gray-700">شخصیت برند:</h4>
                        <p className="text-gray-600 mt-2">{company.brandIdentity.personality}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-gray-700">لحن ارتباطی:</h4>
                        <p className="text-gray-600 mt-2">{company.brandIdentity.tone}</p>
                    </div>
                 </div>
             </div>
        </section>
        
        {/* Org Chart */}
        {company.organizationalChart && company.organizationalChart.length > 0 && (
            <section>
                <h3 className="text-2xl font-bold text-[#555555] mb-6 border-r-4 border-[#d4af37] pr-4">چارت سازمانی</h3>
                <div className="bg-gray-50 p-6 rounded-lg shadow-inner text-center">
                    <OrgChart departments={company.organizationalChart} />
                </div>
            </section>
        )}

        {/* CEO */}
         <section className="bg-gray-100 p-8 rounded-lg text-center">
          <h3 className="text-xl font-bold text-[#555555] mb-2">مدیرعامل: {company.ceo.name}</h3>
          <p className="text-lg italic text-[#00bfa6]">"{company.ceo.quote}"</p>
        </section>
      </main>
    </div>
  );
};

export default CompanyPage;