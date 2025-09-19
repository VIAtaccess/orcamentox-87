import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

interface CreatePlanoModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreatePlanoModal({ open, onClose, onCreated }: CreatePlanoModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    valor: '',
    ordem: 1,
    ativo: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('planos')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Plano criado!",
        description: "Novo plano foi criado com sucesso.",
      });

      onCreated();
      onClose();
      setFormData({
        titulo: '',
        descricao: '',
        valor: '',
        ordem: 1,
        ativo: true
      });
    } catch (error) {
      console.error('Erro ao criar plano:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o plano.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Plano</DialogTitle>
          <DialogDescription>Crie um novo plano de assinatura.</DialogDescription>
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
            />
          </div>

          <div>
            <Label htmlFor="valor">Valor</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="ordem">Ordem</Label>
            <Input
              id="ordem"
              type="number"
              value={formData.ordem}
              onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="ativo">Plano Ativo</Label>
            <Switch
              id="ativo"
              checked={formData.ativo}
              onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
            />
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