-- Seed data for categories and subcategories
-- Insert categories
insert into public.categories (name, slug, description, icon, color) values
  ('Reforma e Construção','reforma-construcao','Pedreiros, marceneiros, arquitetos','Wrench','bg-blue-500'),
  ('Serviços Elétricos','servicos-eletricos','Eletricistas, instalações','Zap','bg-yellow-500'),
  ('Encanamento','encanamento','Encanadores, hidráulica','Droplets','bg-blue-600'),
  ('Pintura','pintura','Pintores, decoração','Paintbrush','bg-green-500'),
  ('Limpeza','limpeza','Faxina, limpeza pós-obra','Sparkles','bg-purple-500'),
  ('Beleza e Estética','beleza-estetica','Cabeleireiros, manicures','Scissors','bg-pink-500'),
  ('Automotivo','automotivo','Mecânicos, funilaria','Car','bg-gray-600'),
  ('Tecnologia','tecnologia','Técnicos, desenvolvedores','Monitor','bg-indigo-500'),
  ('Serviços Domésticos','servicos-domesticos','Diaristas, cuidadoras, babás','Home','bg-orange-500'),
  ('Jardinagem e Paisagismo','jardinagem-paisagismo','Jardineiros, poda, gramados','Leaf','bg-emerald-500'),
  ('Climatização','climatizacao','Ar-condicionado, refrigeração','Snowflake','bg-cyan-600'),
  ('Marcenaria e Móveis','marcenaria-moveis','Projetos sob medida','Hammer','bg-amber-700'),
  ('Segurança','seguranca','CFTV, alarmes, controles','Shield','bg-slate-700'),
  ('Fotografia e Vídeo','foto-video','Coberturas, edições','Camera','bg-fuchsia-600'),
  ('Eventos e Entretenimento','eventos-entretenimento','Buffet, DJ, decoração','Music','bg-red-500'),
  ('Aulas e Treinamentos','aulas-treinamentos','Aulas particulares e cursos','Book','bg-teal-600');

-- Insert subcategories referencing category by slug
-- Reforma e Construção
insert into public.subcategories (category_id, name, slug, description)
select id, 'Pedreiro','reforma-construcao-pedreiro','Serviços de alvenaria geral' from public.categories where slug='reforma-construcao';
insert into public.subcategories (category_id, name, slug) select id, 'Marcenaria','reforma-construcao-marcenaria' from public.categories where slug='reforma-construcao';
insert into public.subcategories (category_id, name, slug) select id, 'Alvenaria','reforma-construcao-alvenaria' from public.categories where slug='reforma-construcao';
insert into public.subcategories (category_id, name, slug) select id, 'Gesso e Drywall','reforma-construcao-gesso' from public.categories where slug='reforma-construcao';
insert into public.subcategories (category_id, name, slug) select id, 'Impermeabilização','reforma-construcao-impermeabilizacao' from public.categories where slug='reforma-construcao';
insert into public.subcategories (category_id, name, slug) select id, 'Colocação de Pisos','reforma-construcao-pisos' from public.categories where slug='reforma-construcao';
insert into public.subcategories (category_id, name, slug) select id, 'Telhados','reforma-construcao-telhados' from public.categories where slug='reforma-construcao';
insert into public.subcategories (category_id, name, slug) select id, 'Arquitetura','reforma-construcao-arquitetura' from public.categories where slug='reforma-construcao';
insert into public.subcategories (category_id, name, slug) select id, 'Engenharia','reforma-construcao-engenharia' from public.categories where slug='reforma-construcao';
insert into public.subcategories (category_id, name, slug) select id, 'Serralheria','reforma-construcao-serralheria' from public.categories where slug='reforma-construcao';

