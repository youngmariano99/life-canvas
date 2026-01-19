import { IsString, IsNotEmpty, IsArray, IsOptional, IsEnum } from 'class-validator';

export class CreateFitnessRoutineDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(['strength', 'cardio', 'hybrid'])
    type: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(['sets_reps', 'intervals', 'rounds', 'time', 'distance'])
    structureType: string;

    @IsString()
    @IsOptional()
    rounds?: string;

    @IsArray()
    @IsOptional()
    content: any[];
}
