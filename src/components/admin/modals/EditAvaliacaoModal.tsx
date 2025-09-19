import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

interface EditAvaliacaoModalProps {
  open: boolean;
  onClose: () => void;
  avaliacao: any;
  onUpdate: () => void;
}

export function EditAvaliacaoModal({ open, onClose, avaliacao, onUpdate }: EditAvaliacaoModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nota: 5,
    comentario: '',
    recomenda: true
  });

  useEffect(() => {
    if (avaliacao) {
      setFormData({
        nota: avaliacao.nota || 5,
        comentario: avaliacao.comentario || '',
        recomenda: avaliacao.recomenda ?? true
      });
    }
  }, [avaliacao]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('avaliacoes')
        .update(formData)
        .eq('id', avaliacao.id);

      if (error) throw error;

      toast({
        title: "Avaliação atualizada!",
        description: "A avaliação foi atualizada com sucesso.",
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar avaliação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a avaliação.",
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
          <DialogTitle>Editar Avaliação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nota">Nota (1-5)</Label>
            <Input
              id="nota"
              type="number"
              min="1"
              max="5"
              value={formData.nota}
              onChange={(e) => setFormData({ ...formData, nota: parseInt(e.target.value) })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="comentario">Comentário</Label>
            <Textarea
              id="comentario"
              rows={4}
              value={formData.comentario}
              onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
              placeholder="Comentário da avaliação..."
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="recomenda">Recomenda o profissional?</Label>
            <Switch
              id="recomenda"
              checked={formData.recomenda}
              onCheckedChange={(checked) => setFormData({ ...formData, recomenda: checked })}
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