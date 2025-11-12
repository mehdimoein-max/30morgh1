import React from 'react';
import { useData } from '../contexts/DataContext';
import { FeatherIcon, LinkedinIcon, InstagramIcon, TwitterIcon } from './Icons';

const Footer: React.FC = () => {
  const { holdingData } = useData();

  if (!holdingData) return null;

  return (
    <footer className="bg-[#555555] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-4">
              <FeatherIcon className="h-10 w-10 text-[#00bfa6]" />
              <span className="text-3xl font-bold">{holdingData.name}</span>
            </div>
            <p className="max-w-xs text-gray-300">
              متعهد به ساختن آینده‌ای روشن برای ایران.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#d4af37]">تماس با ما</h3>
            <ul className="space-y-2 text-gray-300">
              <li>{holdingData.contact.address}</li>
              <li>{holdingData.contact.phone}</li>
              <li>{holdingData.contact.email}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#d4af37]">ما را دنبال کنید</h3>
            <div className="flex justify-center md:justify-start space-x-4 space-x-reverse">
              <a href={holdingData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#00bfa6] transition-colors duration-300">
                <LinkedinIcon className="h-6 w-6" />
              </a>
              <a href={holdingData.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#00bfa6] transition-colors duration-300">
                <InstagramIcon className="h-6 w-6" />
              </a>
              <a href={holdingData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#00bfa6] transition-colors duration-300">
                <TwitterIcon className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-600 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} {holdingData.name}. تمام حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;