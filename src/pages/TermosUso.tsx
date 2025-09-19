
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermosUso = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Termos de Uso</h1>
          <p className="text-gray-600">Última atualização: 11 de agosto de 2025</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
            <p className="text-gray-700 mb-6">
              Ao acessar e usar nossa plataforma, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
              Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Descrição dos Serviços</h2>
            <p className="text-gray-700 mb-6">
              Nossa plataforma conecta clientes que precisam de serviços com prestadores qualificados. 
              Facilitamos o contato inicial e a troca de informações, mas não somos responsáveis pela execução dos serviços contratados.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Responsabilidades dos Usuários</h2>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>Fornecer informações verdadeiras e atualizadas</li>
              <li>Usar a plataforma de forma ética e legal</li>
              <li>Respeitar outros usuários</li>
              <li>Não publicar conteúdo ofensivo ou inadequado</li>
              <li>Cumprir todas as leis aplicáveis</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Prestadores de Serviços</h2>
            <p className="text-gray-700 mb-6">
              Os prestadores devem possuir as qualificações necessárias para executar os serviços oferecidos, 
              incluindo licenças, certificações e seguros quando aplicável. A plataforma não se responsabiliza 
              pela qualidade dos serviços prestados.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Pagamentos e Taxas</h2>
            <p className="text-gray-700 mb-6">
              A utilização da plataforma por clientes é gratuita. Prestadores podem ter planos pagos conforme 
              nossa tabela de preços. Todos os pagamentos pelos serviços contratados devem ser feitos diretamente 
              entre cliente e prestador.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitação de Responsabilidade</h2>
            <p className="text-gray-700 mb-6">
              Nossa responsabilidade limita-se a facilitar o contato entre usuários. Não nos responsabilizamos por:
              danos resultantes dos serviços prestados, disputas entre usuários, qualidade dos trabalhos executados, 
              ou qualquer prejuízo decorrente do uso da plataforma.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Modificações dos Termos</h2>
            <p className="text-gray-700 mb-6">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. As mudanças serão comunicadas 
              através da plataforma e entrarão em vigor imediatamente após a publicação.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contato</h2>
            <p className="text-gray-700">
              Para dúvidas sobre estes termos, entre em contato conosco através do email: 
              <a href="mailto:contato@plataforma.com" className="text-primary hover:underline ml-1">
                contato@plataforma.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermosUso;
