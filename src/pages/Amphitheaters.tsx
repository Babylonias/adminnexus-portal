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

interface Amphitheater {
  id: number;
  name: string;
  slug: string;
  university: string;
  universityId: number;
  location: string;
  capacity: number;
  equipment: string[];
  status: "active" | "maintenance" | "draft";
  description: string;
  createdAt: string;
}

// Mock data
const initialAmphitheaters: Amphitheater[] = [
  {
    id: 1,
    name: "Amphi Sciences 200",
    slug: "amphi-sciences-200",
    university: "Université Paris Tech",
    universityId: 1,
    location: "Bâtiment A, 2ème étage",
    capacity: 200,
    equipment: ["Projecteur 4K", "Son surround", "Tableau interactif"],
    status: "active" as const,
    description: "Grand amphithéâtre pour les cours magistraux",
    createdAt: "2024-01-20"
  },
  {
    id: 2,
    name: "Amphi Central",
    slug: "amphi-central",
    university: "Sorbonne Université", 
    universityId: 2,
    location: "Bâtiment principal, RDC",
    capacity: 350,
    equipment: ["Projecteur laser", "Micro sans fil", "Écran géant"],
    status: "active" as const,
    description: "Amphithéâtre principal pour les conférences",
    createdAt: "2024-01-18"
  },
  {
    id: 3,
    name: "Amphi Recherche",
    slug: "amphi-recherche",
    university: "Université Lyon 1",
    universityId: 3,
    location: "Campus Sciences, Bât. B",
    capacity: 150,
    equipment: ["Projecteur HD", "Système audio"],
    status: "maintenance" as const,
    description: "Amphithéâtre dédié aux présentations de recherche",
    createdAt: "2024-02-05"
  },
  {
    id: 4,
    name: "Amphi Médecine",
    slug: "amphi-medecine", 
    university: "Sorbonne Université",
    universityId: 2,
    location: "Faculté de Médecine",
    capacity: 120,
    equipment: ["Projecteur médical", "Écran tactile"],
    status: "draft" as const,
    description: "Amphithéâtre spécialisé pour les études médicales",
    createdAt: "2024-02-10"
  }
];

export const Amphitheaters = () => {
  const [amphitheaters, setAmphitheaters] = useState<Amphitheater[]>(initialAmphitheaters);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [universityFilter, setUniversityFilter] = useState("all");
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedAmphitheater, setSelectedAmphitheater] = useState<Amphitheater | undefined>();
  
  // Confirmation dialog states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [amphitheaterToDelete, setAmphitheaterToDelete] = useState<Amphitheater | null>(null);

  const filteredAmphitheaters = amphitheaters.filter(amphi => {
    const matchesSearch = amphi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         amphi.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         amphi.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || amphi.status === statusFilter;
    const matchesUniversity = universityFilter === "all" || amphi.universityId.toString() === universityFilter;
    return matchesSearch && matchesStatus && matchesUniversity;
  });

  const handleCreateNew = () => {
    setSelectedAmphitheater(undefined);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleView = (amphitheater: Amphitheater) => {
    setSelectedAmphitheater(amphitheater);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleEdit = (amphitheater: Amphitheater) => {
    setSelectedAmphitheater(amphitheater);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDeleteClick = (amphitheater: Amphitheater) => {
    setAmphitheaterToDelete(amphitheater);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (amphitheaterToDelete) {
      setAmphitheaters(prev => prev.filter(a => a.id !== amphitheaterToDelete.id));
      toast.success(`${amphitheaterToDelete.name} supprimé avec succès`);
      setAmphitheaterToDelete(null);
    }
  };

  const handleSave = (amphitheaterData: Omit<Amphitheater, 'createdAt'> & { id?: number }) => {
    if (amphitheaterData.id) {
      // Edit existing
      setAmphitheaters(prev => prev.map(a => 
        a.id === amphitheaterData.id 
          ? { 
              ...amphitheaterData,
              createdAt: prev.find(p => p.id === amphitheaterData.id)?.createdAt || new Date().toISOString().split('T')[0]
            } as Amphitheater
          : a
      ));
    } else {
      // Create new
      const newAmphitheater: Amphitheater = {
        ...amphitheaterData,
        id: Math.max(...amphitheaters.map(a => a.id)) + 1,
        createdAt: new Date().toISOString().split('T')[0]
      } as Amphitheater;
      setAmphitheaters(prev => [newAmphitheater, ...prev]);
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
              <SelectValue placeholder="Université" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les universités</SelectItem>
              <SelectItem value="1">Université Paris Tech</SelectItem>
              <SelectItem value="2">Sorbonne Université</SelectItem>
              <SelectItem value="3">Université Lyon 1</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Amphitheaters Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAmphitheaters.map((amphitheater) => (
          <Card key={amphitheater.id} className="group hover:shadow-elegant transition-all duration-300 shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    {amphitheater.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {amphitheater.university}
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
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{amphitheater.location}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium">{amphitheater.capacity} places</span>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Équipements :</p>
                  <div className="flex flex-wrap gap-1">
                    {amphitheater.equipment.slice(0, 2).map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAmphitheaters.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Aucun amphithéâtre trouvé</p>
          <p className="text-sm text-muted-foreground mt-2">
            Essayez de modifier vos critères de recherche
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
        description={`Êtes-vous sûr de vouloir supprimer "${amphitheaterToDelete?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
      />
    </div>
  );
};