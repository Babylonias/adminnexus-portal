import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  label: string;
  value?: File | File[] | string | string[];
  onChange: (files: File | File[] | null) => void;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  accept?: string;
  maxFiles?: number;
}

export const ImageUpload = ({
  label,
  value,
  onChange,
  multiple = false,
  disabled = false,
  className,
  accept = "image/*",
  maxFiles = 5
}: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Convertir la valeur en tableau pour un traitement uniforme
  const getFiles = (): (File | string)[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return [value];
  };

  const files = getFiles();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;

    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles: File[]) => {
    if (newFiles.length === 0) return;

    // Filtrer les fichiers image
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('Veuillez sélectionner des fichiers image valides.');
      return;
    }

    if (multiple) {
      const currentFiles = files.filter((f): f is File => f instanceof File);
      const totalFiles = currentFiles.length + imageFiles.length;
      
      if (totalFiles > maxFiles) {
        alert(`Vous ne pouvez télécharger que ${maxFiles} images maximum.`);
        return;
      }
      
      onChange([...currentFiles, ...imageFiles]);
    } else {
      onChange(imageFiles[0]);
    }
  };

  const removeFile = (index: number) => {
    if (disabled) return;

    if (multiple) {
      const currentFiles = files.filter((f): f is File => f instanceof File);
      const newFiles = currentFiles.filter((_, i) => i !== index);
      onChange(newFiles.length > 0 ? newFiles : null);
    } else {
      onChange(null);
    }
  };

  const openFileDialog = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const getImageUrl = (file: File | string): string => {
    if (typeof file === 'string') return file;
    return URL.createObjectURL(file);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      
      {/* Zone de drop */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary/50",
          files.length > 0 && multiple ? "mb-4" : ""
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              {multiple ? 'Glissez vos images ici ou cliquez pour sélectionner' : 'Glissez votre image ici ou cliquez pour sélectionner'}
            </p>
            <p className="text-xs text-muted-foreground">
              {multiple ? `PNG, JPG, WEBP jusqu'à ${maxFiles} fichiers` : 'PNG, JPG, WEBP'}
            </p>
          </div>
        </div>
      </div>

      {/* Prévisualisation des images */}
      {files.length > 0 && (
        <div className={cn(
          "grid gap-4",
          multiple ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1"
        )}>
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted border">
                <img
                  src={getImageUrl(file)}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {!disabled && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black/50 text-white text-xs px-2 py-1 rounded truncate">
                  {typeof file === 'string' ? 'Image existante' : file.name}
                </div>
              </div>
            </div>
          ))}
          
          {/* Bouton d'ajout pour les images multiples */}
          {multiple && files.length < maxFiles && !disabled && (
            <div
              className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={openFileDialog}
            >
              <div className="text-center">
                <Plus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Ajouter une image</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Informations sur les fichiers sélectionnés */}
      {files.length > 0 && multiple && (
        <p className="text-xs text-muted-foreground">
          {files.length} image{files.length > 1 ? 's' : ''} sélectionnée{files.length > 1 ? 's' : ''} 
          {maxFiles && ` (max ${maxFiles})`}
        </p>
      )}
    </div>
  );
};