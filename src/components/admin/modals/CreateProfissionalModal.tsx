import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useCategoriesData } from "@/hooks/useCategoriesData";

interface CreateProfissionalModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateProfissionalModal({ open, onClose, onCreated }: CreateProfissionalModalProps) {
  const { toast } = useToast();
  const { categories, subcategories } = useCategoriesData();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    categoria_slug: '',
    subcategoria_slug: '',
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
        categoria_slug: '',
        subcategoria_slug: '',
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Profissional</DialogTitle>
          <DialogDescription>Cadastre um novo profissional na plataforma.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="categoria">Categoria *</Label>
                <Select 
                  value={formData.categoria_slug} 
                  onValueChange={(val) => setFormData({ ...formData, categoria_slug: val, subcategoria_slug: '' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subcategoria">Subcategoria</Label>
                <Select 
                  value={formData.subcategoria_slug} 
                  onValueChange={(val) => setFormData({ ...formData, subcategoria_slug: val })}
                  disabled={!formData.categoria_slug}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={!formData.categoria_slug ? "Selecione a categoria primeiro" : "Selecione a subcategoria"} />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories
                      .filter(sub => {
                        const category = categories.find(c => c.slug === formData.categoria_slug);
                        return category && sub.category_id === category.id;
                      })
                      .map((sub) => (
                        <SelectItem key={sub.id} value={sub.slug}>{sub.name}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Localização */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Localização</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="SP"
                />
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Descrição</h3>
            <div>
              <Label htmlFor="descricao">Descrição Profissional</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={3}
                placeholder="Descreva a experiência e especialidades do profissional..."
              />
            </div>
          </div>

          {/* Configurações */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Configurações</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="ativo">Ativo</Label>
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
                <Label htmlFor="admin">Admin</Label>
                <Switch
                  id="admin"
                  checked={formData.admin}
                  onCheckedChange={(checked) => setFormData({ ...formData, admin: checked })}
                />
              </div>
            </div>
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