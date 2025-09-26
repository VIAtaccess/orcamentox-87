import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, ArrowLeft, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBrazilLocations } from '@/hooks/use-brazil-locations';
import { usePhoneMask } from '@/hooks/usePhoneMask';
import { useCpfMask } from '@/hooks/useCpfMask';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';

const Perfil = () => {
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
    cpf_cnpj: '',
    data_nascimento: '',
    tipo_pessoa: 'fisica'
  });
  const [userId, setUserId] = useState<string>('');
  const { toast } = useToast();
  const { states, cities, loadingStates, loadingCities, fetchCities } = useBrazilLocations();
  const phoneMask = usePhoneMask(profile.whatsapp);
  const cpfMask = useCpfMask(profile.cpf_cnpj);

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

      // Buscar dados do cliente pelo email
      const { data: cliente } = await supabase
        .from('clientes')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      if (cliente) {
        setProfile({
          nome: cliente.nome || '',
          email: cliente.email || '',
          whatsapp: cliente.whatsapp || '',
          endereco: cliente.endereco || '',
          cidade: cliente.cidade || '',
          uf: cliente.uf || '',
          foto_url: cliente.foto_url || '',
          cpf_cnpj: cliente.cpf_cnpj || '',
          data_nascimento: cliente.data_nascimento || '',
          tipo_pessoa: cliente.tipo_pessoa || 'fisica'
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

      const { error } = await supabase
        .from('clientes')
        .update({
          nome: profile.nome,
          whatsapp: phoneMask.getUnmaskedValue(),
          endereco: profile.endereco,
          cidade: profile.cidade,
          uf: profile.uf,
          foto_url: profile.foto_url,
          cpf_cnpj: cpfMask.getUnmaskedValue(),
          data_nascimento: profile.data_nascimento || null,
          tipo_pessoa: profile.tipo_pessoa
        })
        .eq('email', user.email);

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

  const handleCpfChange = (value: string) => {
    const formatted = cpfMask.handleChange(value);
    setProfile(prev => ({ ...prev, cpf_cnpj: formatted }));
  };

  const handleImageUpdate = (imageUrl: string) => {
    setProfile(prev => ({ ...prev, foto_url: imageUrl }));
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
              <Link to="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
              <p className="text-gray-600 mt-2">Gerencie suas informações pessoais</p>
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
                      userType="clientes"
                      onImageUpdate={handleImageUpdate}
                      size="lg"
                    />
                    <h3 className="font-bold text-lg mb-2 mt-4">{profile.nome}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Cliente
                    </p>
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
                        <Label htmlFor="cpf_cnpj">CPF</Label>
                        <Input
                          id="cpf_cnpj"
                          value={profile.cpf_cnpj}
                          onChange={(e) => handleCpfChange(e.target.value)}
                          placeholder="000.000.000-00"
                          maxLength={14}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                      <Input
                        id="data_nascimento"
                        type="date"
                        value={profile.data_nascimento}
                        onChange={(e) => handleInputChange('data_nascimento', e.target.value)}
                      />
                    </div>
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
                      <Input
                        id="endereco"
                        value={profile.endereco}
                        onChange={(e) => handleInputChange('endereco', e.target.value)}
                        placeholder="Rua, número, bairro..."
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

export default Perfil;