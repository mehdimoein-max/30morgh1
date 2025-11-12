import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { FeatherIcon } from './Icons';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { holdingData } = useData();
  const isHomePage = location.pathname === '/';

  const navLinks = [
    { name: 'خانه', href: '/', sectionId: 'hero' },
    { name: 'درباره ما', href: '/', sectionId: 'about' },
    { name: 'چشم‌انداز و مأموریت', href: '/', sectionId: 'vision-mission' },
    { name: 'ارزش‌ها', href: '/', sectionId: 'values' },
    { name: 'شرکت‌های زیرمجموعه', href: '/', sectionId: 'subsidiaries' },
    { name: 'تماس با ما', href: '/', sectionId: 'contact' },
  ];

  const handleScroll = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  const renderHomeLinks = () => navLinks.map(link => (
    <a
      key={link.name}
      href={`#${link.sectionId}`}
      onClick={(e) => {
        e.preventDefault();
        handleScroll(link.sectionId);
      }}
      className="block md:inline-block px-4 py-2 text-gray-700 hover:text-[#00bfa6] transition-colors duration-300"
    >
      {link.name}
    </a>
  ));

  const renderAllPageLinks = () => (
    <>
      <Link to="/" onClick={() => setIsOpen(false)} className="block md:inline-block px-4 py-2 text-gray-700 hover:text-[#00bfa6] transition-colors duration-300">خانه</Link>
      <Link to="/training" onClick={() => setIsOpen(false)} className="block md:inline-block px-4 py-2 text-gray-700 hover:text-[#00bfa6] transition-colors duration-300">آموزش و تمرین</Link>
    </>
  );


  if (!holdingData) return null;

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <FeatherIcon className="h-8 w-8 text-[#00bfa6]" />
            <span className="text-2xl font-bold text-[#555555]">{holdingData.name}</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-1 space-x-reverse">
            {isHomePage ? renderHomeLinks() : renderAllPageLinks()}
             {isHomePage && <Link to="/training" className="block md:inline-block px-4 py-2 text-gray-700 hover:text-[#00bfa6] transition-colors duration-300">آموزش و تمرین</Link>}
          </nav>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white py-2">
          <nav className="flex flex-col items-center">
             {isHomePage ? renderHomeLinks() : renderAllPageLinks()}
             {isHomePage && <Link to="/training" onClick={() => setIsOpen(false)} className="block md:inline-block px-4 py-2 text-gray-700 hover:text-[#00bfa6] transition-colors duration-300">آموزش و تمرین</Link>}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;