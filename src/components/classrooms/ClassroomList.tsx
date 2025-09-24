import { Classroom } from "@/services/api";
import { ClassroomCard } from "./ClassroomCard";

interface ClassroomListProps {
  classrooms: Classroom[];
  loading: boolean;
  error?: string | null;
  onView: (classroom: Classroom) => void;
  onEdit: (classroom: Classroom) => void;
  onDelete: (classroom: Classroom) => void;
  emptyMessage?: string;
  emptyDescription?: string;
}

export const ClassroomList = ({
  classrooms,
  loading,
  error,
  onView,
  onEdit,
  onDelete,
  emptyMessage = "Aucune salle de cours trouvée",
  emptyDescription = "Aucune salle de cours créée pour le moment"
}: ClassroomListProps) => {
  // Loading state
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          Chargement des salles de cours...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive text-lg">Erreur lors du chargement</p>
        <p className="text-sm text-muted-foreground mt-2">{error}</p>
      </div>
    );
  }

  // Empty state
  if (classrooms.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">{emptyMessage}</p>
        <p className="text-sm text-muted-foreground mt-2">
          {emptyDescription}
        </p>
      </div>
    );
  }

  // Render classroom grid
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {classrooms.map((classroom) => (
        <ClassroomCard
          key={classroom.id}
          classroom={classroom}
          onView={() => onView(classroom)}
          onEdit={() => onEdit(classroom)}
          onDelete={() => onDelete(classroom)}
        />
      ))}
    </div>
  );
};
