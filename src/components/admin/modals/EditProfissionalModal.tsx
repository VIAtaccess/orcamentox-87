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

interface EditProfissionalModalProps {
  open: boolean;
  onClose: () => void;
  profissional: any;
  onUpdate: () => void;
}

export function EditProfissionalModal({ open, onClose, profissional, onUpdate }: EditProfissionalModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    categoria: '',
    especialidade: '',
    descricao: '',
    experiencia_anos: 0,
    cidade: '',
    uf: '',
    ativo: true,
    verificado: false,
    admin: false
  });

  useEffect(() => {
    if (profissional) {
      setFormData({
        nome: profissional.nome || '',
        email: profissional.email || '',
        whatsapp: profissional.whatsapp || '',
        categoria: profissional.categoria || '',
        especialidade: profissional.especialidade || '',
        descricao: profissional.descricao || '',
        experiencia_anos: profissional.experiencia_anos || 0,
        cidade: profissional.cidade || '',
        uf: profissional.uf || '',
        ativo: profissional.ativo ?? true,
        verificado: profissional.verificado ?? false,
        admin: profissional.admin ?? false
      });
    }
  }, [profissional]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profissionais')
        .update(formData)
        .eq('id', profissional.id);

      if (error) throw error;

      toast({
        title: "Profissional atualizado!",
        description: "Os dados do profissional foram atualizados com sucesso.",
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar profissional:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o profissional.",
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
          <DialogTitle>Editar Profissional</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                placeholder="Ex: Pedreiro, Eletricista..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="especialidade">Especialidade</Label>
            <Input
              id="especialidade"
              value={formData.especialidade}
              onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
              placeholder="Área de especialização"
            />
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              rows={4}
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descrição do profissional..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="experiencia">Anos de Experiência</Label>
              <Input
                id="experiencia"
                type="number"
                min="0"
                value={formData.experiencia_anos}
                onChange={(e) => setFormData({ ...formData, experiencia_anos: parseInt(e.target.value) })}
              />
            </div>
            
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

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label htmlFor="ativo">Profissional ativo?</Label>
              <Switch
                id="ativo"
                checked={formData.ativo}
                onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="verificado">Perfil verificado?</Label>
              <Switch
                id="verificado"
                checked={formData.verificado}
                onCheckedChange={(checked) => setFormData({ ...formData, verificado: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="admin">Permissão de administrador?</Label>
              <Switch
                id="admin"
                checked={formData.admin}
                onCheckedChange={(checked) => setFormData({ ...formData, admin: checked })}
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