-- Serviços Elétricos
insert into public.subcategories (category_id, name, slug) select id, 'Instalações Elétricas','eletrica-instalacoes' from public.categories where slug='servicos-eletricos';
insert into public.subcategories (category_id, name, slug) select id, 'Manutenção Elétrica','eletrica-manutencao' from public.categories where slug='servicos-eletricos';
insert into public.subcategories (category_id, name, slug) select id, 'Quadro de Força','eletrica-quadro-de-forca' from public.categories where slug='servicos-eletricos';
insert into public.subcategories (category_id, name, slug) select id, 'Iluminação','eletrica-iluminacao' from public.categories where slug='servicos-eletricos';
insert into public.subcategories (category_id, name, slug) select id, 'Aterramento','eletrica-aterramento' from public.categories where slug='servicos-eletricos';
insert into public.subcategories (category_id, name, slug) select id, 'Padrão de Entrada','eletrica-padrao-entrada' from public.categories where slug='servicos-eletricos';
insert into public.subcategories (category_id, name, slug) select id, 'Automação Residencial','eletrica-automacao' from public.categories where slug='servicos-eletricos';
insert into public.subcategories (category_id, name, slug) select id, 'Cabeamento','eletrica-cabeamento' from public.categories where slug='servicos-eletricos';

-- Encanamento
insert into public.subcategories (category_id, name, slug) select id, 'Desentupimento','encanamento-desentupimento' from public.categories where slug='encanamento';
insert into public.subcategories (category_id, name, slug) select id, 'Instalação de Louças','encanamento-loucas' from public.categories where slug='encanamento';
insert into public.subcategories (category_id, name, slug) select id, 'Vazamentos','encanamento-vazamentos' from public.categories where slug='encanamento';
insert into public.subcategories (category_id, name, slug) select id, 'Aquecedor a Gás','encanamento-aquecedor-gas' from public.categories where slug='encanamento';
insert into public.subcategories (category_id, name, slug) select id, 'Caixa d’Água','encanamento-caixa-dagua' from public.categories where slug='encanamento';
insert into public.subcategories (category_id, name, slug) select id, 'Hidráulica Geral','encanamento-hidraulica' from public.categories where slug='encanamento';

-- Pintura
insert into public.subcategories (category_id, name, slug) select id, 'Pintura Residencial','pintura-residencial' from public.categories where slug='pintura';
insert into public.subcategories (category_id, name, slug) select id, 'Pintura Comercial','pintura-comercial' from public.categories where slug='pintura';
insert into public.subcategories (category_id, name, slug) select id, 'Textura','pintura-textura' from public.categories where slug='pintura';
insert into public.subcategories (category_id, name, slug) select id, 'Grafiato','pintura-grafiato' from public.categories where slug='pintura';
insert into public.subcategories (category_id, name, slug) select id, 'Papel de Parede','pintura-papel-de-parede' from public.categories where slug='pintura';
insert into public.subcategories (category_id, name, slug) select id, 'Massa Corrida','pintura-massa-corrida' from public.categories where slug='pintura';

-- Limpeza
insert into public.subcategories (category_id, name, slug) select id, 'Pós-Obra','limpeza-pos-obra' from public.categories where slug='limpeza';
insert into public.subcategories (category_id, name, slug) select id, 'Residencial','limpeza-residencial' from public.categories where slug='limpeza';
insert into public.subcategories (category_id, name, slug) select id, 'Comercial','limpeza-comercial' from public.categories where slug='limpeza';
insert into public.subcategories (category_id, name, slug) select id, 'Estofados','limpeza-estofados' from public.categories where slug='limpeza';
insert into public.subcategories (category_id, name, slug) select id, 'Janelas e Vidros','limpeza-vidros' from public.categories where slug='limpeza';
insert into public.subcategories (category_id, name, slug) select id, 'Jardinagem','limpeza-jardinagem' from public.categories where slug='limpeza';

