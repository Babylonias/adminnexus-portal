import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ClassroomModal, ClassroomList } from "@/components/classrooms";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useUniversities } from "@/hooks/use-universities";
import { useClassrooms } from "@/hooks/use-classrooms";
import type { Classroom } from "@/services/api";

export const Classrooms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [universityFilter, setUniversityFilter] = useState("all");

  // Récupérer les données du backend
  const { universities, loading: universitiesLoading } = useUniversities();
  const {
    classrooms,
    loading: classroomsLoading,
    error: classroomsError,
    deleteClassroom,
    createClassroom,
    updateClassroom,
  } = useClassrooms();

  // Debug: Log classrooms data
  console.log("🏛️ Page: Classrooms data:", classrooms);
  console.log("🏛️ Page: Loading:", classroomsLoading);
  console.log("🏛️ Page: Error:", classroomsError);

  // Fonction utilitaire pour récupérer le nom de l'université
  const getUniversityName = (universityId: string) => {
    const university = universities.find((u) => u.id === universityId);
    return university?.name || "Université inconnue";
  };

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create",
  );
  const [selectedClassroom, setSelectedClassroom] = useState<
    Classroom | undefined
  >();

  // Confirmation dialog states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [classroomToDelete, setClassroomToDelete] = useState<Classroom | null>(
    null,
  );

  const filteredClassrooms = classrooms.filter((classroom) => {
    const matchesSearch =
      classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classroom.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || classroom.status === statusFilter;
    // Note: Pour le filtre université, il faudra ajouter university_id dans l'API
    // const matchesUniversity = universityFilter === "all" || classroom.university_id === universityFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateNew = () => {
    setSelectedClassroom(undefined);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleView = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleEdit = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDeleteClick = (classroom: Classroom) => {
    console.log(
      "🎯 Page: handleDeleteClick called for:",
      classroom.name,
      "ID:",
      classroom.id,
    );
    console.log("🎯 Page: Current confirmOpen state:", confirmOpen);
    console.log("🎯 Page: Current classroomToDelete:", classroomToDelete);

    setClassroomToDelete(classroom);
    setConfirmOpen(true);

    console.log("🎯 Page: After setState - confirmOpen should be true");
    console.log(
      "🎯 Page: After setState - classroomToDelete should be:",
      classroom.name,
    );
  };

  const handleConfirmDelete = async () => {
    console.log("🔴 Page: handleConfirmDelete TRIGGERED!");
    console.log("🎯 Page: handleConfirmDelete called");
    console.log("🎯 Page: classroomToDelete:", classroomToDelete);

    if (!classroomToDelete) {
      console.log("❌ Page: No classroom to delete");
      toast.error("Aucune salle de cours sélectionnée pour la suppression");
      return;
    }

    try {
      console.log(
        "🎯 Page: Starting deletion for:",
        classroomToDelete.name,
        "ID:",
        classroomToDelete.id,
      );

      const success = await deleteClassroom(classroomToDelete.id);

      console.log("🎯 Page: Delete result:", success);

      if (success) {
        console.log("🎯 Page: Cleaning up modal state...");
        setClassroomToDelete(null);
        setConfirmOpen(false);
        console.log("🎯 Page: Modal state cleaned up");
      } else {
        console.log("❌ Page: Delete failed, keeping modal open");
      }
    } catch (error) {
      console.error("❌ Page: Error during delete:", error);
      // Ne pas fermer le modal en cas d'erreur, mais afficher l'erreur
    }
  };

  const handleSave = async (formData: FormData) => {
    const classroomId = selectedClassroom?.id;

    if (classroomId) {
      // Edit existing
      const result = await updateClassroom(classroomId, formData);
      if (result) {
        setModalOpen(false);
        setSelectedClassroom(undefined);
      }
    } else {
      // Create new
      const result = await createClassroom(formData);
      if (result) {
        setModalOpen(false);
        setSelectedClassroom(undefined);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
            Salles de Cours
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérez les espaces d'enseignement de vos universités
          </p>
        </div>
        <Button
          onClick={handleCreateNew}
          className="bg-gradient-primary hover:opacity-90 shadow-elegant"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Salle de Cours
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, université ou localisation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="draft">Brouillon</SelectItem>
            </SelectContent>
          </Select>
          <Select value={universityFilter} onValueChange={setUniversityFilter}>
            <SelectTrigger className="w-48">
              <SelectValue
                placeholder={
                  universitiesLoading ? "Chargement..." : "Université"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les universités</SelectItem>
              {universities.map((university) => (
                <SelectItem key={university.id} value={university.id}>
                  {university.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Classrooms List */}
      <ClassroomList
        classrooms={filteredClassrooms}
        loading={classroomsLoading}
        error={classroomsError}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyMessage="Aucune salle de cours trouvée"
        emptyDescription={
          classrooms.length === 0
            ? "Aucune salle de cours créée pour le moment"
            : "Essayez de modifier vos critères de recherche"
        }
      />

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
