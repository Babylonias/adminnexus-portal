import { useState } from "react";
import { toast } from "sonner";
import { ClassroomModal } from "./ClassroomModal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Classroom } from "@/services/api";

interface ClassroomActionsProps {
  classroom?: Classroom;
  onSave: (formData: FormData) => Promise<void>;
  onDelete: (id: string) => Promise<boolean>;
}

export const ClassroomActions = ({
  classroom,
  onSave,
  onDelete,
}: ClassroomActionsProps) => {
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | undefined>();

  // Confirmation dialog states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [classroomToDelete, setClassroomToDelete] = useState<Classroom | null>(null);

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
      "🎯 ClassroomActions: handleDeleteClick called for:",
      classroom.name,
      "ID:",
      classroom.id,
    );
    setClassroomToDelete(classroom);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    console.log("🔴 ClassroomActions: handleConfirmDelete TRIGGERED!");
    console.log("🎯 ClassroomActions: handleConfirmDelete called");
    console.log("🎯 ClassroomActions: classroomToDelete:", classroomToDelete);

    if (!classroomToDelete) {
      console.log("❌ ClassroomActions: No classroom to delete");
      toast.error("Aucune salle de cours sélectionnée pour la suppression");
      return;
    }

    try {
      console.log(
        "🎯 ClassroomActions: Starting deletion for:",
        classroomToDelete.name,
        "ID:",
        classroomToDelete.id,
      );

      const success = await onDelete(classroomToDelete.id);

      console.log("🎯 ClassroomActions: Delete result:", success);

      if (success) {
        console.log("🎯 ClassroomActions: Cleaning up modal state...");
        setClassroomToDelete(null);
        setConfirmOpen(false);
        console.log("🎯 ClassroomActions: Modal state cleaned up");
      } else {
        console.log("❌ ClassroomActions: Delete failed, keeping modal open");
      }
    } catch (error) {
      console.error("❌ ClassroomActions: Error during delete:", error);
      // Ne pas fermer le modal en cas d'erreur
    }
  };

  const handleSave = async (formData: FormData) => {
    const classroomId = selectedClassroom?.id;

    try {
      await onSave(formData);
      setModalOpen(false);
      setSelectedClassroom(undefined);
    } catch (error) {
      console.error("Error saving classroom:", error);
      // Le toast d'erreur est géré dans le composant parent
    }
  };

  return (
    <>
      {/* Modal for create/edit/view */}
      <ClassroomModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        classroom={selectedClassroom}
        mode={modalMode}
        onSave={handleSave}
      />

      {/* Confirmation dialog for delete */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmDelete}
        title="Supprimer la salle de cours"
        description={`Êtes-vous sûr de vouloir supprimer définitivement la salle de cours "${classroomToDelete?.name}" ?

Cette action supprimera :
• Toutes les informations de la salle
• Les équipements associés
• L'historique des réservations

Cette action est irréversible et ne peut pas être annulée.`}
        confirmText="Supprimer définitivement"
        cancelText="Annuler"
        variant="destructive"
      />
    </>
  );
};

// Export des fonctions utilitaires pour utilisation externe
export const createClassroomActions = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | undefined>();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [classroomToDelete, setClassroomToDelete] = useState<Classroom | null>(null);

  return {
    // States
    modalOpen,
    modalMode,
    selectedClassroom,
    confirmOpen,
    classroomToDelete,

    // Actions
    openCreateModal: () => {
      setSelectedClassroom(undefined);
      setModalMode("create");
      setModalOpen(true);
    },

    openViewModal: (classroom: Classroom) => {
      setSelectedClassroom(classroom);
      setModalMode("view");
      setModalOpen(true);
    },

    openEditModal: (classroom: Classroom) => {
      setSelectedClassroom(classroom);
      setModalMode("edit");
      setModalOpen(true);
    },

    openDeleteDialog: (classroom: Classroom) => {
      setClassroomToDelete(classroom);
      setConfirmOpen(true);
    },

    // Setters
    setModalOpen,
    setConfirmOpen,
    setClassroomToDelete,
    setSelectedClassroom,
  };
};
