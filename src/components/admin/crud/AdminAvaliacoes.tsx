import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Filter, Edit, Trash2, Star } from 'lucide-react';
import { EditAvaliacaoModal } from "@/components/admin/modals/EditAvaliacaoModal";
import { useToast } from "@/hooks/use-toast";

export function AdminAvaliacoes() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAvaliacao, setSelectedAvaliacao] = useState(null);
  const itemsPerPage = 10;

  const { data: avaliacoes, isLoading, refetch } = useQuery({
    queryKey: ["admin-avaliacoes", searchQuery, currentPage],
    queryFn: async () => {
      let query = supabase
        .from("avaliacoes")
        .select(`
          *,
          profissionais!inner (
            nome
          )
        `)
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`comentario.ilike.%${searchQuery}%`);
      }

      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error, count } = await query.range(from, to);
      
      if (error) throw error;
      
      return { data, count };
    }
  });

  const exportData = () => {
    if (avaliacoes?.data) {
      const csv = [
        ['id', 'cliente_id', 'profissional', 'nota', 'comentario', 'recomenda', 'criacao'],
        ...avaliacoes.data.map(avaliacao => [
          avaliacao.id,
          avaliacao.cliente_id,
          (avaliacao as any).profissionais?.nome,
          avaliacao.nota,
          avaliacao.comentario,
          avaliacao.recomenda,
          avaliacao.created_at
        ])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'avaliacoes.csv';
      a.click();
    }
  };

  const renderStars = (nota: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`h-4 w-4 ${star <= nota ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const handleEdit = (avaliacao: any) => {
    setSelectedAvaliacao(avaliacao);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta avaliação?')) {
      try {
        const { error } = await supabase
          .from('avaliacoes')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Avaliação excluída!",
          description: "A avaliação foi excluída com sucesso.",
        });

        refetch();
      } catch (error) {
        console.error('Erro ao excluir avaliação:', error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir a avaliação.",
          variant: "destructive",
        });
      }
    }
  };

  const totalPages = Math.ceil((avaliacoes?.count || 0) / itemsPerPage);

  if (isLoading) {
    return <div className="p-6">Carregando avaliações...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Avaliações</h1>
          <p className="text-gray-600">Gerencie todos os feedbacks dos clientes</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Ações</CardTitle>
          <CardDescription>Use os filtros para encontrar avaliações específicas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por comentário..."
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
          <CardTitle>Lista de Avaliações ({avaliacoes?.count || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Profissional</TableHead>
                <TableHead>Nota</TableHead>
                <TableHead>Comentário</TableHead>
                <TableHead>Recomenda</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {avaliacoes?.data?.map((avaliacao: any) => (
                <TableRow key={avaliacao.id}>
                  <TableCell className="font-medium">
                    Cliente {avaliacao.cliente_id ? `(ID: ${avaliacao.cliente_id})` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {avaliacao.profissionais?.nome || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {renderStars(avaliacao.nota)}
                      <span className="text-sm font-medium">({avaliacao.nota})</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={avaliacao.comentario}>
                      {avaliacao.comentario || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={avaliacao.recomenda ? 'default' : 'destructive'}>
                      {avaliacao.recomenda ? 'Sim' : 'Não'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(avaliacao.created_at).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(avaliacao)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(avaliacao.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
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

      <EditAvaliacaoModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        avaliacao={selectedAvaliacao}
        onUpdate={() => {
          refetch();
          setEditModalOpen(false);
        }}
      />
    </div>
  );
}