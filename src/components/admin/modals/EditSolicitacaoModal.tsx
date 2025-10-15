import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useCategoriesData } from "@/hooks/useCategoriesData";

interface EditSolicitacaoModalProps {
  open: boolean;
  onClose: () => void;
  solicitacao: any;
  onUpdate: () => void;
}

export function EditSolicitacaoModal({ open, onClose, solicitacao, onUpdate }: EditSolicitacaoModalProps) {
  const { toast } = useToast();
  const { categories, subcategories } = useCategoriesData();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    endereco: '',
    cidade: '',
    uf: '',
    categoria_id: '',
    subcategoria_id: '',
    urgencia: 'media',
    orcamento_estimado: '',
    max_propostas: 5,
    status: 'ativa',
    nome_cliente: '',
    email_cliente: '',
    whatsapp_cliente: ''
  });

  useEffect(() => {
    if (solicitacao) {
      setFormData({
        titulo: solicitacao.titulo || '',
        descricao: solicitacao.descricao || '',
        endereco: solicitacao.endereco || '',
        cidade: solicitacao.cidade || '',
        uf: solicitacao.uf || '',
        categoria_id: solicitacao.categoria_id || '',
        subcategoria_id: solicitacao.subcategoria_id || '',
        urgencia: solicitacao.urgencia || 'media',
        orcamento_estimado: solicitacao.orcamento_estimado || '',
        max_propostas: solicitacao.max_propostas || 5,
        status: solicitacao.status || 'ativa',
        nome_cliente: solicitacao.nome_cliente || '',
        email_cliente: solicitacao.email_cliente || '',
        whatsapp_cliente: solicitacao.whatsapp_cliente || ''
      });
    }
  }, [solicitacao]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('solicitacoes_orcamento')
        .update(formData)
        .eq('id', solicitacao.id);

      if (error) throw error;

      toast({
        title: "Solicitação atualizada!",
        description: "A solicitação foi atualizada com sucesso.",
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar solicitação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a solicitação.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const ufs = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Solicitação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="descricao">Descrição *</Label>
            <Textarea
              id="descricao"
              rows={4}
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="endereco">Endereço *</Label>
            <Input
              id="endereco"
              value={formData.endereco}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Select 
                value={formData.categoria_id} 
                onValueChange={(val) => setFormData({ ...formData, categoria_id: val, subcategoria_id: '' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="subcategoria">Subcategoria</Label>
              <Select 
                value={formData.subcategoria_id} 
                onValueChange={(val) => setFormData({ ...formData, subcategoria_id: val })}
                disabled={!formData.categoria_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder={!formData.categoria_id ? "Selecione a categoria primeiro" : "Selecione a subcategoria"} />
                </SelectTrigger>
                <SelectContent>
                  {subcategories
                    .filter(sub => sub.category_id === formData.categoria_id)
                    .map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cidade">Cidade *</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="uf">UF *</Label>
              <Select value={formData.uf} onValueChange={(value) => setFormData({ ...formData, uf: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {ufs.map((uf) => (
                    <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="urgencia">Urgência</Label>
              <Select value={formData.urgencia} onValueChange={(value) => setFormData({ ...formData, urgencia: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativa">Ativa</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="finalizada">Finalizada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="max_propostas">Max. Propostas</Label>
              <Input
                id="max_propostas"
                type="number"
                min="1"
                max="20"
                value={formData.max_propostas}
                onChange={(e) => setFormData({ ...formData, max_propostas: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="orcamento_estimado">Orçamento Estimado</Label>
            <Input
              id="orcamento_estimado"
              value={formData.orcamento_estimado}
              onChange={(e) => setFormData({ ...formData, orcamento_estimado: e.target.value })}
              placeholder="Ex: R$ 500 - R$ 1000"
            />
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium">Dados do Cliente</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome_cliente">Nome do Cliente</Label>
                <Input
                  id="nome_cliente"
                  value={formData.nome_cliente}
                  onChange={(e) => setFormData({ ...formData, nome_cliente: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="email_cliente">Email do Cliente</Label>
                <Input
                  id="email_cliente"
                  type="email"
                  value={formData.email_cliente}
                  onChange={(e) => setFormData({ ...formData, email_cliente: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="whatsapp_cliente">WhatsApp do Cliente</Label>
              <Input
                id="whatsapp_cliente"
                value={formData.whatsapp_cliente}
                onChange={(e) => setFormData({ ...formData, whatsapp_cliente: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}