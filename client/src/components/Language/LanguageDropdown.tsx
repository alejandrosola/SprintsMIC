import React from 'react';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useRouter } from 'next/router';
import { useLanguage } from './LanguageProvider';
import Image from 'next/image';
import enFlag from '../../../public/us.png';
import arFlag from '../../../public/ar.png';

const LanguageDropdown: React.FC = () => {
  const router = useRouter();
  const { selectedLanguage, changeLanguage } = useLanguage(); // Consumir el contexto de idioma

  const handleLanguageChange = (event: SelectChangeEvent<any>) => {
    const newLanguage = event.target.value as string;
    changeLanguage(newLanguage); // Cambiar el idioma utilizando la función del contexto
    router.push(router.pathname, router.pathname, { locale: newLanguage });
  };

  return (
    <Select autoWidth value={selectedLanguage} onChange={handleLanguageChange}>
      <MenuItem value="en">{'English '}&nbsp;
        <Image src={enFlag} alt="English Flag" width={20} height={14} />
      </MenuItem>
      <MenuItem value="es">{'Español '}&nbsp;
        <Image src={arFlag} alt="Arg Flag" width={20} height={14} />
      </MenuItem>
    </Select >
  );
};

export default LanguageDropdown;
