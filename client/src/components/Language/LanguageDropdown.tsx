import React from 'react';
import { Select, MenuItem } from '@mui/material';
import { useRouter } from 'next/router';
import { useLanguage } from './LanguageProvider';

const LanguageDropdown: React.FC = () => {
  const router = useRouter();
  const { selectedLanguage, changeLanguage } = useLanguage(); // Consumir el contexto de idioma

  const handleLanguageChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newLanguage = event.target.value as string;
    changeLanguage(newLanguage); // Cambiar el idioma utilizando la función del contexto
    router.push(router.pathname, router.pathname, { locale: newLanguage });
  };

  return (
    <Select value={selectedLanguage} onChange={handleLanguageChange}>
      <MenuItem value="en">English 🇱🇷</MenuItem>
      <MenuItem value="es">Español 🇦🇷</MenuItem>
    </Select>
  );
};

export default LanguageDropdown;
