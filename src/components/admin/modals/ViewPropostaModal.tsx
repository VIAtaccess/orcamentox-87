import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ViewPropostaModalProps {
  open: boolean;
  onClose: () => void;
  proposta: any;
}

export function ViewPropostaModal({ open, onClose, proposta }: ViewPropostaModalProps) {
  if (!proposta) return null;

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      'enviada': 'default',
      'aceita': 'secondary',
      'rejeitada': 'destructive',
      'expirada': 'outline'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Proposta</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Profissional</p>
                  <p className="text-base">{proposta.profissionais?.nome || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  {getStatusBadge(proposta.status)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Valor Proposto</p>
                  <p className="text-base font-semibold text-green-600">
                    {proposta.valor_proposto 
                      ? `R$ ${parseFloat(proposta.valor_proposto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
                      : 'Não informado'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Prazo Estimado</p>
                  <p className="text-base">{proposta.prazo_estimado || 'Não informado'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Materiais</p>
                  <Badge variant={proposta.materiais_inclusos ? 'default' : 'secondary'}>
                    {proposta.materiais_inclusos ? 'Inclusos' : 'Não inclusos'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Garantia</p>
                  <p className="text-base">{proposta.garantia || 'Não informado'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Descrição da Proposta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-base whitespace-pre-wrap">
                  {proposta.descricao_proposta || 'Nenhuma descrição fornecida'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações da Solicitação</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm font-medium text-gray-500">Título</p>
                <p className="text-base">{proposta.solicitacoes_orcamento?.titulo || '-'}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <p className="font-medium">Criado em:</p>
              <p>{new Date(proposta.created_at).toLocaleString('pt-BR')}</p>
            </div>
            {proposta.data_expiracao && (
              <div>
                <p className="font-medium">Expira em:</p>
                <p>{new Date(proposta.data_expiracao).toLocaleString('pt-BR')}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}