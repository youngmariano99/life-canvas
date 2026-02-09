import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { GoalsModule } from './goals/goals.module';
import { HabitsModule } from './habits/habits.module';
import { HabitLogsModule } from './habit-logs/habit-logs.module';
import { ProjectsModule } from './projects/projects.module';
import { ProjectActivitiesModule } from './project-activities/project-activities.module';
import { DailyStonesModule } from './daily-stones/daily-stones.module';
import { FitnessModule } from './fitness/fitness.module';
import { DeviationsModule } from './deviations/deviations.module';
import { ResourcesModule } from './resources/resources.module';
import { NotesModule } from './notes/notes.module';
import { CalendarModule } from './calendar/calendar.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { YearsModule } from './years/years.module';

// Entities
import { User } from './database/entities/user.entity';
import { Role } from './roles/entities/role.entity';
import { Goal } from './goals/entities/goal.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || "postgresql://postgres:Klisten1a3218@127.0.0.1:5432/life_canvas?schema=public",
      autoLoadEntities: true,
      synchronize: true, // Auto-create tables (Dev only)
      logging: true,
    }),
    RolesModule, GoalsModule, HabitsModule, HabitLogsModule, ProjectsModule, ProjectActivitiesModule, DailyStonesModule, FitnessModule, DeviationsModule, ResourcesModule, NotesModule, CalendarModule, CloudinaryModule, AuthModule, UsersModule, YearsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
