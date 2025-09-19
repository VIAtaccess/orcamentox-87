import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

interface CreateProfissionalModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateProfissionalModal({ open, onClose, onCreated }: CreateProfissionalModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    categoria: '',
    cidade: '',
    uf: '',
    descricao: '',
    ativo: true,
    verificado: false,
    admin: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profissionais')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Profissional criado!",
        description: "Novo profissional foi criado com sucesso.",
      });

      onCreated();
      onClose();
      setFormData({
        nome: '',
        email: '',
        whatsapp: '',
        categoria: '',
        cidade: '',
        uf: '',
        descricao: '',
        ativo: true,
        verificado: false,
        admin: false
      });
    } catch (error) {
      console.error('Erro ao criar profissional:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o profissional.",
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
          <DialogTitle>Novo Profissional</DialogTitle>
          <DialogDescription>Cadastre um novo profissional na plataforma.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <Label htmlFor="categoria">Categoria</Label>
            <Input
              id="categoria"
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="uf">UF</Label>
              <Input
                id="uf"
                value={formData.uf}
                onChange={(e) => setFormData({ ...formData, uf: e.target.value })}
                maxLength={2}
              />
            </div>
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

          <div className="flex items-center justify-between">
            <Label htmlFor="ativo">Profissional Ativo</Label>
            <Switch
              id="ativo"
              checked={formData.ativo}
              onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="verificado">Verificado</Label>
            <Switch
              id="verificado"
              checked={formData.verificado}
              onCheckedChange={(checked) => setFormData({ ...formData, verificado: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="admin">Administrador</Label>
            <Switch
              id="admin"
              checked={formData.admin}
              onCheckedChange={(checked) => setFormData({ ...formData, admin: checked })}
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