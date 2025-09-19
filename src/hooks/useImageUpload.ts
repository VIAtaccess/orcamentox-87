
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File, userId: string, folder: 'clientes' | 'profissionais') => {
    setIsUploading(true);
    try {
      // Validar arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Por favor, selecione apenas arquivos de imagem.');
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        throw new Error('A imagem deve ter no máximo 5MB.');
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/profile.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload do arquivo
      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });

      if (error) throw error;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: error instanceof Error ? error.message : "Não foi possível fazer upload da imagem.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading };
};
