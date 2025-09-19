
import { useState } from 'react';

export const usePhoneMask = (initialValue: string = '') => {
  const [value, setValue] = useState(initialValue);

  const formatPhone = (phone: string) => {
    // Remove tudo que não é número e limita a 11 dígitos (BR)
    const numbers = phone.replace(/\D/g, '').slice(0, 11);

    if (numbers.length <= 2) {
      return `(${numbers}`;
    }
    if (numbers.length <= 6) {
      // (11) 2345
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    }
    if (numbers.length <= 10) {
      // (11) 2345-6789 -> telefones fixos (8 dígitos no local)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    // (11) 92345-6789 -> celulares (9 dígitos no local)
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  };

  const handleChange = (inputValue: string) => {
    const formatted = formatPhone(inputValue);
    setValue(formatted);
    return formatted;
  };

  const getUnmaskedValue = () => {
    return value.replace(/\D/g, '');
  };

  return {
    value,
    setValue,
    handleChange,
    getUnmaskedValue,
    formatPhone
  };
};
