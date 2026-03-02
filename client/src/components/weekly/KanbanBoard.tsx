/**
 * Kanban Board Component
 * Drag and drop activities between status columns
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, GripVertical, X, Calendar, Edit2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { Project, ProjectActivity } from "@/types/lifeOS";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface KanbanBoardProps {
  project: Project;
  readOnly?: boolean;
}

export function KanbanBoard({ project, readOnly = false }: KanbanBoardProps) {
  const {
    state,
    addProjectActivity,
    updateProjectActivity,
    deleteProjectActivity,
    updateProject
  } = useLifeOSContext();

  const [newActivityTitle, setNewActivityTitle] = useState("");
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);
  const [editingColumnIndex, setEditingColumnIndex] = useState<number | null>(null);
  const [editedColumnName, setEditedColumnName] = useState("");
  const [draggedActivity, setDraggedActivity] = useState<string | null>(null);

  const activities = state.projectActivities.filter(a => a.projectId === project.id);

  const getActivitiesForStatus = (status: string) => {
    return activities
      .filter(a => a.status === status)
      .sort((a, b) => a.order - b.order);
  };

  const handleAddActivity = (status: string) => {
    if (!newActivityTitle.trim()) return;
    addProjectActivity({
      projectId: project.id,
      title: newActivityTitle.trim(),
      status,
    });
    setNewActivityTitle("");
    setAddingToColumn(null);
  };

  const handleDragStart = (activityId: string) => {
    setDraggedActivity(activityId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: string) => {
    if (!draggedActivity) return;
    updateProjectActivity(draggedActivity, { status });
    setDraggedActivity(null);
  };

  const handleEditColumn = (index: number) => {
    setEditingColumnIndex(index);
    setEditedColumnName(project.statuses[index]);
  };

  const handleSaveColumn = () => {
    if (editingColumnIndex === null || !editedColumnName.trim()) return;
    const newStatuses = [...project.statuses];
    const oldStatus = newStatuses[editingColumnIndex];
    newStatuses[editingColumnIndex] = editedColumnName.trim();

    // Update project statuses
    updateProject(project.id, { statuses: newStatuses });

    // Update all activities with old status
    activities
      .filter(a => a.status === oldStatus)
      .forEach(a => updateProjectActivity(a.id, { status: editedColumnName.trim() }));

    setEditingColumnIndex(null);
    setEditedColumnName("");
  };

  const handleAddColumn = () => {
    const newStatuses = [...project.statuses, `Estado ${project.statuses.length + 1}`];
    updateProject(project.id, { statuses: newStatuses });
  };

  const handleDeleteColumn = (index: number) => {
    if (project.statuses.length <= 2) return; // Keep at least 2 columns
    const statusToDelete = project.statuses[index];
    const newStatuses = project.statuses.filter((_, i) => i !== index);

    // Move activities to first column
    activities
      .filter(a => a.status === statusToDelete)
      .forEach(a => updateProjectActivity(a.id, { status: newStatuses[0] }));

    updateProject(project.id, { statuses: newStatuses });
  };

  return (
    <div className="space-y-4">
      {/* Add Column Button */}
      {!readOnly && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleAddColumn} className="gap-1">
            <Plus className="w-4 h-4" />
            Columna
          </Button>
        </div>
      )}

      {/* Kanban Columns */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0">
        <div className="grid gap-4 min-w-[max(100%,_800px)]" style={{ gridTemplateColumns: `repeat(${project.statuses.length}, minmax(280px, 1fr))` }}>
          {project.statuses.map((status, index) => {
            const columnActivities = getActivitiesForStatus(status);
            const isFirst = index === 0;
            const isLast = index === project.statuses.length - 1;

            return (
              <div
                key={status}
                className={cn(
                  "bg-muted/30 rounded-xl p-3 min-h-[300px]",
                  draggedActivity && "ring-2 ring-dashed ring-primary/30"
                )}
                onDragOver={!readOnly ? handleDragOver : undefined}
                onDrop={!readOnly ? () => handleDrop(status) : undefined}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3">
                  {editingColumnIndex === index ? (
                    <div className="flex items-center gap-1 flex-1">
                      <Input
                        value={editedColumnName}
                        onChange={(e) => setEditedColumnName(e.target.value)}
                        className="h-7 text-sm"
                        onKeyDown={(e) => e.key === "Enter" && handleSaveColumn()}
                      />
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleSaveColumn}>
                        <Check className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground text-sm">{status}</h4>
                        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {columnActivities.length}
                        </span>
                      </div>
                      {!readOnly && (
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-10 w-10 text-muted-foreground"
                            onClick={() => handleEditColumn(index)}
                          >
                            <Edit2 className="h-5 w-5" />
                          </Button>
                          {project.statuses.length > 2 && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-10 w-10 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDeleteColumn(index)}
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Activities */}
                <div className="space-y-2">
                  {columnActivities.map((activity) => (
                    <motion.div
                      key={activity.id}
                      layout
                      draggable={!readOnly}
                      onDragStart={() => !readOnly && handleDragStart(activity.id)}
                      className={cn(
                        "bg-card rounded-lg border border-border p-3",
                        !readOnly && "cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow",
                        draggedActivity === activity.id && "opacity-50"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {!readOnly && <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">{activity.title}</p>
                          {activity.dueDate && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3" />
                              {format(parseISO(activity.dueDate), "d MMM", { locale: es })}
                            </p>
                          )}
                        </div>
                        {!readOnly && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-10 w-10 text-muted-foreground hover:text-destructive flex-shrink-0"
                            onClick={() => deleteProjectActivity(activity.id)}
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* Add Activity */}
                  {!readOnly && (
                    addingToColumn === status ? (
                      <div className="space-y-2">
                        <Input
                          value={newActivityTitle}
                          onChange={(e) => setNewActivityTitle(e.target.value)}
                          placeholder="Título de la actividad"
                          className="h-8 text-sm"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddActivity(status);
                            if (e.key === "Escape") setAddingToColumn(null);
                          }}
                        />
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => handleAddActivity(status)}
                            disabled={!newActivityTitle.trim()}
                          >
                            Agregar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => {
                              setAddingToColumn(null);
                              setNewActivityTitle("");
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full h-8 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => setAddingToColumn(status)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Agregar actividad
                      </Button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
