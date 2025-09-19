import { useState } from "react";
import { Plus, Search, Filter, MoreVertical, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

// Mock data
const universities = [
  {
    id: 1,
    name: "Université Paris Tech",
    slug: "paris-tech",
    location: "Paris, France",
    description: "Institution de référence en sciences et technologies",
    amphitheaterCount: 12,
    totalCapacity: 2500,
    status: "active" as const,
    createdAt: "2024-01-15",
    photos: ["https://images.unsplash.com/photo-1562774053-701939374585?w=400"]
  },
  {
    id: 2,
    name: "Sorbonne Université",
    slug: "sorbonne",
    location: "Paris, France", 
    description: "Université pluridisciplinaire de recherche intensive",
    amphitheaterCount: 18,
    totalCapacity: 3200,
    status: "active" as const,
    createdAt: "2024-01-10",
    photos: ["https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400"]
  },
  {
    id: 3,
    name: "Université Lyon 1",
    slug: "lyon-1", 
    location: "Lyon, France",
    description: "Sciences, technologies, santé",
    amphitheaterCount: 8,
    totalCapacity: 1800,
    status: "draft" as const,
    createdAt: "2024-02-01",
    photos: ["https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400"]
  }
];

export const Universities = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUniversities = universities.filter(uni => {
    const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         uni.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || uni.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateNew = () => {
    toast.success("Fonction de création en cours de développement");
  };

  const handleEdit = (name: string) => {
    toast.info(`Édition de ${name} en cours de développement`);
  };

  const handleDelete = (name: string) => {
    toast.error(`Suppression de ${name} - Fonction en cours de développement`);
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
                src={university.photos[0]}
                alt={university.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {university.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {university.location}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={university.status === 'active' ? 'default' : 'secondary'}>
                    {university.status === 'active' ? 'Actif' : 'Brouillon'}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(university.name)}>
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(university.name)}>
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {university.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {university.totalCapacity} places
                  </span>
                  <span className="text-muted-foreground">
                    {university.amphitheaterCount} amphis
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUniversities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Aucune université trouvée</p>
          <p className="text-sm text-muted-foreground mt-2">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      )}
    </div>
  );
};