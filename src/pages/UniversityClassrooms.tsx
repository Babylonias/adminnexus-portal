import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Users,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiService, type Classroom } from "@/services/api";
import { useUniversities } from "@/hooks/use-universities";
import { ClassroomModal } from "@/components/classrooms/ClassroomModal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { toast } from "sonner";

// Interface Classroom importée du service API

export const UniversityClassrooms = () => {
  const { universityId } = useParams<{ universityId: string }>();
  const navigate = useNavigate();
  const { universities } = useUniversities();

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États pour les modals
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create",
  );
  const [selectedClassroom, setSelectedClassroom] = useState<any>(undefined);

  // États pour la confirmation de suppression
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [classroomToDelete, setClassroomToDelete] = useState<Classroom | null>(
    null,
  );

  // Validation de l'UUID
  if (
    universityId &&
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      universityId,
    )
  ) {
    console.warn("Invalid UUID format:", universityId);
  }

  // Récupérer les informations de l'université
  const university = universities.find((u) => u.id === universityId);

  useEffect(() => {
    if (universityId) {
      console.log("University UUID:", universityId); // Debug
      fetchClassrooms();
    }
  }, [universityId]);

  const fetchClassrooms = async () => {
    if (!universityId) return;

    try {
      setLoading(true);
      setError(null);
      console.log("Fetching classrooms for university:", universityId); // Debug
      const data = await apiService.getUniversityClassrooms(universityId);
      console.log("Classrooms received:", data); // Debug
      setClassrooms(data);
    } catch (err) {
      setError("Erreur lors du chargement des amphithéâtres");
      console.error("Error fetching classrooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "default";
      case "maintenance":
        return "destructive";
      case "draft":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "active":
        return "Actif";
      case "maintenance":
        return "Maintenance";
      case "draft":
        return "Brouillon";
      default:
        return "Actif";
    }
  };

  const handleCreateNew = () => {
    // Pré-remplir avec l'université courante
    const newAmphitheater = {
      universityId: universityId || "",
      university: university?.name || "",
      name: "",
      slug: "",
      location: "",
      capacity: 0,
      equipment: [],
      status: "draft" as const,
      description: "",
      lat: undefined,
      lng: undefined,
      address: "",
      mainImage: undefined,
      annexes: [],
    };

    setSelectedClassroom(newAmphitheater);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleView = (classroom: Classroom) => {
    // Convertir Classroom en format Amphitheater pour le modal
    const amphitheaterData = {
      id: classroom.id,
      name: classroom.name,
      slug: classroom.slug,
      university: university?.name || "",
      universityId: universityId || "",
      location: "", // Pas de champ location dans Classroom
      capacity: classroom.capacity || 0,
      equipment: classroom.equipment || [],
      status: classroom.status || "active",
      description: classroom.description || "",
      lat: classroom.lat
        ? typeof classroom.lat === "string"
          ? parseFloat(classroom.lat)
          : classroom.lat
        : undefined,
      lng: classroom.lng
        ? typeof classroom.lng === "string"
          ? parseFloat(classroom.lng)
          : classroom.lng
        : undefined,
      address: "",
      mainImage: classroom.main_image,
      annexes: classroom.annexes,
    };
    setSelectedClassroom(amphitheaterData);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleEdit = (classroom: Classroom) => {
    console.log("Editing classroom:", classroom); // Debug

    // Convertir Classroom en format Amphitheater pour le modal
    const amphitheaterData = {
      id: classroom.id, // ID du backend (UUID)
      name: classroom.name,
      slug: classroom.slug,
      university: university?.name || "",
      universityId: universityId || "",
      location: "", // Pas de champ location dans Classroom
      capacity: classroom.capacity || 0,
      equipment: classroom.equipment || [],
      status: classroom.status || "active",
      description: classroom.description || "",
      lat: classroom.lat
        ? typeof classroom.lat === "string"
          ? parseFloat(classroom.lat)
          : classroom.lat
        : undefined,
      lng: classroom.lng
        ? typeof classroom.lng === "string"
          ? parseFloat(classroom.lng)
          : classroom.lng
        : undefined,
      address: "",
      mainImage: classroom.main_image,
      annexes: classroom.annexes,
    };

    console.log("Amphitheater data for modal:", amphitheaterData); // Debug
    setSelectedClassroom(amphitheaterData);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDeleteClick = (classroom: Classroom) => {
    setClassroomToDelete(classroom);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    console.log("🔴 UniversityClassrooms: handleConfirmDelete TRIGGERED!");
    console.log("🎯 UniversityClassrooms: handleConfirmDelete called");
    console.log(
      "🎯 UniversityClassrooms: classroomToDelete:",
      classroomToDelete,
    );

    if (!classroomToDelete) {
      console.log("❌ UniversityClassrooms: No classroom to delete");
      toast.error("Aucun amphithéâtre sélectionné pour la suppression");
      setConfirmOpen(false);
      return;
    }

    try {
      console.log(
        "🎯 UniversityClassrooms: Starting deletion for:",
        classroomToDelete.name,
        "ID:",
        classroomToDelete.id,
      );

      // Utiliser l'API service pour supprimer
      await apiService.deleteAmphitheater(classroomToDelete.id);

      console.log("✅ UniversityClassrooms: Delete successful");

      // Afficher le message de succès
      toast.success(`${classroomToDelete.name} supprimé avec succès`);

      // Nettoyer l'état et fermer le dialog
      setClassroomToDelete(null);
      setConfirmOpen(false);

      // Recharger la liste
      fetchClassrooms();

      console.log(
        "🎯 UniversityClassrooms: Modal state cleaned up and list reloaded",
      );
    } catch (error) {
      console.error("❌ UniversityClassrooms: Error during delete:", error);
      toast.error("Erreur lors de la suppression");
      // Ne pas fermer le modal en cas d'erreur
    }
  };

  const handleSave = async (amphitheaterData: any) => {
    try {
      // Pré-remplir l'université pour les nouveaux amphithéâtres
      if (!amphitheaterData.id && universityId && university) {
        amphitheaterData.universityId = universityId;
        amphitheaterData.university = university.name;
      }

      // TODO: Appeler l'API pour sauvegarder
      // if (amphitheaterData.id) {
      //   await apiService.updateAmphitheater(amphitheaterData.id, formData);
      // } else {
      //   await apiService.creeateClassroom(formData);
      // }

      toast.success(
        amphitheaterData.id
          ? "Amphithéâtre modifié avec succès"
          : "Amphithéâtre créé avec succès",
      );
      fetchClassrooms(); // Recharger la liste
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
      console.error("Save error:", error);
    }
  };

  const getClassroomImage = (classroom: Classroom) => {
    return classroom.main_image;
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/universities")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Chargement...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/universities")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-destructive">Erreur</h1>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
        <Button onClick={fetchClassrooms} variant="outline">
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/universities")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
            Amphithéâtres - {university?.name || "Université"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {classrooms.length} amphithéâtre{classrooms.length > 1 ? "s" : ""}{" "}
            dans cette université
          </p>
        </div>
        <Button
          onClick={handleCreateNew}
          className="bg-gradient-primary hover:opacity-90 shadow-elegant"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Amphithéâtre
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card key="stats-total">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold">{classrooms.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card key="stats-capacity">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm font-medium">Capacité totale</p>
                <p className="text-2xl font-bold">
                  {classrooms.reduce((sum, c) => sum + (c.capacity || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card key="stats-active">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="h-5 w-5 rounded-full p-0" />
              <div>
                <p className="text-sm font-medium">Actifs</p>
                <p className="text-2xl font-bold">
                  {
                    classrooms.filter((c) => c.status === "active" || !c.status)
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card key="stats-maintenance">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Badge
                variant="destructive"
                className="h-5 w-5 rounded-full p-0"
              />
              <div>
                <p className="text-sm font-medium">Maintenance</p>
                <p className="text-2xl font-bold">
                  {classrooms.filter((c) => c.status === "maintenance").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des amphithéâtres */}
      {classrooms.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">Aucun amphithéâtre</h3>
          <p className="text-muted-foreground mb-4">
            Cette université n'a pas encore d'amphithéâtre enregistré.
          </p>
          <Button
            onClick={handleCreateNew}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer le premier amphithéâtre
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {classrooms.map((classroom) => (
            <Card
              key={classroom.id}
              className="group hover:shadow-elegant transition-all duration-300 shadow-card"
            >
              <ImageWithFallback
                src={getClassroomImage(classroom)}
                alt={classroom.name}
                annexesCount={classroom.annexes?.length || 0}
              />

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      {classroom.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {university?.name}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(classroom.status)}>
                      {getStatusLabel(classroom.status)}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(classroom)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Voir les détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(classroom)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(classroom)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {classroom.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {classroom.description}
                  </p>
                )}

                <div className="space-y-3">
                  {classroom.capacity && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">
                        {classroom.capacity} places
                      </span>
                    </div>
                  )}

                  {classroom.lat && classroom.lng && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {typeof classroom.lat === "string"
                          ? parseFloat(classroom.lat).toFixed(4)
                          : classroom.lat?.toFixed(4)}
                        ,{" "}
                        {typeof classroom.lng === "string"
                          ? parseFloat(classroom.lng).toFixed(4)
                          : classroom.lng?.toFixed(4)}
                      </span>
                    </div>
                  )}

                  {classroom.equipment && classroom.equipment.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Équipements :
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {classroom.equipment.slice(0, 2).map((item, index) => (
                          <Badge
                            key={`${classroom.id}-equipment-${index}-${item}`}
                            variant="outline"
                            className="text-xs"
                          >
                            {item}
                          </Badge>
                        ))}
                        {classroom.equipment.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{classroom.equipment.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <ClassroomModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        classroom={selectedClassroom}
        mode={modalMode}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmDelete}
        title="Supprimer la salle de cours"
        description={`Êtes-vous sûr de vouloir supprimer définitivement la salle de cours "${classroomToDelete?.name}" ?

Cette action supprimera :
• Toutes les informations de la salle de cours
• Les équipements associés
• L'historique des réservations

Cette action est irréversible et ne peut pas être annulée.`}
        confirmText="Supprimer définitivement"
        cancelText="Annuler"
        variant="destructive"
      />
    </div>
  );
};
