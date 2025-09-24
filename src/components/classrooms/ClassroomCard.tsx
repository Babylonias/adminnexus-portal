import { Building2, Users, MapPin, Eye, Edit, Trash2, MoreVertical } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { Classroom } from "@/services/api";

interface ClassroomCardProps {
  classroom: Classroom;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const ClassroomCard = ({
  classroom,
  onView,
  onEdit,
  onDelete,
}: ClassroomCardProps) => {
  const getStatusColor = (status: string) => {
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Actif";
      case "maintenance":
        return "Maintenance";
      case "draft":
        return "Brouillon";
      default:
        return status;
    }
  };

  const getClassroomImage = (classroom: Classroom) => {
    return (
      classroom.main_image ||
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop"
    );
  };

  return (
    <Card className="group hover:shadow-elegant transition-all duration-300 shadow-card">
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
              {classroom.slug}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor(classroom.status || "draft")}>
              {getStatusLabel(classroom.status || "draft")}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onView}>
                  <Eye className="h-4 w-4 mr-2" />
                  Voir les détails
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    console.log(
                      "🔥 ClassroomCard: Delete button clicked for:",
                      classroom.name,
                    );
                    onDelete();
                  }}
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
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {classroom.description}
        </p>

        <div className="space-y-3">
          {classroom.lat && classroom.lng && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">
                {classroom.lat}, {classroom.lng}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">
              {classroom.capacity || 0} places
            </span>
          </div>

          {classroom.equipment &&
            classroom.equipment.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Équipements :
                </p>
                <div className="flex flex-wrap gap-1">
                  {classroom.equipment
                    .slice(0, 2)
                    .map((item, index) => (
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
  );
};
