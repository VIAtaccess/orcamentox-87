
import { useState } from 'react';

// Máscara para CNPJ: 00.000.000/0000-00
export const useCnpjMask = (initialValue: string = '') => {
  const [value, setValue] = useState(initialValue);

  const formatCnpj = (cnpj: string) => {
    const numbers = cnpj.replace(/\D/g, '').slice(0, 14);

    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
    if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
    if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
  };

  const handleChange = (inputValue: string) => {
    const formatted = formatCnpj(inputValue);
    setValue(formatted);
    return formatted;
  };

  const getUnmaskedValue = () => value.replace(/\D/g, '');

  return { value, setValue, handleChange, getUnmaskedValue, formatCnpj };
};
