import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { usePrestadorData } from "@/hooks/usePrestadorData";
import { useBrazilLocations } from "@/hooks/use-brazil-locations";
import { useProposalSubmission } from "@/hooks/useProposalSubmission";
import { Calendar, Filter, MessageSquare, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CategoriaOption { id: string; name: string; slug: string }

const Orcamentos: React.FC = () => {
  // SEO
  useEffect(() => {
    document.title = "Orçamentos | Prestador - Envie Propostas";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Orçamentos disponíveis para sua categoria, estado e cidade. Envie propostas rapidamente.");
    else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = "Orçamentos disponíveis para sua categoria, estado e cidade. Envie propostas rapidamente.";
      document.head.appendChild(m);
    }
    const link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const href = window.location.origin + "/orcamentos";
    if (link) link.href = href; else {
      const l = document.createElement("link");
      l.rel = "canonical"; l.href = href; document.head.appendChild(l);
    }
  }, []);

  const { toast } = useToast();
  const { prestador, user } = usePrestadorData();
  const { states, cities, fetchCities } = useBrazilLocations();
  const navigate = useNavigate();

  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("");
  const [selectedUF, setSelectedUF] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [selectedSolicitacao, setSelectedSolicitacao] = useState<any | null>(null);
  const [valorProposto, setValorProposto] = useState<string>("");
  const [prazoEstimado, setPrazoEstimado] = useState<string>("");
  const [descricaoProposta, setDescricaoProposta] = useState<string>("");
  const [materiaisInclusos, setMateriaisInclusos] = useState<boolean>(false);
  const [garantia, setGarantia] = useState<string>("");

  // Carregar categorias
  const { data: categorias = [] } = useQuery<CategoriaOption[]>({
    queryKey: ["categorias"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("id, name, slug").order("name");
      if (error) return [] as CategoriaOption[];
      return (data as any) || [];
    },
  });

  // Preencher filtros com dados do prestador
  useEffect(() => {
    if (prestador) {
      if (prestador.categoria_slug) setSelectedCategorySlug(prestador.categoria_slug);
      if (prestador.uf) setSelectedUF(prestador.uf);
      if (prestador.cidade) setSelectedCity(prestador.cidade);
    }
  }, [prestador]);

  useEffect(() => {
    if (selectedUF) fetchCities(selectedUF);
  }, [selectedUF, fetchCities]);

  const categoriaIdSelecionada = useMemo(() => {
    if (!selectedCategorySlug) return null;
    const c = categorias.find((c) => c.slug === selectedCategorySlug);
    return c?.id || null;
  }, [categorias, selectedCategorySlug]);

  // Buscar orçamentos conforme filtros
  const { data: orcamentos = [], isLoading } = useQuery<any[]>({
    queryKey: ["orcamentos-lista", categoriaIdSelecionada, selectedUF, selectedCity, searchTerm],
    queryFn: async () => {
      if (!categoriaIdSelecionada || !selectedUF || !selectedCity) return [];
      let query = supabase
        .from("solicitacoes_orcamento")
        .select("*")
        .eq("categoria_id", categoriaIdSelecionada)
        .eq("uf", selectedUF)
        .eq("cidade", selectedCity)
        .order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) return [];

      // Filtro de busca simples no cliente
      let filtered = data || [];
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter((o: any) =>
          o.titulo.toLowerCase().includes(term) || o.descricao.toLowerCase().includes(term)
        );
      }
      return filtered;
    },
    enabled: !!categoriaIdSelecionada && !!selectedUF && !!selectedCity,
  });

  const resetModal = () => {
    setValorProposto("");
    setPrazoEstimado("");
    setDescricaoProposta("");
    setMateriaisInclusos(false);
    setGarantia("");
  };

  const { submitProposal, isSubmitting } = useProposalSubmission();

  const handleEnviarProposta = async () => {
    if (!user || !selectedSolicitacao) return;
    
    const proposalData = {
      solicitacao_id: selectedSolicitacao.id,
      prestador_id: user.id,
      valor_proposto: valorProposto ? Number(valorProposto.replace(",", ".")) : undefined,
      prazo_estimado: prazoEstimado || undefined,
      descricao_proposta: descricaoProposta,
      materiais_inclusos: materiaisInclusos,
      garantia: garantia || undefined,
    };

    try {
      await submitProposal(proposalData);
      setSelectedSolicitacao(null);
      resetModal();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6 flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orçamentos</h1>
            <p className="text-gray-600 mt-1">Filtre e envie propostas para orçamentos da sua categoria e região</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Filter className="h-5 w-5 mr-2" />Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Categoria</Label>
                <Select value={selectedCategorySlug} onValueChange={setSelectedCategorySlug}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((c) => (
                      <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Estado (UF)</Label>
                <Select value={selectedUF} onValueChange={setSelectedUF}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="UF" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((s) => (
                      <SelectItem key={s.sigla} value={s.sigla}>{s.sigla} - {s.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Cidade</Label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c.id} value={c.nome}>{c.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Busca</Label>
                <Input className="mt-1" placeholder="Palavra-chave" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><MessageSquare className="h-5 w-5 mr-2" />Orçamentos disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-gray-500">Carregando...</div>
            ) : orcamentos.length === 0 ? (
              <div className="text-center py-10 text-gray-500">Nenhum orçamento encontrado para os filtros selecionados.</div>
            ) : (
              <div className="space-y-4">
                {orcamentos.map((o: any) => (
                  <div key={o.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-bold text-gray-900">{o.titulo}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            o.urgencia === 'alta' ? 'bg-red-100 text-red-700' :
                            o.urgencia === 'media' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {o.urgencia === 'alta' ? 'Urgente' : o.urgencia === 'media' ? 'Moderado' : 'Baixa Prioridade'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2 line-clamp-2">{o.descricao}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(o.created_at).toLocaleDateString('pt-BR')}
                          </span>
                          <span>{o.cidade} - {o.uf}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button onClick={() => setSelectedSolicitacao(o)}>Enviar Proposta</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal Enviar Proposta */}
      <Dialog open={!!selectedSolicitacao} onOpenChange={(open) => { if (!open) { setSelectedSolicitacao(null); resetModal(); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Proposta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Valor Proposto (R$)</Label>
              <Input type="number" min="0" step="0.01" value={valorProposto} onChange={(e) => setValorProposto(e.target.value)} />
            </div>
            <div>
              <Label>Prazo Estimado</Label>
              <Input placeholder="Ex: 7 dias" value={prazoEstimado} onChange={(e) => setPrazoEstimado(e.target.value)} />
            </div>
            <div>
              <Label>Detalhes da Proposta</Label>
              <Textarea rows={5} value={descricaoProposta} onChange={(e) => setDescricaoProposta(e.target.value)} placeholder="Descreva como realizará o serviço, etapas, condições..." />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Materiais inclusos?</Label>
                <p className="text-xs text-gray-500">Marque caso você forneça os materiais</p>
              </div>
              <Switch checked={materiaisInclusos} onCheckedChange={setMateriaisInclusos} />
            </div>
            <div>
              <Label>Garantia</Label>
              <Input placeholder="Ex: 90 dias" value={garantia} onChange={(e) => setGarantia(e.target.value)} />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => { setSelectedSolicitacao(null); resetModal(); }}>Cancelar</Button>
            <Button onClick={handleEnviarProposta} disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Proposta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orcamentos;
