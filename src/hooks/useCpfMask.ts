
import { useState } from 'react';

// Máscara para CPF: 000.000.000-00
export const useCpfMask = (initialValue: string = '') => {
  const [value, setValue] = useState(initialValue);

  const formatCpf = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '').slice(0, 11);

    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const handleChange = (inputValue: string) => {
    const formatted = formatCpf(inputValue);
    setValue(formatted);
    return formatted;
  };

  const getUnmaskedValue = () => value.replace(/\D/g, '');

  return { value, setValue, handleChange, getUnmaskedValue, formatCpf };
};
