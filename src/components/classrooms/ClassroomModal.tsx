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
import type { Classroom } from "@/services/api";
import { toast } from "sonner";

interface ClassroomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroom?: Classroom;
  mode: "create" | "edit" | "view";
  onSave: (formData: FormData) => void;
}

// Les universités sont maintenant récupérées via le hook useUniversities

export const ClassroomModal = ({
  open,
  onOpenChange,
  classroom,
  mode,
  onSave,
}: ClassroomModalProps) => {
  const isReadOnly = mode === "view";
  const isEdit = mode === "edit";
  const [newEquipment, setNewEquipment] = useState("");
  // Supprimé: plus besoin des universités dans ce modal
  // const { universities, loading: universitiesLoading, error: universitiesError } = useUniversities();

  const form = useForm<Classroom>({
    defaultValues: {
      name: "",
      slug: "",
      lng: undefined,
      lat: undefined,
      capacity: 0,
      equipment: [],
      status: "draft",
      description: "",
      main_image: undefined,
      annexes: [],
    },
  });

  const watchedEquipment = form.watch("equipment") || [];

  useEffect(() => {
    if (classroom && open) {
      console.log("Modal received classroom data:", classroom); // Debug
      form.reset(classroom);
    } else if (!classroom && open) {
      form.reset({
        name: "",
        slug: "",
        lng: undefined,
        lat: undefined,
        capacity: 0,
        equipment: [],
        status: "draft",
        description: "",
        main_image: undefined,
        annexes: [],
      });
    }
  }, [classroom, open, form]);

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
      const currentEquipment = form.getValues("equipment") || [];
      form.setValue("equipment", [...currentEquipment, newEquipment.trim()]);
      setNewEquipment("");
    }
  };

  const removeEquipment = (index: number) => {
    const currentEquipment = form.getValues("equipment") || [];
    form.setValue(
      "equipment",
      currentEquipment.filter((_, i) => i !== index),
    );
  };

  const onSubmit = async (data: Classroom) => {
    try {
      console.log("Form data received:", data); // Debug

      // Préparer les données pour l'API backend
      const formData = new FormData();

      // Champs obligatoires
      formData.append("name", data.name || "");
      formData.append("slug", data.slug || "");

      // Ajouter les coordonnées (lng/lat comme attendu par le backend)
      if (data.lng !== undefined && data.lng !== null) {
        formData.append("lng", data.lng.toString());
      }
      if (data.lat !== undefined && data.lat !== null) {
        formData.append("lat", data.lat.toString());
      }

      // Ajouter les autres champs optionnels
      if (data.description) {
        formData.append("description", data.description);
      }
      if (data.capacity) {
        formData.append("capacity", data.capacity.toString());
      }
      if (data.status) {
        formData.append("status", data.status);
      }

      // Ajouter les équipements
      if (data.equipment && data.equipment.length > 0) {
        data.equipment.forEach((item, index) => {
          formData.append(`equipment[${index}]`, item);
        });
      }

      // Ajouter l'image principale si elle existe
      if (data.main_image && data.main_image instanceof File) {
        formData.append("main_image", data.main_image);
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
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      // Appeler la fonction onSave avec le FormData
      onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving classroom:", error);
      toast.error("Erreur lors de la sauvegarde de la salle de cours");
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Nouvel Amphithéâtre";
      case "edit":
        return "Modifier l'Amphithéâtre";
      case "view":
        return "Détails de l'Amphithéâtre";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {mode === "view"
              ? "Consultez les informations de cet amphithéâtre"
              : isEdit
                ? "Modifiez les informations de cet amphithéâtre"
                : "Remplissez les informations pour créer un nouvel amphithéâtre"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'amphithéâtre *</Label>
              <Input
                id="name"
                {...form.register("name", {
                  required: !isReadOnly ? "Le nom est obligatoire" : false,
                })}
                placeholder="ex: Amphi Sciences 200"
                disabled={isReadOnly}
              />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  {...form.register("slug", {
                    required: !isReadOnly ? "Le slug est requis" : false,
                    validate: !isReadOnly ? validateSlug : undefined,
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
                  Le slug est généré automatiquement à partir du nom. Vous
                  pouvez le modifier manuellement ou cliquer sur 🔄 pour le
                  régénérer.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacité</Label>
              <Input
                id="capacity"
                type="number"
                {...form.register("capacity", {
                  required: false,
                  valueAsNumber: true,
                  min: 0,
                })}
                placeholder="ex: 200"
                disabled={isReadOnly}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Décrivez cette salle de cours..."
                rows={3}
                disabled={isReadOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(value) =>
                  form.setValue(
                    "status",
                    value as "active" | "maintenance" | "draft",
                  )
                }
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
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addEquipment();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addEquipment}
                    variant="outline"
                  >
                    Ajouter
                  </Button>
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {watchedEquipment.map((item, index) => (
                  <Badge
                    key={`equipment-${index}-${item}`}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
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
                lat: form.watch("lat"),
                lng: form.watch("lng"),
              }}
              onChange={(location) => {
                form.setValue("lat", location.lat);
                form.setValue("lng", location.lng);
              }}
              disabled={isReadOnly}
            />

            <ImageUpload
              label="Image principale"
              value={form.watch("main_image")}
              onChange={(file) => form.setValue("main_image", file as File)}
              disabled={isReadOnly}
              multiple={false}
            />

            <ImageUpload
              label="Images annexes"
              value={form.watch("annexes")}
              onChange={(files) => form.setValue("annexes", files as File[])}
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
              {isReadOnly ? "Fermer" : "Annuler"}
            </Button>
            {!isReadOnly && (
              <Button
                type="submit"
                className="bg-gradient-primary hover:opacity-90"
              >
                {isEdit ? "Enregistrer" : "Créer"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
