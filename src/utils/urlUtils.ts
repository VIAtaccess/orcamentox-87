/**
 * Utilitários para geração de URLs amigáveis
 */

/**
 * Gera URL amigável para perfil do profissional
 * Formato: /cidade/categoria/id
 */
export const gerarUrlProfissional = (prestador: {
  cidade: string;
  categoria_slug: string;
  id: string;
}) => {
  const cidade = prestador.cidade
    .toLowerCase()
    .replace(/\s+/g, '-')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove acentos
  
  const categoria = prestador.categoria_slug;
  const id = prestador.id;
  
  return `/${cidade}/${categoria}/${id}`;
};

/**
 * Gera URL amigável para perfil do profissional (versão simplificada)
 */
export const generateFriendlyUrl = (cidade: string, categoria: string, id: string) => {
  const cidadeNormalizada = cidade
    .toLowerCase()
    .replace(/\s+/g, '-')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove acentos
  
  return `/${cidadeNormalizada}/${categoria}/${id}`;
};

/**
 * Normaliza nome da cidade para URL
 */
export const normalizarCidade = (cidade: string): string => {
  return cidade
    .toLowerCase()
    .replace(/\s+/g, '-')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove acentos
};

/**
 * Valida se uma URL de profissional está no formato correto
 */
export const validarUrlProfissional = (url: string): boolean => {
  const regex = /^\/[a-z-]+\/[a-z-]+\/[0-9a-f-]+$/;
  return regex.test(url);
};