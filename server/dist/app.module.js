"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const roles_module_1 = require("./roles/roles.module");
const goals_module_1 = require("./goals/goals.module");
const habits_module_1 = require("./habits/habits.module");
const habit_logs_module_1 = require("./habit-logs/habit-logs.module");
const projects_module_1 = require("./projects/projects.module");
const project_activities_module_1 = require("./project-activities/project-activities.module");
const daily_stones_module_1 = require("./daily-stones/daily-stones.module");
const fitness_module_1 = require("./fitness/fitness.module");
const deviations_module_1 = require("./deviations/deviations.module");
const resources_module_1 = require("./resources/resources.module");
const notes_module_1 = require("./notes/notes.module");
const calendar_module_1 = require("./calendar/calendar.module");
const cloudinary_module_1 = require("./cloudinary/cloudinary.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const years_module_1 = require("./years/years.module");
const pomodoro_module_1 = require("./pomodoro/pomodoro.module");
const active_pauses_module_1 = require("./active-pauses/active-pauses.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
                serveRoot: '/uploads',
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                url: process.env.DATABASE_URL || "postgresql://postgres:Klisten1a3218@127.0.0.1:5432/life_canvas?schema=public",
                autoLoadEntities: true,
                synchronize: true,
                logging: true,
                ssl: (process.env.DATABASE_URL?.includes('127.0.0.1') || process.env.DATABASE_URL?.includes('localhost')) ? false : { rejectUnauthorized: false },
            }),
            roles_module_1.RolesModule,
            goals_module_1.GoalsModule,
            habits_module_1.HabitsModule,
            habit_logs_module_1.HabitLogsModule,
            projects_module_1.ProjectsModule,
            project_activities_module_1.ProjectActivitiesModule,
            daily_stones_module_1.DailyStonesModule,
            fitness_module_1.FitnessModule,
            deviations_module_1.DeviationsModule,
            resources_module_1.ResourcesModule,
            notes_module_1.NotesModule,
            calendar_module_1.CalendarModule,
            cloudinary_module_1.CloudinaryModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            years_module_1.YearsModule,
            pomodoro_module_1.PomodoroModule,
            active_pauses_module_1.ActivePauseModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map