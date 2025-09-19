import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useProposalSubmission } from "@/hooks/useProposalSubmission";

interface PropostaModalProps {
  open: boolean;
  onClose: () => void;
  orcamento: any;
  prestadorId: string;
}

const PropostaModal: React.FC<PropostaModalProps> = ({ open, onClose, orcamento, prestadorId }) => {
  const [valorProposto, setValorProposto] = useState("");
  const [prazoEstimado, setPrazoEstimado] = useState("");
  const [descricaoProposta, setDescricaoProposta] = useState("");
  const [materiaisInclusos, setMateriaisInclusos] = useState(false);
  const [garantia, setGarantia] = useState("");

  const { submitProposal, isSubmitting } = useProposalSubmission();

  const resetModal = () => {
    setValorProposto("");
    setPrazoEstimado("");
    setDescricaoProposta("");
    setMateriaisInclusos(false);
    setGarantia("");
  };

  const handleEnviarProposta = async () => {
    if (!orcamento || !prestadorId) return;

    const proposalData = {
      solicitacao_id: orcamento.id,
      prestador_id: prestadorId,
      valor_proposto: valorProposto ? Number(valorProposto.replace(",", ".")) : null,
      prazo_estimado: prazoEstimado || null,
      descricao_proposta: descricaoProposta,
      materiais_inclusos: materiaisInclusos,
      garantia: garantia || null,
    };

    const success = await submitProposal(proposalData);
    if (success) {
      resetModal();
      onClose();
    }
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar Proposta</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Valor Proposto (R$)</Label>
            <Input 
              type="number" 
              min="0" 
              step="0.01" 
              value={valorProposto} 
              onChange={(e) => setValorProposto(e.target.value)}
              placeholder="0,00"
            />
          </div>
          <div>
            <Label>Prazo Estimado</Label>
            <Input 
              placeholder="Ex: 7 dias" 
              value={prazoEstimado} 
              onChange={(e) => setPrazoEstimado(e.target.value)} 
            />
          </div>
          <div>
            <Label>Detalhes da Proposta</Label>
            <Textarea 
              rows={4} 
              value={descricaoProposta} 
              onChange={(e) => setDescricaoProposta(e.target.value)} 
              placeholder="Descreva como realizará o serviço, etapas, condições..."
            />
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
            <Input 
              placeholder="Ex: 90 dias" 
              value={garantia} 
              onChange={(e) => setGarantia(e.target.value)} 
            />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleEnviarProposta} disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Proposta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PropostaModal;