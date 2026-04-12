"use client";

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷', displayCode: 'FR' },
  { code: 'en', name: 'English', flag: '🇬🇧', displayCode: 'EN' },
  { code: 'es', name: 'Español', flag: '🇪🇸', displayCode: 'ES' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', displayCode: 'AR' },
  { code: 'ma', name: 'الدارجة', flag: '🇲🇦', displayCode: 'MA' },
];

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const menuRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const switchLocale = (newLocale: string) => {
    setIsOpen(false);
    const searchString = searchParams.toString();
    // Reconstruit l'URL avec les paramètres de recherche actuels
    // @ts-ignore : next-intl accepte les strings concaténées comme Href
    const href = searchString ? `${pathname}?${searchString}` : pathname; 
    
    router.replace(href as any, { locale: newLocale });
  };

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Ne pas afficher sur les pages admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="language-switcher-container" ref={menuRef}>
      {isOpen && (
        <div className="language-switcher-menu">
          {languages.map((lang) => (
            <div 
              key={lang.code}
              className={`language-switcher-item ${lang.code === locale ? 'active' : ''}`}
              onClick={() => switchLocale(lang.code)}
            >
              <span className="lang-flag">{lang.flag}</span>
              <span className="lang-name">{lang.name}</span>
            </div>
          ))}
        </div>
      )}

      <div 
        className={`language-switcher-button ${isOpen ? 'open' : ''}`} 
        onClick={toggleDropdown}
        title="Changer de langue"
      >
        <span className="lang-flag">{currentLang.flag}</span>
        <span className="lang-code-text">{currentLang.displayCode}</span>
        <i className={`fas fa-chevron-${isOpen ? 'down' : 'up'} chevron-icon`}></i>
      </div>
    </div>
  );
}
