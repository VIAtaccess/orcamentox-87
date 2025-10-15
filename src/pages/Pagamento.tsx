import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, CreditCard, QrCode, Check, Shield, Copy, CheckCircle2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCpfMask } from "@/hooks/useCpfMask";
import { usePhoneMask } from "@/hooks/usePhoneMask";

interface Plano {
  id: string;
  titulo: string;
  descricao: string;
  valor: number;
}

const Pagamento = () => {
  const { planoId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [plano, setPlano] = useState<Plano | null>(null);
  const [loading, setLoading] = useState(true);
  const [metodo, setMetodo] = useState('cartao');
  const [processando, setProcessando] = useState(false);
  const [pagamentoAprovado, setPagamentoAprovado] = useState(false);
  const [pixData, setPixData] = useState<{qrCode?: string; copyPaste?: string} | null>(null);
  
  const { value: cpf, handleChange: handleCpfChange, getUnmaskedValue: getUnmaskedCpf } = useCpfMask('');
  const { value: telefone, handleChange: handleTelefoneChange } = usePhoneMask('');
  
  const [dadosCliente, setDadosCliente] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: ''
  });

  const [dadosCartao, setDadosCartao] = useState({
    numero: '',
    nome: '',
    validade: '',
    cvv: ''
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
    // Validações
    if (!dadosCliente.nome || !dadosCliente.email || !cpf) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os dados obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Validar CPF (11 dígitos)
    const cpfLimpo = getUnmaskedCpf();
    if (cpfLimpo.length !== 11) {
      toast({
        title: "CPF inválido",
        description: "O CPF deve conter 11 dígitos",
        variant: "destructive"
      });
      return;
    }

    if (metodo === 'cartao') {
      if (!dadosCartao.numero || !dadosCartao.nome || !dadosCartao.validade || !dadosCartao.cvv) {
        toast({
          title: "Dados do cartão incompletos",
          description: "Preencha todos os dados do cartão",
          variant: "destructive"
        });
        return;
      }
    }

    setProcessando(true);
    
    try {
      const payload = {
        paymentType: metodo,
        planData: {
          id: plano?.id,
          titulo: plano?.titulo,
          valor: plano?.valor
        },
        customerData: {
          nome: dadosCliente.nome,
          email: dadosCliente.email,
          cpf: getUnmaskedCpf(),
          telefone: telefone
        },
        cardData: metodo === 'cartao' ? dadosCartao : null,
        clientIp: '0.0.0.0'
      };

      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: payload
      });

      if (error) throw error;

      if (data.success) {
        if (metodo === 'pix') {
          setPixData({
            qrCode: data.pixQrCode,
            copyPaste: data.pixCopyPaste
          });
          toast({
            title: "PIX gerado com sucesso!",
            description: "Escaneie o QR Code ou copie o código para pagar.",
          });
        } else {
          if (data.approved) {
            setPagamentoAprovado(true);
            toast({
              title: "Pagamento aprovado!",
              description: `Assinatura do plano ${plano?.titulo} ativada com sucesso.`,
            });
            setTimeout(() => navigate('/dashboard'), 3000);
          } else {
            toast({
              title: "Pagamento pendente",
              description: "Seu pagamento está sendo processado.",
            });
          }
        }
      } else {
        throw new Error(data.error || 'Erro ao processar pagamento');
      }
      
    } catch (error: any) {
      console.error('Erro no pagamento:', error);
      toast({
        title: "Erro no pagamento",
        description: error.message || "Tente novamente ou entre em contato com o suporte.",
        variant: "destructive"
      });
    } finally {
      setProcessando(false);
    }
  };

  const copyPixCode = () => {
    if (pixData?.copyPaste) {
      navigator.clipboard.writeText(pixData.copyPaste);
      toast({
        title: "Código copiado!",
        description: "Cole no seu app de pagamentos",
      });
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

  // Renderização de sucesso
  if (pagamentoAprovado) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6 space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold">Pagamento Aprovado!</h2>
            <p className="text-muted-foreground">
              Sua assinatura do plano {plano?.titulo} foi ativada com sucesso.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecionando para o dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/planos" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos planos
          </Link>
          <h1 className="text-3xl font-bold">Finalizar Assinatura</h1>
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
                  <p className="text-muted-foreground text-sm">{plano.descricao}</p>
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
                  <p className="text-sm text-muted-foreground mt-1">Cobrado mensalmente</p>
                </div>

                <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                  <div className="flex items-center text-green-700 dark:text-green-400">
                    <Shield className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Pagamento seguro</span>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-500 mt-1">
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
                {/* Dados do Cliente */}
                <div className="space-y-4 pb-6 border-b">
                  <h3 className="font-semibold">Dados Pessoais</h3>
                  
                  <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      placeholder="Seu nome completo"
                      value={dadosCliente.nome}
                      onChange={(e) => setDadosCliente({...dadosCliente, nome: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={dadosCliente.email}
                        onChange={(e) => setDadosCliente({...dadosCliente, email: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input
                        id="cpf"
                        placeholder="000.000.000-00"
                        value={cpf}
                        onChange={(e) => handleCpfChange(e.target.value)}
                        maxLength={14}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      placeholder="(00) 00000-0000"
                      value={telefone}
                      onChange={(e) => handleTelefoneChange(e.target.value)}
                      maxLength={15}
                    />
                  </div>
                </div>

                {/* Seleção do Método */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Método de Pagamento</h3>
                  
                  <RadioGroup value={metodo} onValueChange={setMetodo}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="cartao" id="cartao" />
                      <Label htmlFor="cartao" className="flex items-center cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 mr-3" />
                        <div>
                          <div className="font-medium">Cartão de Crédito</div>
                          <div className="text-sm text-muted-foreground">Visa, Mastercard, Elo</div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix" className="flex items-center cursor-pointer flex-1">
                        <QrCode className="h-5 w-5 mr-3" />
                        <div>
                          <div className="font-medium">PIX</div>
                          <div className="text-sm text-muted-foreground">Pagamento instantâneo</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Formulário Cartão */}
                {metodo === 'cartao' && !pixData && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Dados do Cartão</h3>
                    
                    <div>
                      <Label htmlFor="numeroCartao">Número do Cartão *</Label>
                      <Input
                        id="numeroCartao"
                        placeholder="1234 5678 9012 3456"
                        value={dadosCartao.numero}
                        onChange={(e) => setDadosCartao({...dadosCartao, numero: formatCardNumber(e.target.value)})}
                        maxLength={19}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="nomeCartao">Nome no Cartão *</Label>
                      <Input
                        id="nomeCartao"
                        placeholder="Nome como está no cartão"
                        value={dadosCartao.nome}
                        onChange={(e) => setDadosCartao({...dadosCartao, nome: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="validade">Validade *</Label>
                        <Input
                          id="validade"
                          placeholder="MM/AA"
                          value={dadosCartao.validade}
                          onChange={(e) => setDadosCartao({...dadosCartao, validade: formatExpiry(e.target.value)})}
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={dadosCartao.cvv}
                          onChange={(e) => setDadosCartao({...dadosCartao, cvv: e.target.value.replace(/\D/g, '')})}
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PIX */}
                {metodo === 'pix' && !pixData && (
                  <div className="text-center p-8 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <QrCode className="h-16 w-16 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
                    <h3 className="font-bold text-lg mb-2">Pagamento via PIX</h3>
                    <p className="text-muted-foreground mb-4">
                      Após confirmar, você receberá o QR Code PIX para pagamento
                    </p>
                  </div>
                )}

                {/* Exibir QR Code PIX */}
                {pixData && (
                  <div className="space-y-4 p-6 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <h3 className="font-bold text-lg text-center">Escaneie o QR Code</h3>
                    
                    {pixData.qrCode && (
                      <div className="flex justify-center">
                        <img 
                          src={`data:image/png;base64,${pixData.qrCode}`} 
                          alt="QR Code PIX" 
                          className="w-64 h-64 border-4 border-white rounded-lg"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label>Ou copie o código PIX:</Label>
                      <div className="flex gap-2">
                        <Input 
                          value={pixData.copyPaste} 
                          readOnly 
                          className="font-mono text-xs"
                        />
                        <Button onClick={copyPixCode} variant="outline" size="icon">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-center text-muted-foreground">
                      O pagamento será confirmado automaticamente após o recebimento
                    </p>
                  </div>
                )}

                {/* Botão de Pagamento */}
                {!pixData && (
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
                )}

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