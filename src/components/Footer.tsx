import React from 'react';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
const Footer = () => {
  return <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="bg-white rounded-lg p-3 inline-block">
                <img src="/src/assets/logo-horizontal.png" alt="OrcamentoX" className="h-28 w-auto" />
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              A plataforma que conecta você aos melhores prestadores de serviço do Brasil. 
              Rápido, seguro e gratuito.
            </p>
            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Links Rápidos</h3>
            <ul className="space-y-4">
              <li><Link to="/como-funciona" className="text-gray-300 hover:text-white transition-colors">Como Funciona</Link></li>
              <li><Link to="/categorias" className="text-gray-300 hover:text-white transition-colors">Categorias</Link></li>
              <li><Link to="/prestadores" className="text-gray-300 hover:text-white transition-colors">Prestadores</Link></li>
              <li><Link to="/planos" className="text-gray-300 hover:text-white transition-colors">Planos</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Suporte</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Central de Ajuda</a></li>
              <li><Link to="/termos" className="text-gray-300 hover:text-white transition-colors">Termos de Uso</Link></li>
              <li><Link to="/privacidade" className="text-gray-300 hover:text-white transition-colors">Política de Privacidade</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Segurança</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-gray-300">(11) 99999-9999</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-gray-300">contato@orcamentox.com.br</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <span className="text-gray-300">São Paulo, SP<br />Brasil</span>
              </li>
            </ul>

            {/* CTA */}
            <div className="mt-8">
              <Link to="/solicitar-orcamento" className="btn-primary w-full inline-block text-center">
                Solicitar Orçamento
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 ORÇAMENTO<span className="text-primary font-bold">X</span>. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacidade" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/termos" className="text-gray-400 hover:text-white text-sm transition-colors">
                Termos de Uso
              </Link>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;