-- Beleza e Estética
insert into public.subcategories (category_id, name, slug) select id, 'Cabeleireiro','beleza-cabeleireiro' from public.categories where slug='beleza-estetica';
insert into public.subcategories (category_id, name, slug) select id, 'Manicure e Pedicure','beleza-manicure' from public.categories where slug='beleza-estetica';
insert into public.subcategories (category_id, name, slug) select id, 'Maquiagem','beleza-maquiagem' from public.categories where slug='beleza-estetica';
insert into public.subcategories (category_id, name, slug) select id, 'Depilação','beleza-depilacao' from public.categories where slug='beleza-estetica';
insert into public.subcategories (category_id, name, slug) select id, 'Barbearia','beleza-barbearia' from public.categories where slug='beleza-estetica';
insert into public.subcategories (category_id, name, slug) select id, 'Sobrancelhas','beleza-sobrancelhas' from public.categories where slug='beleza-estetica';

-- Automotivo
insert into public.subcategories (category_id, name, slug) select id, 'Mecânica Geral','auto-mecanica' from public.categories where slug='automotivo';
insert into public.subcategories (category_id, name, slug) select id, 'Elétrica Automotiva','auto-eletrica' from public.categories where slug='automotivo';
insert into public.subcategories (category_id, name, slug) select id, 'Funilaria e Pintura','auto-funilaria' from public.categories where slug='automotivo';
insert into public.subcategories (category_id, name, slug) select id, 'Troca de Óleo','auto-troca-oleo' from public.categories where slug='automotivo';
insert into public.subcategories (category_id, name, slug) select id, 'Ar-Condicionado','auto-ar-condicionado' from public.categories where slug='automotivo';
insert into public.subcategories (category_id, name, slug) select id, 'Martelinho de Ouro','auto-martelinho' from public.categories where slug='automotivo';

-- Tecnologia
insert into public.subcategories (category_id, name, slug) select id, 'Suporte Técnico','tech-suporte' from public.categories where slug='tecnologia';
insert into public.subcategories (category_id, name, slug) select id, 'Desenvolvimento Web','tech-dev-web' from public.categories where slug='tecnologia';
insert into public.subcategories (category_id, name, slug) select id, 'Desenvolvimento Mobile','tech-dev-mobile' from public.categories where slug='tecnologia';
insert into public.subcategories (category_id, name, slug) select id, 'Redes e Infra','tech-redes' from public.categories where slug='tecnologia';
insert into public.subcategories (category_id, name, slug) select id, 'Segurança da Informação','tech-seguranca' from public.categories where slug='tecnologia';
insert into public.subcategories (category_id, name, slug) select id, 'Design UX/UI','tech-design' from public.categories where slug='tecnologia';

-- Serviços Domésticos
insert into public.subcategories (category_id, name, slug) select id, 'Babá','domestico-baba' from public.categories where slug='servicos-domesticos';
insert into public.subcategories (category_id, name, slug) select id, 'Cuidador de Idosos','domestico-cuidador' from public.categories where slug='servicos-domesticos';
insert into public.subcategories (category_id, name, slug) select id, 'Passadeira','domestico-passadeira' from public.categories where slug='servicos-domesticos';
insert into public.subcategories (category_id, name, slug) select id, 'Cozinheira','domestico-cozinheira' from public.categories where slug='servicos-domesticos';
insert into public.subcategories (category_id, name, slug) select id, 'Organização','domestico-organizacao' from public.categories where slug='servicos-domesticos';

-- Jardinagem e Paisagismo
insert into public.subcategories (category_id, name, slug) select id, 'Poda de Árvores','jardinagem-poda' from public.categories where slug='jardinagem-paisagismo';
insert into public.subcategories (category_id, name, slug) select id, 'Corte de Grama','jardinagem-grama' from public.categories where slug='jardinagem-paisagismo';
insert into public.subcategories (category_id, name, slug) select id, 'Paisagismo','jardinagem-paisagismo' from public.categories where slug='jardinagem-paisagismo';
insert into public.subcategories (category_id, name, slug) select id, 'Irrigação','jardinagem-irrigacao' from public.categories where slug='jardinagem-paisagismo';
insert into public.subcategories (category_id, name, slug) select id, 'Controle de Pragas','jardinagem-pragas' from public.categories where slug='jardinagem-paisagismo';

