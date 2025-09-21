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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { LocationSelector } from "@/components/shared/LocationSelector";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { useUniversities } from "@/hooks/use-universities";
import { apiService } from "@/services/api";
import { toast } from "sonner";

interface Amphitheater {
  id?: string; // UUID
  name: string;
  slug: string;
  university: string;
  universityId: string; // UUID
  location: string;
  capacity: number;
  equipment: string[];
  status: 'active' | 'maintenance' | 'draft';
  description: string;
  // Coordonnées de localisation
  lat?: number;
  lng?: number;
  address?: string;
  // Images
  mainImage?: File | string;
  annexes?: File[] | string[];
}

interface AmphitheaterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amphitheater?: Amphitheater;
  mode: 'create' | 'edit' | 'view';
  onSave: (amphitheater: Amphitheater) => void;
}

// Les universités sont maintenant récupérées via le hook useUniversities

export const AmphitheaterModal = ({
  open,
  onOpenChange,
  amphitheater,
  mode,
  onSave
}: AmphitheaterModalProps) => {
  const isReadOnly = mode === 'view';
  const isEdit = mode === 'edit';
  const [newEquipment, setNewEquipment] = useState("");
  const { universities, loading: universitiesLoading, error: universitiesError } = useUniversities();

  // Debug
  console.log('Universities in modal:', universities, 'Loading:', universitiesLoading, 'Error:', universitiesError);

  const form = useForm<Amphitheater>({
    defaultValues: {
      name: '',
      slug: '',
      university: '',
      universityId: '',
      location: '',
      capacity: 0,
      equipment: [],
      status: 'draft',
      description: '',
      lat: undefined,
      lng: undefined,
      address: '',
      mainImage: undefined,
      annexes: []
    }
  });

  const watchedEquipment = form.watch('equipment') || [];

  useEffect(() => {
    if (amphitheater && open) {
      console.log('Modal received amphitheater data:', amphitheater); // Debug
      form.reset(amphitheater);
    } else if (!amphitheater && open) {
      form.reset({
        name: '',
        slug: '',
        university: '',
        universityId: '',
        location: '',
        capacity: 0,
        equipment: [],
        status: 'draft',
        description: '',
        lat: undefined,
        lng: undefined,
        address: '',
        mainImage: undefined,
        annexes: []
      });
    }
  }, [amphitheater, open, form]);

  // const generateSlug = (name: string) => {
  //   return name
  //     .toLowerCase()
  //     .normalize('NFD')
  //     .replace(/[\u0300-\u036f]/g, '')
  //     .replace(/[^a-z0-9\s-]/g, '')
  //     .replace(/\s+/g, '-')
  //     .replace(/-+/g, '-')
  //     .replace(/^-+|-+$/g, '') // Supprimer les tirets en début et fin
  //     .trim();
  // };

  const validateSlug = (slug: string) => {
    return true;
  };

  const addEquipment = () => {
    if (newEquipment.trim()) {
      const currentEquipment = form.getValues('equipment') || [];
      form.setValue('equipment', [...currentEquipment, newEquipment.trim()]);
      setNewEquipment("");
    }
  };

  const removeEquipment = (index: number) => {
    const currentEquipment = form.getValues('equipment') || [];
    form.setValue('equipment', currentEquipment.filter((_, i) => i !== index));
  };

  const onUniversityChange = (universityId: string) => {
    const university = universities.find(u => u.id === universityId);
    if (university) {
      form.setValue('universityId', university.id);
      form.setValue('university', university.name);
    }
  };

  const onSubmit = async (data: Amphitheater) => {
    try {
      console.log('Form data received:', data); // Debug

      // Préparer les données pour l'API backend
      const formData = new FormData();

      // Champs obligatoires
      formData.append('name', data.name || '');
      formData.append('slug', data.slug || '');

      // Ajouter les coordonnées (lng/lat comme attendu par le backend)
      if (data.lng !== undefined && data.lng !== null) {
        formData.append('lng', data.lng.toString());
      }
      if (data.lat !== undefined && data.lat !== null) {
        formData.append('lat', data.lat.toString());
      }

      // Ajouter l'université
      if (data.universityId) {
        formData.append('university_id', data.universityId);
      }

      // Ajouter les autres champs optionnels
      if (data.description) {
        formData.append('description', data.description);
      }
      if (data.capacity) {
        formData.append('capacity', data.capacity.toString());
      }
      if (data.status) {
        formData.append('status', data.status);
      }
      if (data.location) {
        formData.append('location', data.location);
      }

      // Ajouter les équipements
      if (data.equipment && data.equipment.length > 0) {
        data.equipment.forEach((item, index) => {
          formData.append(`equipment[${index}]`, item);
        });
      }

      // Ajouter l'image principale si elle existe
      if (data.mainImage && data.mainImage instanceof File) {
        formData.append('main_image', data.mainImage);
      }

      // Ajouter les images annexes si elles existent
      if (data.annexes && Array.isArray(data.annexes)) {
        data.annexes.forEach((file, index) => {
          if (file instanceof File) {
            formData.append(`annexes[${index}]`, file);
          }
        });
      }

      // Debug: Afficher le contenu du FormData
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      let result;
      if (isEdit && amphitheater?.id) {
        result = await apiService.updateAmphitheater(amphitheater.id, formData);
      } else {
        result = await apiService.createAmphitheater(formData);
      }

      // Pour l'instant, on continue à utiliser la fonction onSave locale
      // jusqu'à ce que la liste soit aussi connectée au backend
      const amphitheaterData = {
        ...data,
        slug: data.slug,
        id: amphitheater?.id || result?.data?.id
      };

      onSave(amphitheaterData);
      onOpenChange(false);
      toast.success(isEdit ? 'Amphithéâtre modifié avec succès' : 'Amphithéâtre créé avec succès');
    } catch (error) {
      console.error('Error saving amphitheater:', error);
      toast.error('Erreur lors de la sauvegarde de l\'amphithéâtre');
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'create': return 'Nouvel Amphithéâtre';
      case 'edit': return 'Modifier l\'Amphithéâtre';
      case 'view': return 'Détails de l\'Amphithéâtre';
      default: return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {mode === 'view'
              ? 'Consultez les informations de cet amphithéâtre'
              : isEdit
                ? 'Modifiez les informations de cet amphithéâtre'
                : 'Remplissez les informations pour créer un nouvel amphithéâtre'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'amphithéâtre</Label>
              <Input
                id="name"
                {...form.register('name', {
                  required: !isReadOnly,
                })}
                placeholder="ex: Amphi Sciences 200"
                disabled={isReadOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  {...form.register('slug', {
                    required: !isReadOnly ? 'Le slug est requis' : false,
                    validate: !isReadOnly ? validateSlug : undefined
                  })}
                  placeholder="ex: amphi-sciences-200"
                  disabled={isReadOnly}
                  className="flex-1"
                />
              </div>
              {form.formState.errors.slug && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.slug.message}
                </p>
              )}
              {!isReadOnly && (
                <p className="text-xs text-muted-foreground">
                  Le slug est généré automatiquement à partir du nom. Vous pouvez le modifier manuellement ou cliquer sur 🔄 pour le régénérer.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="university">Université</Label>
              <Select
                value={form.watch('universityId')}
                onValueChange={onUniversityChange}
                disabled={isReadOnly || universitiesLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      universitiesLoading
                        ? "Chargement des universités..."
                        : universitiesError
                          ? "Erreur de chargement"
                          : "Sélectionnez une université"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {universities.map(uni => (
                    <SelectItem key={uni.id} value={uni.id}>
                      {uni.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {universitiesError && (
                <p className="text-sm text-destructive">
                  Erreur: {universitiesError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                {...form.register('location', { required: false })}
                placeholder="ex: Bâtiment A, 2ème étage"
                disabled={isReadOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacité</Label>
              <Input
                id="capacity"
                type="number"
                {...form.register('capacity', {
                  required: false,
                  valueAsNumber: true,
                  min: 1
                })}
                placeholder="ex: 200"
                disabled={isReadOnly}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Décrivez l'amphithéâtre..."
                rows={3}
                disabled={isReadOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={form.watch('status')}
                onValueChange={(value) => form.setValue('status', value as 'active' | 'maintenance' | 'draft')}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Équipements</Label>
              {!isReadOnly && (
                <div className="flex gap-2">
                  <Input
                    value={newEquipment}
                    onChange={(e) => setNewEquipment(e.target.value)}
                    placeholder="Ajouter un équipement..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addEquipment();
                      }
                    }}
                  />
                  <Button type="button" onClick={addEquipment} variant="outline">
                    Ajouter
                  </Button>
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {watchedEquipment.map((item, index) => (
                  <Badge key={`equipment-${index}-${item}`} variant="secondary" className="flex items-center gap-1">
                    {item}
                    {!isReadOnly && (
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeEquipment(index)}
                      />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            <LocationSelector
              value={{
                address: form.watch('address'),
                lat: form.watch('lat'),
                lng: form.watch('lng'),
              }}
              onChange={(location) => {
                form.setValue('address', location.address || '');
                form.setValue('lat', location.lat);
                form.setValue('lng', location.lng);
                // Mettre à jour le champ location avec l'adresse si disponible
                if (location.address) {
                  form.setValue('location', location.address);
                }
              }}
              disabled={isReadOnly}
            />

            <ImageUpload
              label="Image principale"
              value={form.watch('mainImage')}
              onChange={(file) => form.setValue('mainImage', file as File)}
              disabled={isReadOnly}
              multiple={false}
            />

            <ImageUpload
              label="Images annexes"
              value={form.watch('annexes')}
              onChange={(files) => form.setValue('annexes', files as File[])}
              disabled={isReadOnly}
              multiple={true}
              maxFiles={5}
            />
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