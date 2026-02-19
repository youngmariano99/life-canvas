
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Clock, Tag } from "lucide-react";
import { PomodoroSession, Role, Project } from "@/types/lifeOS";
import { cn } from "@/lib/utils";

interface PomodoroHistoryProps {
    sessions: PomodoroSession[];
    roles: Role[];
    projects: Project[];
    onDelete?: (id: string) => void;
}

export function PomodoroHistory({ sessions, roles, projects, onDelete }: PomodoroHistoryProps) {
    // Group by date
    const grouped = sessions.reduce((acc, session) => {
        const date = session.createdAt.split('T')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(session);
        return acc;
    }, {} as Record<string, PomodoroSession[]>);

    const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

    return (
        <div className="space-y-6">
            {sortedDates.map(date => (
                <div key={date} className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground capitalize">
                        {format(parseISO(date), "EEEE d 'de' MMMM", { locale: es })}
                    </h4>
                    <div className="space-y-2">
                        {grouped[date].map(session => {
                            const role = roles.find(r => r.id === session.roleId);
                            const project = projects.find(p => p.id === session.projectId);

                            return (
                                <div key={session.id} className="bg-card border rounded-lg p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary font-bold text-sm"
                                        )}>
                                            {session.duration}'
                                        </div>
                                        <div>
                                            <p className="font-medium">{session.activityName}</p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {role && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground flex items-center gap-1">
                                                        {role.name}
                                                    </span>
                                                )}
                                                {project && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground flex items-center gap-1">
                                                        <Tag className="w-3 h-3" />
                                                        {project.name}
                                                    </span>
                                                )}
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {format(parseISO(session.startTime), "HH:mm")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Delete button (optional) */}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
            {sessions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    No hay sesiones registradas aún.
                </div>
            )}
        </div>
    );
}
