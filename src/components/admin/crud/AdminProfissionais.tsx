import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, Download, Filter, Edit, Trash2, Star, CheckCircle } from 'lucide-react';
import { CreateProfissionalModal } from "../modals/CreateProfissionalModal";
import { EditProfissionalModal } from "@/components/admin/modals/EditProfissionalModal";
import { useToast } from "@/hooks/use-toast";

export function AdminProfissionais() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProfissional, setSelectedProfissional] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const itemsPerPage = 10;

  const { data: profissionais, isLoading, refetch } = useQuery({
    queryKey: ["admin-profissionais", searchQuery, currentPage],
    queryFn: async () => {
      let query = supabase
        .from("profissionais")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`nome.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,categoria.ilike.%${searchQuery}%`);
      }

      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error, count } = await query.range(from, to);
      
      if (error) throw error;
      
      return { data, count };
    }
  });

  const exportData = () => {
    if (profissionais?.data) {
      const csv = [
        Object.keys(profissionais.data[0]),
        ...profissionais.data.map(prof => Object.values(prof))
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'profissionais.csv';
      a.click();
    }
  };

  const handleEdit = (profissional: any) => {
    setSelectedProfissional(profissional);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este profissional?')) {
      try {
        const { error } = await supabase
          .from('profissionais')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Profissional excluído!",
          description: "O profissional foi excluído com sucesso.",
        });

        refetch();
      } catch (error) {
        console.error('Erro ao excluir profissional:', error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir o profissional.",
          variant: "destructive",
        });
      }
    }
  };

  const totalPages = Math.ceil((profissionais?.count || 0) / itemsPerPage);

  if (isLoading) {
    return <div className="p-6">Carregando profissionais...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Profissionais</h1>
          <p className="text-gray-600">Gerencie todos os profissionais cadastrados na plataforma</p>
        </div>
        <Button className="gap-2" onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Novo Profissional
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Ações</CardTitle>
          <CardDescription>Use os filtros para encontrar profissionais específicos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, email ou categoria..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
            <Button variant="outline" onClick={exportData} className="gap-2">
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Profissionais ({profissionais?.count || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Profissional</TableHead>
                  <TableHead className="min-w-[120px]">Categoria</TableHead>
                  <TableHead className="min-w-[100px]">Localização</TableHead>
                  <TableHead className="min-w-[80px]">Avaliação</TableHead>
                  <TableHead className="min-w-[80px]">Status</TableHead>
                  <TableHead className="min-w-[80px]">Verificado</TableHead>
                  <TableHead className="min-w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profissionais?.data?.map((profissional: any) => (
                  <TableRow key={profissional.id}>
                    <TableCell className="min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={profissional.foto_url} />
                          <AvatarFallback>{profissional.nome.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{profissional.nome}</div>
                          <div className="text-sm text-gray-500 truncate">{profissional.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[120px]">
                      <Badge variant="outline" className="truncate">{profissional.categoria || 'N/D'}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[100px] truncate">{`${profissional.cidade || '-'}/${profissional.uf || '-'}`}</TableCell>
                    <TableCell className="min-w-[80px]">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{Number(profissional.nota_media || 0).toFixed(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={profissional.ativo ? 'default' : 'destructive'}>
                        {profissional.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {profissional.verificado ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Badge variant="secondary">Pendente</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(profissional)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(profissional.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4">
                Página {currentPage} de {totalPages}
              </span>
              <Button 
                variant="outline" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateProfissionalModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={() => {
          refetch();
          setCreateModalOpen(false);
        }}
      />

      <EditProfissionalModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        profissional={selectedProfissional}
        onUpdate={() => {
          refetch();
          setEditModalOpen(false);
        }}
      />
    </div>
  );
}