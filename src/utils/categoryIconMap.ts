import { 
  LucideIcon,
  Book,
  Car,
  Scissors,
  Snowflake,
  Droplets,
  Music,
  Camera,
  Trees,
  Sparkles,
  Wrench,
  Hammer,
  Paintbrush,
  HardHat,
  Shield,
  Home,
  Zap,
  Monitor
} from 'lucide-react';

// Map category slugs to their appropriate icons
export const categoryIconMap: Record<string, LucideIcon> = {
  'aulas-treinamentos': Book,
  'automotivo': Car,
  'beleza-estetica': Scissors,
  'climatizacao': Snowflake,
  'encanamento': Droplets,
  'eventos-entretenimento': Music,
  'foto-video': Camera,
  'jardinagem-paisagismo': Trees,
  'limpeza': Sparkles,
  'limpeza-organizacao': Sparkles,
  'marcenaria': Wrench,
  'marcenaria-moveis': Hammer,
  'pintura': Paintbrush,
  'reforma-construcao': HardHat,
  'reformas-construcao': HardHat,
  'seguranca': Shield,
  'servicos-domesticos': Home,
  'servicos-eletricos': Zap,
  'servicos-hidraulicos': Droplets,
  'tecnologia': Monitor,
};

export const getCategoryIcon = (slug: string): LucideIcon => {
  return categoryIconMap[slug] || Wrench; // Default fallback icon
};