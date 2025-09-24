import { useState } from "react";
import { Plus, Search, Filter, MoreVertical, Building2, Users, MapPin, Eye, Edit, Trash2 } from "lucide-react";
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
import { AmphitheaterModal } from "@/components/amphitheaters/AmphitheaterModal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { useUniversities } from "@/hooks/use-universities";
import { useAmphitheaters } from "@/hooks/use-amphitheaters";
import type { Classroom } from "@/services/api";

export const Amphitheaters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [universityFilter, setUniversityFilter] = useState("all");

  // Récupérer les données du backend
  const { universities, loading: universitiesLoading } = useUniversities();
  const {
    amphitheaters,
    loading: amphitheatersLoading,
    error: amphitheatersError,
    deleteAmphitheater,
    createAmphitheater,
    updateAmphitheater
  } = useAmphitheaters();

  // Debug: Log amphitheaters data
  console.log('🏛️ Page: Amphitheaters data:', amphitheaters);
  console.log('🏛️ Page: Loading:', amphitheatersLoading);
  console.log('🏛️ Page: Error:', amphitheatersError);

  // Fonction utilitaire pour récupérer le nom de l'université
  const getUniversityName = (universityId: string) => {
    const university = universities.find(u => u.id === universityId);
    return university?.name || 'Université inconnue';
  };

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedAmphitheater, setSelectedAmphitheater] = useState<Classroom | undefined>();

  // Confirmation dialog states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [amphitheaterToDelete, setAmphitheaterToDelete] = useState<Classroom | null>(null);

  const filteredAmphitheaters = amphitheaters.filter(amphi => {
    const matchesSearch = amphi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      amphi.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || amphi.status === statusFilter;
    // Note: Pour le filtre université, il faudra ajouter university_id dans l'API
    // const matchesUniversity = universityFilter === "all" || amphi.university_id === universityFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateNew = () => {
    setSelectedAmphitheater(undefined);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleView = (amphitheater: Classroom) => {
    setSelectedAmphitheater(amphitheater);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleEdit = (amphitheater: Classroom) => {
    setSelectedAmphitheater(amphitheater);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDeleteClick = (amphitheater: Classroom) => {
    console.log('🎯 Page: handleDeleteClick called for:', amphitheater.name, 'ID:', amphitheater.id);
    setAmphitheaterToDelete(amphitheater);
    setConfirmOpen(true);
    console.log('🎯 Page: Confirm dialog should now be open');
  };

  const handleConfirmDelete = async () => {
    console.log('🎯 Page: handleConfirmDelete called');
    console.log('🎯 Page: amphitheaterToDelete:', amphitheaterToDelete);

    if (amphitheaterToDelete) {
      console.log('🎯 Page: Starting deletion for:', amphitheaterToDelete.name, 'ID:', amphitheaterToDelete.id);

      const success = await deleteAmphitheater(amphitheaterToDelete.id);

      console.log('🎯 Page: Delete result:', success);

      if (success) {
        console.log('🎯 Page: Cleaning up modal state...');
        setAmphitheaterToDelete(null);
        setConfirmOpen(false);
        console.log('🎯 Page: Modal state cleaned up');
      } else {
        console.log('❌ Page: Delete failed, keeping modal open');
      }
    } else {
      console.log('❌ Page: No amphitheater to delete');
    }
  };

  const handleSave = async (formData: FormData) => {
    const amphitheaterId = selectedAmphitheater?.id;

    if (amphitheaterId) {
      // Edit existing
      const result = await updateAmphitheater(amphitheaterId, formData);
      if (result) {
        setModalOpen(false);
        setSelectedAmphitheater(undefined);
      }
    } else {
      // Create new
      const result = await createAmphitheater(formData);
      if (result) {
        setModalOpen(false);
        setSelectedAmphitheater(undefined);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'maintenance': return 'destructive';
      case 'draft': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'maintenance': return 'Maintenance';
      case 'draft': return 'Brouillon';
      default: return status;
    }
  };

  const getAmphitheaterImage = (amphitheater: Classroom) => {
    return amphitheater.main_image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
            Amphithéâtres
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérez les espaces d'enseignement de vos universités
          </p>
        </div>
        <Button onClick={handleCreateNew} className="bg-gradient-primary hover:opacity-90 shadow-elegant">
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Amphithéâtre
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
                  universitiesLoading
                    ? "Chargement..."
                    : "Université"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les universités</SelectItem>
              {universities.map(university => (
                <SelectItem key={university.id} value={university.id}>
                  {university.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-4 bg-gray-100 rounded text-sm">
          <p><strong>Debug:</strong></p>
          <p>Total amphitheaters: {amphitheaters.length}</p>
          <p>Filtered amphitheaters: {filteredAmphitheaters.length}</p>
          <p>Loading: {amphitheatersLoading ? 'Yes' : 'No'}</p>
          <p>Error: {amphitheatersError || 'None'}</p>
        </div>
      )}

      {/* Amphitheaters Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAmphitheaters.map((amphitheater) => (
          <Card key={amphitheater.id} className="group hover:shadow-elegant transition-all duration-300 shadow-card">
            <ImageWithFallback
              src={getAmphitheaterImage(amphitheater)}
              alt={amphitheater.name}
              annexesCount={amphitheater.annexes?.length || 0}
            />
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    {amphitheater.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {amphitheater.slug}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(amphitheater.status)}>
                    {getStatusLabel(amphitheater.status)}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(amphitheater)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Voir les détails
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(amphitheater)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(amphitheater)}
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
                {amphitheater.description}
              </p>

              <div className="space-y-3">
                {amphitheater.lat && amphitheater.lng && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {amphitheater.lat}, {amphitheater.lng}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium">{amphitheater.capacity || 0} places</span>
                </div>

                {amphitheater.equipment && amphitheater.equipment.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Équipements :</p>
                    <div className="flex flex-wrap gap-1">
                      {amphitheater.equipment.slice(0, 2).map((item, index) => (
                        <Badge key={`${amphitheater.id}-equipment-${index}-${item}`} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                      {amphitheater.equipment.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{amphitheater.equipment.length - 2}
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

      {/* Loading state */}
      {amphitheatersLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Chargement des amphithéâtres...</p>
        </div>
      )}

      {/* Error state */}
      {amphitheatersError && (
        <div className="text-center py-12">
          <p className="text-destructive text-lg">Erreur lors du chargement</p>
          <p className="text-sm text-muted-foreground mt-2">{amphitheatersError}</p>
        </div>
      )}

      {/* Empty state */}
      {!amphitheatersLoading && !amphitheatersError && filteredAmphitheaters.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Aucun amphithéâtre trouvé</p>
          <p className="text-sm text-muted-foreground mt-2">
            {amphitheaters.length === 0
              ? "Aucun amphithéâtre créé pour le moment"
              : "Essayez de modifier vos critères de recherche"
            }
          </p>
        </div>
      )}

      {/* Modals */}
      <AmphitheaterModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        amphitheater={selectedAmphitheater}
        mode={modalMode}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmDelete}
        title="Supprimer l'amphithéâtre"
        description={`Êtes-vous sûr de vouloir supprimer définitivement l'amphithéâtre "${amphitheaterToDelete?.name}" ? 

Cette action supprimera :
• Toutes les informations de l'amphithéâtre
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