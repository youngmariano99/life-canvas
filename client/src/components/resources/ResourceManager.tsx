/**
 * Resource Manager Component
 * Manage resources for goals
 */

import { useState } from "react";
import { Package, Plus, Minus, X, Edit2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { Resource } from "@/types/lifeOS";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface ResourceManagerProps {
  goalId: string;
  resources: Resource[];
}

export function ResourceManager({ goalId, resources }: ResourceManagerProps) {
  const { addResourceToGoal, updateResourceInGoal, deleteResourceFromGoal } = useLifeOSContext();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newResource, setNewResource] = useState({ name: "", quantityHave: 0, quantityNeeded: 0, unit: "" });

  const handleAdd = () => {
    if (!newResource.name.trim()) return;
    addResourceToGoal(goalId, {
      name: newResource.name.trim(),
      quantityHave: newResource.quantityHave,
      quantityNeeded: newResource.quantityNeeded,
      unit: newResource.unit.trim() || undefined,
    });
    setNewResource({ name: "", quantityHave: 0, quantityNeeded: 0, unit: "" });
    setIsAdding(false);
  };

  const handleAdjust = (resourceId: string, adjustment: number) => {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;
    const newQuantity = Math.max(0, resource.quantityHave + adjustment);
    updateResourceInGoal(goalId, resourceId, { quantityHave: newQuantity });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Package className="w-4 h-4" />
          Recursos
        </div>
        {!isAdding && (
          <Button variant="ghost" size="sm" onClick={() => setIsAdding(true)} className="h-7 text-xs">
            <Plus className="w-3 h-3 mr-1" />
            Agregar
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={newResource.name}
              onChange={(e) => setNewResource(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nombre del recurso"
              className="h-8 text-sm"
            />
            <Input
              value={newResource.unit}
              onChange={(e) => setNewResource(prev => ({ ...prev, unit: e.target.value }))}
              placeholder="Unidad (ej: hrs, $, uds)"
              className="h-8 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">Tengo</label>
              <Input
                type="number"
                value={newResource.quantityHave}
                onChange={(e) => setNewResource(prev => ({ ...prev, quantityHave: Number(e.target.value) }))}
                className="h-8 text-sm"
                min={0}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Necesito</label>
              <Input
                type="number"
                value={newResource.quantityNeeded}
                onChange={(e) => setNewResource(prev => ({ ...prev, quantityNeeded: Number(e.target.value) }))}
                className="h-8 text-sm"
                min={0}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} disabled={!newResource.name.trim()} className="h-7 text-xs">
              Agregar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)} className="h-7 text-xs">
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {resources.length === 0 && !isAdding ? (
        <p className="text-xs text-muted-foreground italic">Sin recursos definidos</p>
      ) : (
        <div className="space-y-2">
          {resources.map((resource) => {
            const progress = resource.quantityNeeded > 0 
              ? Math.min(100, (resource.quantityHave / resource.quantityNeeded) * 100)
              : 0;
            const isComplete = resource.quantityHave >= resource.quantityNeeded;

            return (
              <div key={resource.id} className="bg-muted/30 rounded-lg p-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{resource.name}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleAdjust(resource.id, -1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className={cn(
                      "text-xs font-medium min-w-[60px] text-center",
                      isComplete ? "text-success" : "text-foreground"
                    )}>
                      {resource.quantityHave}/{resource.quantityNeeded}{resource.unit ? ` ${resource.unit}` : ''}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleAdjust(resource.id, 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteResourceFromGoal(goalId, resource.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
