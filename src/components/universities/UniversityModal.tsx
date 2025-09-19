import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface University {
  id?: number;
  name: string;
  slug: string;
  location: string;
  description: string;
  status: 'active' | 'draft';
  photos?: string[];
}

interface UniversityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  university?: University;
  mode: 'create' | 'edit' | 'view';
  onSave: (university: University) => void;
}

export const UniversityModal = ({ 
  open, 
  onOpenChange, 
  university, 
  mode, 
  onSave 
}: UniversityModalProps) => {
  const isReadOnly = mode === 'view';
  const isEdit = mode === 'edit';

  const form = useForm<University>({
    defaultValues: {
      name: '',
      slug: '',
      location: '',
      description: '',
      status: 'draft',
      photos: []
    }
  });

  useEffect(() => {
    if (university && open) {
      form.reset(university);
    } else if (!university && open) {
      form.reset({
        name: '',
        slug: '',
        location: '',
        description: '',
        status: 'draft',
        photos: []
      });
    }
  }, [university, open, form]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const onSubmit = (data: University) => {
    const universityData = {
      ...data,
      slug: generateSlug(data.name),
      id: university?.id
    };
    
    onSave(universityData);
    onOpenChange(false);
    toast.success(isEdit ? 'Université modifiée avec succès' : 'Université créée avec succès');
  };

  const getTitle = () => {
    switch (mode) {
      case 'create': return 'Nouvelle Université';
      case 'edit': return 'Modifier l\'Université';
      case 'view': return 'Détails de l\'Université';
      default: return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {mode === 'view' 
              ? 'Consultez les informations de cette université'
              : isEdit 
                ? 'Modifiez les informations de cette université'
                : 'Remplissez les informations pour créer une nouvelle université'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'université</Label>
              <Input
                id="name"
                {...form.register('name', { required: !isReadOnly })}
                placeholder="ex: Université Paris Tech"
                disabled={isReadOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                {...form.register('location', { required: !isReadOnly })}
                placeholder="ex: Paris, France"
                disabled={isReadOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Décrivez l'université..."
                rows={3}
                disabled={isReadOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={form.watch('status')} 
                onValueChange={(value) => form.setValue('status', value as 'active' | 'draft')}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {isReadOnly ? 'Fermer' : 'Annuler'}
            </Button>
            {!isReadOnly && (
              <Button type="submit" className="bg-gradient-primary hover:opacity-90">
                {isEdit ? 'Enregistrer' : 'Créer'}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};