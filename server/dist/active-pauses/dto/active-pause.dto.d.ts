export declare class CreateActivePauseRoutineDto {
    nombre: string;
    duracion: string;
    pasos: string[];
    nivel: string;
    zona: string[];
}
export declare class UpdateActivePauseRoutineDto extends CreateActivePauseRoutineDto {
}
export declare class CreateActivePauseEntryDto {
    routineId: string;
    date: string;
    completed: boolean;
    waterIntake: boolean;
    eyeCare: boolean;
}
