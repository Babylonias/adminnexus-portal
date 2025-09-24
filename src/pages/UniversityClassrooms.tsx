import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiService, type Classroom } from "@/services/api";
import { useUniversities } from "@/hooks/use-universities";
import { ClassroomModal } from "@/components/classrooms/ClassroomModal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { toast } from "sonner";
import { ClassroomList } from "@/components/classrooms/ClassroomList";

export const UniversityClassrooms = () => {
  const { universityId } = useParams<{ universityId: string }>();
  const navigate = useNavigate();
  const { universities } = useUniversities();

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États pour les modals
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [classroomToDelete, setClassroomToDelete] = useState<Classroom | null>(null);

  // Récupérer les informations de l'université
  const university = universities.find((u) => u.id === universityId);

  useEffect(() => {
    if (universityId) {
      fetchClassrooms();
    }
  }, [universityId]);

  const fetchClassrooms = async () => {
    if (!universityId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getUniversityClassrooms(universityId);
      setClassrooms(data);
    } catch (err) {
      setError("Erreur lors du chargement des amphithéâtres");
      console.error("Error fetching classrooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    const newAmphitheater: Classroom = {
      id: "", // L'API générera un nouvel ID
      name: "",
      slug: "",
      universityId: universityId || "",
      university: university || undefined,
      capacity: 0,
      equipment: [],
      status: "draft",
      description: "",
      main_image: undefined,
      annexes: [],
    };

    setSelectedClassroom(newAmphitheater);
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
    setClassroomToDelete(classroom);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!classroomToDelete) {
      toast.error("Aucun amphithéâtre sélectionné pour la suppression");
      setConfirmOpen(false);
      return;
    }

    try {
      await apiService.deleteAmphitheater(classroomToDelete.id);
      toast.success(`${classroomToDelete.name} supprimé avec succès`);
      setClassroomToDelete(null);
      setConfirmOpen(false);
      fetchClassrooms();
    } catch (error) {
      console.error("Error during delete:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleSave = async (classroomData: Classroom) => {
    try {
      // Créer un objet FormData pour l'envoi des données
      const formData = new FormData();
      
      // Ajouter les champs au FormData
      Object.entries(classroomData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            // Pour les tableaux, on les convertit en JSON
            formData.append(key, JSON.stringify(value));
          } else if (value instanceof File) {
            // Pour les fichiers, on les ajoute directement
            formData.append(key, value);
          } else {
            // Pour les autres types, on les convertit en chaîne
            formData.append(key, String(value));
          }
        }
      });

      if (classroomData.id) {
        // Mise à jour d'un amphithéâtre existant
        await apiService.updateAmphitheater(classroomData.id, formData);
        toast.success("Amphithéâtre mis à jour avec succès");
      } else {
        // Création d'un nouvel amphithéâtre
        await apiService.createAmphitheater(formData);
        toast.success("Amphithéâtre créé avec succès");
      }
      
      fetchClassrooms();
      setModalOpen(false);
    } catch (error) {
      console.error("Error saving classroom:", error);
      toast.error("Erreur lors de la sauvegarde");
    }
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Building2 className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm font-medium">Capacité totale</p>
                <p className="text-2xl font-bold">
                  {classrooms.reduce((sum, c) => sum + (c.capacity || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des amphithéâtres */}
      <ClassroomList
        classrooms={classrooms}
        loading={loading}
        error={error}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyMessage="Aucun amphithéâtre"
        emptyDescription="Cette université n'a pas encore d'amphithéâtre enregistré."
      />

      {/* Modal pour créer/modifier/afficher un amphithéâtre */}
      {selectedClassroom && (
        <ClassroomModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          mode={modalMode}
          classroom={selectedClassroom}
          onSave={handleSave}
        />
      )}

      {/* Confirmation de suppression */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmDelete}
        title="Supprimer l'amphithéâtre"
        description={`Êtes-vous sûr de vouloir supprimer ${classroomToDelete?.name || "cet amphithéâtre"} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
      />
    </div>
  );
};
