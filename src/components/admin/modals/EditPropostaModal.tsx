import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

interface EditPropostaModalProps {
  open: boolean;
  onClose: () => void;
  proposta: any;
  onUpdate: () => void;
}

export function EditPropostaModal({ open, onClose, proposta, onUpdate }: EditPropostaModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    valor_proposto: '',
    prazo_estimado: '',
    descricao_proposta: '',
    materiais_inclusos: false,
    garantia: '',
    status: 'enviada'
  });

  useEffect(() => {
    if (proposta) {
      setFormData({
        valor_proposto: proposta.valor_proposto?.toString() || '',
        prazo_estimado: proposta.prazo_estimado || '',
        descricao_proposta: proposta.descricao_proposta || '',
        materiais_inclusos: proposta.materiais_inclusos || false,
        garantia: proposta.garantia || '',
        status: proposta.status || 'enviada'
      });
    }
  }, [proposta]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        ...formData,
        valor_proposto: formData.valor_proposto ? parseFloat(formData.valor_proposto.replace(',', '.')) : null
      };

      const { error } = await supabase
        .from('propostas')
        .update(updateData)
        .eq('id', proposta.id);

      if (error) throw error;

      toast({
        title: "Proposta atualizada!",
        description: "A proposta foi atualizada com sucesso.",
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar proposta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a proposta.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Proposta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valor_proposto">Valor Proposto (R$)</Label>
              <Input
                id="valor_proposto"
                type="number"
                step="0.01"
                value={formData.valor_proposto}
                onChange={(e) => setFormData({ ...formData, valor_proposto: e.target.value })}
                placeholder="0,00"
              />
            </div>
            
            <div>
              <Label htmlFor="prazo_estimado">Prazo Estimado</Label>
              <Input
                id="prazo_estimado"
                value={formData.prazo_estimado}
                onChange={(e) => setFormData({ ...formData, prazo_estimado: e.target.value })}
                placeholder="Ex: 7 dias"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="descricao_proposta">Descrição da Proposta</Label>
            <Textarea
              id="descricao_proposta"
              rows={4}
              value={formData.descricao_proposta}
              onChange={(e) => setFormData({ ...formData, descricao_proposta: e.target.value })}
              placeholder="Descreva como realizará o serviço..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="garantia">Garantia</Label>
              <Input
                id="garantia"
                value={formData.garantia}
                onChange={(e) => setFormData({ ...formData, garantia: e.target.value })}
                placeholder="Ex: 90 dias"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enviada">Enviada</SelectItem>
                  <SelectItem value="aceita">Aceita</SelectItem>
                  <SelectItem value="rejeitada">Rejeitada</SelectItem>
                  <SelectItem value="expirada">Expirada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="materiais_inclusos">Materiais inclusos?</Label>
            <Switch
              id="materiais_inclusos"
              checked={formData.materiais_inclusos}
              onCheckedChange={(checked) => setFormData({ ...formData, materiais_inclusos: checked })}
            />
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