import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { Resource } from './entities/resource.entity';
import { User } from '../database/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Resource, User])],
    controllers: [ResourcesController],
    providers: [ResourcesService],
})
export class ResourcesModule { }
