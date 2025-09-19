import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePrestadorData } from "@/hooks/usePrestadorData";
import { ArrowLeft, Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Avaliacoes: React.FC = () => {
  // SEO
  useEffect(() => {
    document.title = "Avaliações | Prestador - Feedback de clientes";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Veja as avaliações recebidas dos seus clientes e acompanhe seu desempenho.");
    else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = "Veja as avaliações recebidas dos seus clientes e acompanhe seu desempenho.";
      document.head.appendChild(m);
    }
    const link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const href = window.location.origin + "/avaliacoes";
    if (link) link.href = href; else {
      const l = document.createElement("link");
      l.rel = "canonical"; l.href = href; document.head.appendChild(l);
    }
  }, []);

  const navigate = useNavigate();
  const { user } = usePrestadorData();
  const [notaMinima, setNotaMinima] = useState<string>("");

  const { data: avaliacoes = [], isLoading } = useQuery<any[]>({
    queryKey: ["avaliacoes-prestador", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("avaliacoes")
        .select(`
          *,
          solicitacao:solicitacoes_orcamento(*),
          cliente:clientes(*)
        `)
        .eq("prestador_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar avaliações:", error);
        return [];
      }
      return data || [];
    },
    enabled: !!user?.id,
  });

  const filtered = useMemo(() => {
    if (!notaMinima || notaMinima === "all") return avaliacoes;
    const min = Number(notaMinima);
    return (avaliacoes || []).filter((a: any) => a.nota >= min);
  }, [avaliacoes, notaMinima]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6 flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Avaliações</h1>
            <p className="text-gray-600 mt-1">Acompanhe o que seus clientes dizem sobre você</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Nota mínima</Label>
                <Select value={notaMinima} onValueChange={setNotaMinima}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="5">5 estrelas</SelectItem>
                    <SelectItem value="4">4+ estrelas</SelectItem>
                    <SelectItem value="3">3+ estrelas</SelectItem>
                    <SelectItem value="2">2+ estrelas</SelectItem>
                    <SelectItem value="1">1+ estrela</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avaliações recebidas</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-gray-500">Carregando...</div>
            ) : (filtered || []).length === 0 ? (
              <div className="text-center py-10 text-gray-500">Nenhuma avaliação encontrada.</div>
            ) : (
              <div className="space-y-4">
                {filtered.map((a: any) => (
                  <div key={a.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          {[1,2,3,4,5].map((i) => (
                            <Star key={i} className="h-5 w-5 mr-1 text-yellow-500" fill={i <= a.nota ? "currentColor" : "none"} />
                          ))}
                        </div>
                        {a.comentario && (
                          <p className="text-gray-700 mb-3">{a.comentario}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" /> {new Date(a.created_at).toLocaleDateString('pt-BR')}
                          </span>
                          {a.solicitacao?.titulo && (
                            <span>Solicitação: <strong className="text-gray-900">{a.solicitacao.titulo}</strong></span>
                          )}
                          {a.solicitacao?.cidade && a.solicitacao?.uf && (
                            <span>{a.solicitacao.cidade} - {a.solicitacao.uf}</span>
                          )}
                          {a.cliente?.nome && (
                            <span>Cliente: <strong className="text-gray-900">{a.cliente.nome}</strong></span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Avaliacoes;
