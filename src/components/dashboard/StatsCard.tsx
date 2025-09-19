import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning";
}

export const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon,
  trend,
  variant = "default" 
}: StatsCardProps) => {
  const variantStyles = {
    default: "from-primary/10 to-secondary/10 border-primary/20",
    success: "from-success/10 to-success/20 border-success/20", 
    warning: "from-warning/10 to-warning/20 border-warning/20"
  };

  const iconStyles = {
    default: "text-primary",
    success: "text-success",
    warning: "text-warning"
  };

  return (
    <Card className={cn(
      "relative overflow-hidden bg-gradient-to-br border shadow-card hover:shadow-elegant transition-all duration-300",
      variantStyles[variant]
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
              {trend && (
                <span className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}>
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center",
            iconStyles[variant],
            variant === "default" && "bg-gradient-primary/10",
            variant === "success" && "bg-success/10",
            variant === "warning" && "bg-warning/10"
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};