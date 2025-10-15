
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, ArrowLeft, Building, LogOut, Briefcase, Camera, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBrazilLocations } from '@/hooks/use-brazil-locations';
import { usePhoneMask } from '@/hooks/usePhoneMask';
import { useCnpjMask } from '@/hooks/useCnpjMask';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import CategorySelector from '@/components/CategorySelector';
import ServiceImageUpload from '@/components/ServiceImageUpload';
import { generateFriendlyUrl } from '@/utils/urlUtils';

const PerfilPrestador = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    endereco: '',
    cidade: '',
    uf: '',
    foto_url: '',
    cnpj: '',
    descricao: '',
    categoria_slug: '',
    subcategoria_slug: '',
    imagem_servico_1: '',
    imagem_servico_2: '',
    imagem_servico_3: ''
  });
  const [userId, setUserId] = useState<string>('');
  const { toast } = useToast();
  const { states, cities, loadingStates, loadingCities, fetchCities } = useBrazilLocations();
  const phoneMask = usePhoneMask(profile.whatsapp);
  const cnpjMask = useCnpjMask(profile.cnpj);

  useEffect(() => {
    if (profile.uf) {
      fetchCities(profile.uf);
    }
  }, [profile.uf, fetchCities]);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      // Buscar dados do prestador pelo email, não pelo ID
      const { data: prestador } = await supabase
        .from('profissionais')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      if (prestador) {
        setProfile({
          nome: prestador.nome || '',
          email: prestador.email || '',
          whatsapp: prestador.whatsapp || '',
          endereco: prestador.endereco || '',
          cidade: prestador.cidade || '',
          uf: prestador.uf || '',
          foto_url: prestador.foto_url || '',
          cnpj: prestador.cnpj || '',
          descricao: prestador.descricao || '',
          categoria_slug: prestador.categoria_slug || '',
          subcategoria_slug: (prestador as any).subcategoria_slug || '',
          imagem_servico_1: (prestador as any).imagem_servico_1 || '',
          imagem_servico_2: (prestador as any).imagem_servico_2 || '',
          imagem_servico_3: (prestador as any).imagem_servico_3 || ''
        });
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar ID do prestador pelo email
      const { data: prestadorData } = await supabase
        .from('profissionais')
        .select('id')
        .eq('email', user.email)
        .single();

      if (!prestadorData) {
        throw new Error('Prestador não encontrado');
      }

      const { error } = await supabase
        .from('profissionais')
        .update({
          nome: profile.nome,
          whatsapp: phoneMask.getUnmaskedValue(),
          endereco: profile.endereco,
          cidade: profile.cidade,
          uf: profile.uf,
          foto_url: profile.foto_url,
          cnpj: cnpjMask.getUnmaskedValue(),
          descricao: profile.descricao,
          categoria_slug: profile.categoria_slug,
          subcategoria_slug: profile.subcategoria_slug,
          imagem_servico_1: profile.imagem_servico_1,
          imagem_servico_2: profile.imagem_servico_2,
          imagem_servico_3: profile.imagem_servico_3
        })
        .eq('id', prestadorData.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (value: string) => {
    const formatted = phoneMask.handleChange(value);
    setProfile(prev => ({ ...prev, whatsapp: formatted }));
  };

  const handleCnpjChange = (value: string) => {
    const formatted = cnpjMask.handleChange(value);
    setProfile(prev => ({ ...prev, cnpj: formatted }));
  }; 

  const handleImageUpdate = (imageUrl: string) => {
    setProfile(prev => ({ ...prev, foto_url: imageUrl }));
  };

  const handleServiceImageUpdate = (imageNumber: 1 | 2 | 3, imageUrl: string) => {
    setProfile(prev => ({ ...prev, [`imagem_servico_${imageNumber}`]: imageUrl }));
  };

  const handleServiceImageRemove = (imageNumber: 1 | 2 | 3) => {
    setProfile(prev => ({ ...prev, [`imagem_servico_${imageNumber}`]: '' }));
  };

  const handleViewMyPage = () => {
    if (profile.cidade && profile.categoria_slug && profile.nome) {
      // Buscar ID do prestador pelo email para usar na URL
      const prestadorId = userId; // Usaremos o ID do usuário auth
      const friendlyUrl = generateFriendlyUrl(profile.cidade, profile.categoria_slug, prestadorId);
      window.open(friendlyUrl, '_blank');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Link to="/dashboard-prestador" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
              <p className="text-gray-600 mt-2">Gerencie suas informações profissionais</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Sidebar com foto */}
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-6 text-center">
                    <ImageUpload
                      currentImage={profile.foto_url}
                      userName={profile.nome}
                      userId={userId}
                      userType="profissionais"
                      onImageUpdate={handleImageUpdate}
                      size="lg"
                    />
                    <h3 className="font-bold text-lg mb-2 mt-4">{profile.nome}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Prestador de Serviço
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={handleViewMyPage}
                      className="w-full"
                      disabled={!profile.cidade || !profile.categoria_slug}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver Minha Página
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Formulário principal */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Informações Pessoais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nome">Nome Completo</Label>
                        <Input
                          id="nome"
                          value={profile.nome}
                          onChange={(e) => handleInputChange('nome', e.target.value)}
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          disabled
                          className="bg-gray-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="whatsapp">WhatsApp</Label>
                        <Input
                          id="whatsapp"
                          value={profile.whatsapp}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          placeholder="(11) 99999-9999"
                          maxLength={15}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input
                          id="cnpj"
                          value={profile.cnpj}
                          onChange={(e) => handleCnpjChange(e.target.value)}
                          placeholder="00.000.000/0001-00"
                          maxLength={18}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="descricao">Descrição dos Serviços</Label>
                      <Textarea
                        id="descricao"
                        value={profile.descricao}
                        onChange={(e) => handleInputChange('descricao', e.target.value)}
                        placeholder="Descreva os serviços que você oferece..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2" />
                      Categoria Profissional
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CategorySelector
                      selectedCategory={profile.categoria_slug}
                      selectedSubcategory={profile.subcategoria_slug}
                      onCategoryChange={(categorySlug) => handleInputChange('categoria_slug', categorySlug)}
                      onSubcategoryChange={(subcategorySlug) => handleInputChange('subcategoria_slug', subcategorySlug)}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Endereço
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="endereco">Endereço Completo</Label>
                      <Textarea
                        id="endereco"
                        value={profile.endereco}
                        onChange={(e) => handleInputChange('endereco', e.target.value)}
                        placeholder="Rua, número, bairro..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="uf">Estado</Label>
                        <Select 
                          value={profile.uf} 
                          onValueChange={(val) => handleInputChange('uf', val)}
                          disabled={loadingStates}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={loadingStates ? 'Carregando...' : 'Selecione'} />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map((uf) => (
                              <SelectItem key={uf.sigla} value={uf.sigla}>
                                {uf.nome} ({uf.sigla})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="cidade">Cidade</Label>
                        <Select 
                          value={profile.cidade} 
                          onValueChange={(val) => handleInputChange('cidade', val)}
                          disabled={!profile.uf || loadingCities}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={!profile.uf ? 'Selecione o estado primeiro' : (loadingCities ? 'Carregando...' : 'Selecione')} />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((c) => (
                              <SelectItem key={c.id} value={c.nome}>
                                {c.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="h-5 w-5 mr-2" />
                      Galeria de Serviços
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Adicione até 3 fotos dos seus melhores trabalhos para mostrar aos clientes
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <ServiceImageUpload
                        currentImage={profile.imagem_servico_1}
                        userId={userId}
                        imageNumber={1}
                        onImageUpdate={(url) => handleServiceImageUpdate(1, url)}
                        onImageRemove={() => handleServiceImageRemove(1)}
                      />
                      <ServiceImageUpload
                        currentImage={profile.imagem_servico_2}
                        userId={userId}
                        imageNumber={2}
                        onImageUpdate={(url) => handleServiceImageUpdate(2, url)}
                        onImageRemove={() => handleServiceImageRemove(2)}
                      />
                      <ServiceImageUpload
                        currentImage={profile.imagem_servico_3}
                        userId={userId}
                        imageNumber={3}
                        onImageUpdate={(url) => handleServiceImageUpdate(3, url)}
                        onImageRemove={() => handleServiceImageRemove(3)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col md:flex-row md:justify-end gap-3">
                  <Button 
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full md:w-auto"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                  <Button 
                    onClick={handleSave} 
                    disabled={isLoading}
                    className="w-full md:w-auto"
                  >
                    {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PerfilPrestador;
