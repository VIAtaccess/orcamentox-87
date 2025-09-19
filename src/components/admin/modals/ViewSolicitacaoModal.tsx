import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Clock, DollarSign, User, Mail, Phone } from 'lucide-react';

interface ViewSolicitacaoModalProps {
  open: boolean;
  onClose: () => void;
  solicitacao: any;
}

export function ViewSolicitacaoModal({ open, onClose, solicitacao }: ViewSolicitacaoModalProps) {
  if (!solicitacao) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'default';
      case 'finalizada': return 'secondary';
      case 'cancelada': return 'destructive';
      default: return 'outline';
    }
  };

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'alta': return 'destructive';
      case 'media': return 'default';
      case 'baixa': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Solicitação</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Título e Status */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{solicitacao.titulo}</h3>
            <div className="flex gap-2">
              <Badge variant={getStatusColor(solicitacao.status)}>
                {solicitacao.status?.charAt(0).toUpperCase() + solicitacao.status?.slice(1)}
              </Badge>
              <Badge variant={getUrgenciaColor(solicitacao.urgencia)}>
                Urgência: {solicitacao.urgencia?.charAt(0).toUpperCase() + solicitacao.urgencia?.slice(1)}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Descrição */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Descrição do Serviço</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{solicitacao.descricao}</p>
            </CardContent>
          </Card>

          {/* Localização */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Localização
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><span className="font-medium">Endereço:</span> {solicitacao.endereco}</p>
              <p><span className="font-medium">Cidade/UF:</span> {solicitacao.cidade}/{solicitacao.uf}</p>
            </CardContent>
          </Card>

          {/* Orçamento e Prazos */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Orçamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{solicitacao.orcamento_estimado || 'Não informado'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Max. Propostas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{solicitacao.max_propostas || 5} propostas</p>
              </CardContent>
            </Card>
          </div>

          {/* Dados do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Dados do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {solicitacao.nome_cliente && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{solicitacao.nome_cliente}</span>
                </div>
              )}
              
              {solicitacao.email_cliente && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{solicitacao.email_cliente}</span>
                </div>
              )}
              
              {solicitacao.whatsapp_cliente && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{solicitacao.whatsapp_cliente}</span>
                </div>
              )}

              {!solicitacao.nome_cliente && !solicitacao.email_cliente && !solicitacao.whatsapp_cliente && (
                <p className="text-sm text-gray-500">Dados do cliente não disponíveis</p>
              )}
            </CardContent>
          </Card>

          {/* Data de Criação */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Criada em {new Date(solicitacao.created_at).toLocaleString('pt-BR')}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}