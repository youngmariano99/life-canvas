import { IsString, IsArray, IsEnum, IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class CreateActivePauseRoutineDto {
    @IsString()
    nombre: string;

    @IsString()
    duracion: string;

    @IsArray()
    @IsString({ each: true })
    pasos: string[];

    @IsString()
    nivel: string;

    @IsArray()
    @IsString({ each: true })
    zona: string[];
}

export class UpdateActivePauseRoutineDto extends CreateActivePauseRoutineDto { }

export class CreateActivePauseEntryDto {
    @IsString()
    routineId: string;

    @IsDateString()
    date: string;

    @IsBoolean()
    completed: boolean;

    @IsBoolean()
    waterIntake: boolean;

    @IsBoolean()
    eyeCare: boolean;
}