-- Climatização
insert into public.subcategories (category_id, name, slug) select id, 'Instalação de Split','clima-instalacao-split' from public.categories where slug='climatizacao';
insert into public.subcategories (category_id, name, slug) select id, 'Manutenção','clima-manutencao' from public.categories where slug='climatizacao';
insert into public.subcategories (category_id, name, slug) select id, 'Higienização','clima-higienizacao' from public.categories where slug='climatizacao';
insert into public.subcategories (category_id, name, slug) select id, 'Refrigeração Comercial','clima-refrigeracao-comercial' from public.categories where slug='climatizacao';

-- Marcenaria e Móveis
insert into public.subcategories (category_id, name, slug) select id, 'Móveis Planejados','marcenaria-moveis-planejados' from public.categories where slug='marcenaria-moveis';
insert into public.subcategories (category_id, name, slug) select id, 'Restauração','marcenaria-restauracao' from public.categories where slug='marcenaria-moveis';
insert into public.subcategories (category_id, name, slug) select id, 'Portas e Rodapés','marcenaria-portas' from public.categories where slug='marcenaria-moveis';
insert into public.subcategories (category_id, name, slug) select id, 'Montagem de Móveis','marcenaria-montagem' from public.categories where slug='marcenaria-moveis';

-- Segurança
insert into public.subcategories (category_id, name, slug) select id, 'Câmeras de Segurança','seguranca-cftv' from public.categories where slug='seguranca';
insert into public.subcategories (category_id, name, slug) select id, 'Alarmes','seguranca-alarmes' from public.categories where slug='seguranca';
insert into public.subcategories (category_id, name, slug) select id, 'Cerca Elétrica','seguranca-cerca' from public.categories where slug='seguranca';
insert into public.subcategories (category_id, name, slug) select id, 'Controle de Acesso','seguranca-acesso' from public.categories where slug='seguranca';

-- Fotografia e Vídeo
insert into public.subcategories (category_id, name, slug) select id, 'Fotografia de Eventos','foto-eventos' from public.categories where slug='foto-video';
insert into public.subcategories (category_id, name, slug) select id, 'Ensaio Fotográfico','foto-ensaio' from public.categories where slug='foto-video';
insert into public.subcategories (category_id, name, slug) select id, 'Filmagem','video-filmagem' from public.categories where slug='foto-video';
insert into public.subcategories (category_id, name, slug) select id, 'Edição','video-edicao' from public.categories where slug='foto-video';

-- Eventos e Entretenimento
insert into public.subcategories (category_id, name, slug) select id, 'Buffet','eventos-buffet' from public.categories where slug='eventos-entretenimento';
insert into public.subcategories (category_id, name, slug) select id, 'DJ','eventos-dj' from public.categories where slug='eventos-entretenimento';
insert into public.subcategories (category_id, name, slug) select id, 'Decoração de Eventos','eventos-decoracao' from public.categories where slug='eventos-entretenimento';
insert into public.subcategories (category_id, name, slug) select id, 'Locação de Equipamentos','eventos-locacao' from public.categories where slug='eventos-entretenimento';

-- Aulas e Treinamentos
insert into public.subcategories (category_id, name, slug) select id, 'Reforço Escolar','aulas-reforco' from public.categories where slug='aulas-treinamentos';
insert into public.subcategories (category_id, name, slug) select id, 'Idiomas','aulas-idiomas' from public.categories where slug='aulas-treinamentos';
insert into public.subcategories (category_id, name, slug) select id, 'Música','aulas-musica' from public.categories where slug='aulas-treinamentos';
insert into public.subcategories (category_id, name, slug) select id, 'Tecnologia','aulas-tecnologia' from public.categories where slug='aulas-treinamentos';
