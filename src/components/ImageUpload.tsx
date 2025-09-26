
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { supabase } from '@/integrations/supabase/client';

interface ImageUploadProps {
  currentImage?: string;
  userName: string;
  userId: string;
  userType: 'clientes' | 'profissionais';
  onImageUpdate: (imageUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

const ImageUpload = ({ 
  currentImage, 
  userName, 
  userId, 
  userType, 
  onImageUpdate,
  size = 'lg'
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, isUploading } = useImageUpload();

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Buscar email do usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        throw new Error('Usuário não encontrado');
      }
      
      const imageUrl = await uploadImage(file, user.email, userType);
      onImageUpdate(imageUrl);
    } catch (error) {
      console.error('Erro no upload:', error);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={currentImage} />
        <AvatarFallback className="text-2xl">
          {userName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <Button 
        variant="outline" 
        onClick={handleButtonClick}
        disabled={isUploading}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Upload className="h-4 w-4 mr-2 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Camera className="h-4 w-4 mr-2" />
            Alterar Foto
          </>
        )}
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
