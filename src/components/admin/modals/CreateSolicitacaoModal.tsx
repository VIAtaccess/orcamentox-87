import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useCategoriesData } from "@/hooks/useCategoriesData";

interface CreateSolicitacaoModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateSolicitacaoModal({ open, onClose, onCreated }: CreateSolicitacaoModalProps) {
  const { toast } = useToast();
  const { categories, subcategories } = useCategoriesData();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    nome_cliente: '',
    email_cliente: '',
    whatsapp_cliente: '',
    cidade: '',
    uf: '',
    endereco: '',
    categoria_id: '',
    subcategoria_id: '',
    orcamento_estimado: '',
    urgencia: 'media',
    status: 'ativa'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('solicitacoes_orcamento')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Solicitação criada!",
        description: "Nova solicitação foi criada com sucesso.",
      });

      onCreated();
      onClose();
      setFormData({
        titulo: '',
        descricao: '',
        nome_cliente: '',
        email_cliente: '',
        whatsapp_cliente: '',
        cidade: '',
        uf: '',
        endereco: '',
        categoria_id: '',
        subcategoria_id: '',
        orcamento_estimado: '',
        urgencia: 'media',
        status: 'ativa'
      });
    } catch (error) {
      console.error('Erro ao criar solicitação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a solicitação.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Solicitação</DialogTitle>
          <DialogDescription>Crie uma nova solicitação de orçamento.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="endereco">Endereço</Label>
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

          <div>
            <Label htmlFor="nome_cliente">Nome do Cliente</Label>
            <Input
              id="nome_cliente"
              value={formData.nome_cliente}
              onChange={(e) => setFormData({ ...formData, nome_cliente: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="email_cliente">Email do Cliente</Label>
            <Input
              id="email_cliente"
              type="email"
              value={formData.email_cliente}
              onChange={(e) => setFormData({ ...formData, email_cliente: e.target.value })}
              required
            />
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="uf">UF</Label>
              <Input
                id="uf"
                value={formData.uf}
                onChange={(e) => setFormData({ ...formData, uf: e.target.value })}
                maxLength={2}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="orcamento_estimado">Orçamento Estimado</Label>
            <Input
              id="orcamento_estimado"
              value={formData.orcamento_estimado}
              onChange={(e) => setFormData({ ...formData, orcamento_estimado: e.target.value })}
              placeholder="R$ 1.000 - R$ 5.000"
            />
          </div>

          <div>
            <Label>Urgência</Label>
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
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativa">Ativa</SelectItem>
                <SelectItem value="finalizada">Finalizada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}