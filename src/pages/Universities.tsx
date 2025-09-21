import { useState } from "react";
import { Plus, Search, Filter, MoreVertical, MapPin, Users, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { UniversityModal } from "@/components/universities/UniversityModal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useUniversities } from "@/hooks/use-universities";
import { useNavigate } from "react-router-dom";

interface University {
  id: string; // UUID
  name: string;
  slug: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
  // Champs calculés localement
  amphitheaterCount?: number;
  totalCapacity?: number;
  status?: "active" | "draft";
  photos?: string[];
}

// Les universités sont maintenant récupérées du backend

export const Universities = () => {
  // Récupérer les universités du backend
  const { universities, loading, error, refetch } = useUniversities();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedUniversity, setSelectedUniversity] = useState<University | undefined>();
  
  // Confirmation dialog states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [universityToDelete, setUniversityToDelete] = useState<University | null>(null);

  const filteredUniversities = universities.filter(uni => {
    const location = uni.address || '';
    const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (uni.description && uni.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || (uni.status && uni.status === statusFilter);
    return matchesSearch && matchesStatus;
  });

  const handleCreateNew = () => {
    setSelectedUniversity(undefined);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleView = (university: University) => {
    setSelectedUniversity(university);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleEdit = (university: University) => {
    setSelectedUniversity(university);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDeleteClick = (university: University) => {
    setUniversityToDelete(university);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (universityToDelete) {
      // TODO: Appeler l'API pour supprimer l'université
      // Pour l'instant, on simule la suppression localement
      toast.success(`${universityToDelete.name} supprimée avec succès`);
      setUniversityToDelete(null);
      refetch(); // Recharger les données
    }
  };

  const handleSave = (universityData: Omit<University, 'amphitheaterCount' | 'totalCapacity' | 'created_at' | 'photos'> & { id?: string }) => {
    // TODO: Appeler l'API pour créer/modifier l'université
    // Pour l'instant, on simule la sauvegarde
    if (universityData.id) {
      toast.success('Université modifiée avec succès');
    } else {
      toast.success('Université créée avec succès');
    }
    refetch(); // Recharger les données
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
            Universités
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérez les établissements d'enseignement supérieur
          </p>
        </div>
        <Button onClick={handleCreateNew} className="bg-gradient-primary hover:opacity-90 shadow-elegant">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Université
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou localisation..."
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
              <SelectItem value="draft">Brouillon</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Universities Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredUniversities.map((university) => (
          <Card key={university.id} className="group hover:shadow-elegant transition-all duration-300 shadow-card">
            <div className="aspect-video overflow-hidden rounded-t-lg">
              <img
                src={university.photos?.[0] || "https://images.unsplash.com/photo-1562774053-701939374585?w=400"}
                alt={university.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle 
                    className="text-lg font-semibold group-hover:text-primary transition-colors cursor-pointer"
                    onClick={() => navigate(`/universities/${university.id}/classrooms`)}
                  >
                    {university.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {university.address || 'Adresse non renseignée'}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={university.status === 'active' ? 'default' : 'secondary'}>
                    {university.status === 'active' ? 'Actif' : university.status === 'draft' ? 'Brouillon' : 'Actif'}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/universities/${university.id}/classrooms`)}>
                        <Users className="h-4 w-4 mr-2" />
                        Voir les amphithéâtres
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleView(university)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Voir les détails
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(university)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(university)}
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
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {university.description || 'Aucune description disponible'}
              </p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {university.totalCapacity || 0} places
                  </span>
                  <span className="text-muted-foreground">
                    {university.amphitheaterCount || 0} amphis
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Chargement des universités...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-destructive text-lg">Erreur lors du chargement</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
          <Button onClick={refetch} variant="outline" className="mt-4">
            Réessayer
          </Button>
        </div>
      )}

      {!loading && !error && filteredUniversities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Aucune université trouvée</p>
          <p className="text-sm text-muted-foreground mt-2">
            {universities.length === 0 
              ? "Aucune université dans la base de données"
              : "Essayez de modifier vos critères de recherche"
            }
          </p>
        </div>
      )}

      {/* Modals */}
      <UniversityModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        university={selectedUniversity}
        mode={modalMode}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmDelete}
        title="Supprimer l'université"
        description={`Êtes-vous sûr de vouloir supprimer "${universityToDelete?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
      />
    </div>
  );
};