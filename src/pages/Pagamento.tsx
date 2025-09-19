import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, CreditCard, QrCode, Check, Shield } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Plano {
  id: string;
  titulo: string;
  descricao: string;
  valor: number;
}

const Pagamento = () => {
  const { planoId } = useParams();
  const { toast } = useToast();
  const [plano, setPlano] = useState<Plano | null>(null);
  const [loading, setLoading] = useState(true);
  const [metodo, setMetodo] = useState('cartao');
  const [processando, setProcessando] = useState(false);
  
  const [dadosCartao, setDadosCartao] = useState({
    numero: '',
    nome: '',
    validade: '',
    cvv: '',
    cpf: '',
    email: ''
  });

  useEffect(() => {
    const fetchPlano = async () => {
      if (!planoId) return;
      
      try {
        const { data, error } = await supabase
          .from('planos')
          .select('*')
          .eq('id', planoId)
          .single();

        if (error) throw error;
        setPlano(data);
      } catch (error) {
        console.error('Erro ao carregar plano:', error);
        toast({
          title: "Erro",
          description: "Plano não encontrado",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlano();
  }, [planoId, toast]);

  const handlePagamento = async () => {
    setProcessando(true);
    
    try {
      // Aqui você integraria com um gateway de pagamento real
      // Por enquanto, simularemos o processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Pagamento processado!",
        description: `Assinatura do plano ${plano?.titulo} ativada com sucesso.`,
      });
      
      // Redirecionaria para uma página de sucesso ou dashboard
    } catch (error) {
      toast({
        title: "Erro no pagamento",
        description: "Tente novamente ou entre em contato com o suporte.",
        variant: "destructive"
      });
    } finally {
      setProcessando(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const groups = cleaned.match(/(\d{1,4})/g);
    if (groups) {
      return groups.join(' ').substr(0, 19);
    }
    return cleaned;
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (!plano) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Plano não encontrado</h1>
          <Button asChild>
            <Link to="/planos">Voltar aos planos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/planos" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos planos
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Finalizar Assinatura</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Resumo do Plano */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-bold text-lg">{plano.titulo}</h3>
                  <p className="text-gray-600 text-sm">{plano.descricao}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Mensalidade</span>
                  <span className="font-bold">R$ {plano.valor.toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total</span>
                    <span>R$ {plano.valor.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Cobrado mensalmente</p>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center text-green-700">
                    <Shield className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Pagamento seguro</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    Seus dados estão protegidos com criptografia SSL
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulário de Pagamento */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Método de Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Seleção do Método */}
                <RadioGroup value={metodo} onValueChange={setMetodo}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="cartao" id="cartao" />
                    <Label htmlFor="cartao" className="flex items-center cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5 mr-3 text-gray-600" />
                      <div>
                        <div className="font-medium">Cartão de Crédito</div>
                        <div className="text-sm text-gray-600">Visa, Mastercard, Elo</div>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix" className="flex items-center cursor-pointer flex-1">
                      <QrCode className="h-5 w-5 mr-3 text-gray-600" />
                      <div>
                        <div className="font-medium">PIX</div>
                        <div className="text-sm text-gray-600">Pagamento instantâneo</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Formulário Cartão */}
                {metodo === 'cartao' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={dadosCartao.email}
                          onChange={(e) => setDadosCartao({...dadosCartao, email: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="numero">Número do Cartão</Label>
                        <Input
                          id="numero"
                          placeholder="1234 5678 9012 3456"
                          value={dadosCartao.numero}
                          onChange={(e) => setDadosCartao({...dadosCartao, numero: formatCardNumber(e.target.value)})}
                          maxLength={19}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="nome">Nome no Cartão</Label>
                        <Input
                          id="nome"
                          placeholder="Nome completo"
                          value={dadosCartao.nome}
                          onChange={(e) => setDadosCartao({...dadosCartao, nome: e.target.value})}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="validade">Validade</Label>
                          <Input
                            id="validade"
                            placeholder="MM/AA"
                            value={dadosCartao.validade}
                            onChange={(e) => setDadosCartao({...dadosCartao, validade: formatExpiry(e.target.value)})}
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={dadosCartao.cvv}
                            onChange={(e) => setDadosCartao({...dadosCartao, cvv: e.target.value.replace(/\D/g, '')})}
                            maxLength={4}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="cpf">CPF</Label>
                        <Input
                          id="cpf"
                          placeholder="000.000.000-00"
                          value={dadosCartao.cpf}
                          onChange={(e) => setDadosCartao({...dadosCartao, cpf: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PIX */}
                {metodo === 'pix' && (
                  <div className="text-center p-8 bg-blue-50 rounded-lg">
                    <QrCode className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                    <h3 className="font-bold text-lg mb-2">Pagamento via PIX</h3>
                    <p className="text-gray-600 mb-4">
                      Após confirmar, você receberá o código PIX para pagamento
                    </p>
                    <div className="bg-white p-4 rounded border-2 border-dashed border-blue-300">
                      <p className="text-sm text-gray-600">
                        QR Code será gerado após confirmação
                      </p>
                    </div>
                  </div>
                )}

                {/* Botão de Pagamento */}
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handlePagamento}
                  disabled={processando}
                >
                  {processando ? (
                    "Processando..."
                  ) : (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      {metodo === 'cartao' ? 'Finalizar Pagamento' : 'Gerar PIX'}
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-600 text-center">
                  Ao continuar, você concorda com nossos{' '}
                  <Link to="/termos-uso" className="text-primary hover:underline">
                    Termos de Uso
                  </Link>{' '}
                  e{' '}
                  <Link to="/politica-privacidade" className="text-primary hover:underline">
                    Política de Privacidade
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagamento;