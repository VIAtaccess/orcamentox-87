
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PoliticaPrivacidade = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Política de Privacidade</h1>
          <p className="text-gray-600">Última atualização: 11 de agosto de 2025</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Informações que Coletamos</h2>
            <p className="text-gray-700 mb-4">Coletamos as seguintes informações:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>Dados pessoais fornecidos no cadastro (nome, email, telefone)</li>
              <li>Informações de localização (cidade, endereço para serviços)</li>
              <li>Dados profissionais (para prestadores: CNPJ, especialidades)</li>
              <li>Informações de uso da plataforma</li>
              <li>Cookies e dados de navegação</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Como Usamos suas Informações</h2>
            <p className="text-gray-700 mb-4">Utilizamos suas informações para:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>Facilitar a conexão entre clientes e prestadores</li>
              <li>Enviar notificações sobre propostas e mensagens</li>
              <li>Melhorar nossos serviços e experiência do usuário</li>
              <li>Verificar a identidade dos prestadores</li>
              <li>Cumprir obrigações legais</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Compartilhamento de Informações</h2>
            <p className="text-gray-700 mb-6">
              Compartilhamos informações limitadas entre usuários para facilitar a prestação de serviços. 
              Seus dados pessoais não são vendidos a terceiros. Podemos compartilhar informações com:
              prestadores quando você solicita orçamentos, autoridades quando exigido por lei, e 
              fornecedores de serviços que nos ajudam a operar a plataforma.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Segurança dos Dados</h2>
            <p className="text-gray-700 mb-6">
              Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados contra 
              acesso não autorizado, alteração, divulgação ou destruição. Utilizamos criptografia SSL 
              e armazenamento seguro em nuvem.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Seus Direitos</h2>
            <p className="text-gray-700 mb-4">Você tem direito a:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir informações incorretas</li>
              <li>Solicitar exclusão de seus dados</li>
              <li>Portabilidade dos dados</li>
              <li>Retirar consentimento a qualquer momento</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies</h2>
            <p className="text-gray-700 mb-6">
              Utilizamos cookies para melhorar sua experiência, personalizar conteúdo e analisar o tráfego. 
              Você pode gerenciar suas preferências de cookies nas configurações do seu navegador.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Retenção de Dados</h2>
            <p className="text-gray-700 mb-6">
              Mantemos seus dados pessoais apenas pelo tempo necessário para fornecer nossos serviços 
              ou conforme exigido por lei. Dados de contas inativas podem ser excluídos após 2 anos.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Alterações nesta Política</h2>
            <p className="text-gray-700 mb-6">
              Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas 
              através da plataforma ou por email.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contato</h2>
            <p className="text-gray-700">
              Para questões sobre privacidade ou exercer seus direitos, entre em contato:
              <br />
              Email: 
              <a href="mailto:privacidade@plataforma.com" className="text-primary hover:underline ml-1">
                privacidade@plataforma.com
              </a>
              <br />
              Telefone: (11) 99999-9999
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliticaPrivacidade;
