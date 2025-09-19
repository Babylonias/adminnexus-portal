import { GraduationCap, Building2, Users, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Vue d'ensemble de votre plateforme éducative CampusWA
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Universités"
          value={12}
          description="Actives"
          icon={GraduationCap}
          trend={{ value: 8.2, isPositive: true }}
          variant="default"
        />
        <StatsCard
          title="Amphithéâtres"
          value={48}
          description="Total disponibles"
          icon={Building2}
          trend={{ value: 2.1, isPositive: true }}
          variant="success"
        />
        <StatsCard
          title="Capacité Totale"
          value="2,847"
          description="Places disponibles"
          icon={Users}
          variant="warning"
        />
        <StatsCard
          title="Taux d'Occupation"
          value="87%"
          description="Moyenne mensuelle"
          icon={TrendingUp}
          trend={{ value: 5.4, isPositive: true }}
          variant="success"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-xl">Activités Récentes</CardTitle>
            <CardDescription>
              Dernières modifications sur la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "Nouvel amphithéâtre ajouté",
                  details: "Amphi Sciences 200 - Université Paris Tech",
                  time: "Il y a 2 heures",
                  type: "success"
                },
                {
                  action: "Université modifiée",
                  details: "Mise à jour des informations - Sorbonne",
                  time: "Il y a 4 heures", 
                  type: "default"
                },
                {
                  action: "Maintenance programmée",
                  details: "Amphi Central - Université Lyon 1",
                  time: "Il y a 1 jour",
                  type: "warning"
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className={`h-2 w-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-success' :
                    activity.type === 'warning' ? 'bg-warning' : 'bg-primary'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-sm text-muted-foreground truncate">{activity.details}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-xl">Statistiques Rapides</CardTitle>
            <CardDescription>
              Aperçu des performances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Universités Actives</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-primary rounded-full" style={{ width: '92%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Capacité Utilisée</span>
                  <span className="font-medium">87%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full" style={{ width: '87%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Maintenance</span>
                  <span className="font-medium">15%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-warning rounded-full" style={{ width: '15%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};