import { PartialType } from '@nestjs/mapped-types';
import { CreateFitnessActivityDto } from './create-fitness-activity.dto';

export class UpdateFitnessActivityDto extends PartialType(CreateFitnessActivityDto) { }
