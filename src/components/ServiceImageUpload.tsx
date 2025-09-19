import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X } from 'lucide-react';
import { useServiceImagesUpload } from '@/hooks/useServiceImagesUpload';

interface ServiceImageUploadProps {
  currentImage?: string;
  userId: string;
  imageNumber: 1 | 2 | 3;
  onImageUpdate: (imageUrl: string) => void;
  onImageRemove: () => void;
}

const ServiceImageUpload = ({ 
  currentImage, 
  userId, 
  imageNumber,
  onImageUpdate,
  onImageRemove
}: ServiceImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadServiceImage, isUploading } = useServiceImagesUpload();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadServiceImage(file, userId, imageNumber);
      onImageUpdate(imageUrl);
    } catch (error) {
      console.error('Erro no upload:', error);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      {currentImage ? (
        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
          <img 
            src={currentImage} 
            alt={`Serviço ${imageNumber}`}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onImageRemove}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="aspect-video rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center">
          <Camera className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 mb-2">Foto do Serviço {imageNumber}</p>
        </div>
      )}
      
      <Button 
        variant="outline" 
        onClick={handleButtonClick}
        disabled={isUploading}
        className="w-full mt-2"
        size="sm"
      >
        {isUploading ? (
          <>
            <Upload className="h-4 w-4 mr-2 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Camera className="h-4 w-4 mr-2" />
            {currentImage ? 'Alterar Foto' : 'Adicionar Foto'}
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

export default ServiceImageUpload;