import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  annexesCount?: number;
}

export const ImageWithFallback = ({ 
  src, 
  alt, 
  className, 
  // fallbackSrc = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
  annexesCount = 0
}: ImageWithFallbackProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // setCurrentSrc(fallbackSrc);
      setIsLoading(false);
    }
  };

  return (
    <div className="aspect-video overflow-hidden rounded-t-lg relative">
      {/* Skeleton de chargement */}
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <div className="text-muted-foreground text-sm">Chargement...</div>
        </div>
      )}
      
      {/* Image */}
      <img
        src={currentSrc}
        alt={alt}
        className={cn(
          "h-full w-full object-cover transition-transform group-hover:scale-105",
          isLoading && "opacity-0",
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {/* Badge pour les images annexes */}
      {annexesCount > 0 && (
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
          +{annexesCount} photo{annexesCount > 1 ? 's' : ''}
        </div>
      )}
      
      {/* Indicateur d'image par défaut */}
      {hasError && (
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          Image par défaut
        </div>
      )}
    </div>
  );
};