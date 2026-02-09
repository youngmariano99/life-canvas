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

// Helper component for individual resource item to manage local editing state if needed
function ResourceItem({ resource, goalId }: { resource: Resource; goalId: string }) {
  const { updateResourceInGoal, deleteResourceFromGoal } = useLifeOSContext();

  const handleAdjust = (adjustment: number) => {
    const current = Number(resource.quantityHave) || 0;
    const newQuantity = Math.max(0, current + adjustment);
    updateResourceInGoal(goalId, resource.id, { quantityHave: newQuantity });
  };

  const handleChange = (val: string) => {
    const num = Number(val);
    if (!isNaN(num)) {
      updateResourceInGoal(goalId, resource.id, { quantityHave: num });
    }
  };

  const progress = resource.quantityNeeded > 0
    ? Math.min(100, (Number(resource.quantityHave) / Number(resource.quantityNeeded)) * 100)
    : 0;
  const isComplete = Number(resource.quantityHave) >= Number(resource.quantityNeeded);

  return (
    <div className="bg-muted/30 rounded-lg p-2 space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-foreground truncate flex-1">{resource.name}</span>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => handleAdjust(-1)}
          >
            <Minus className="w-3 h-3" />
          </Button>

          <div className="flex items-center gap-1">
            <Input
              type="number"
              className="h-6 w-16 text-center p-1 text-xs bg-background border-muted"
              value={resource.quantityHave}
              onChange={(e) => handleChange(e.target.value)}
            />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              / {resource.quantityNeeded} {resource.unit || ''}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => handleAdjust(1)}
          >
            <Plus className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive ml-1"
            onClick={() => deleteResourceFromGoal(goalId, resource.id)}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
      <Progress value={progress} className="h-1.5" />
    </div>
  );
}

export function ResourceManager({ goalId, resources }: ResourceManagerProps) {
  const { addResourceToGoal } = useLifeOSContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newResource, setNewResource] = useState({ name: "", quantityHave: 0, quantityNeeded: 0, unit: "" });

  const handleAdd = () => {
    if (!newResource.name.trim()) return;
    addResourceToGoal(goalId, {
      name: newResource.name.trim(),
      quantityHave: Number(newResource.quantityHave),
      quantityNeeded: Number(newResource.quantityNeeded),
      unit: newResource.unit.trim() || undefined,
    });
    setNewResource({ name: "", quantityHave: 0, quantityNeeded: 0, unit: "" });
    setIsAdding(false);
  };
  // ... rest is same until return ...

  return (
    <div className="space-y-3">
      {/* ... Header ... */}
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
          {resources.map((resource) => (
            <ResourceItem key={resource.id} resource={resource} goalId={goalId} />
          ))}
        </div>
      )}
    </div>
  );
}
