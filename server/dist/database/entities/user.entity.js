"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
let User = class User {
    id;
    email;
    name;
    createdAt;
    updatedAt;
    roles;
    goals;
    habits;
    deviations;
    noteFolders;
    notes;
    noteTags;
    dailyStones;
    fitnessActivities;
    calendarEvents;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Role', (role) => role.user),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Goal', (goal) => goal.user),
    __metadata("design:type", Array)
], User.prototype, "goals", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Habit', (habit) => habit.user),
    __metadata("design:type", Array)
], User.prototype, "habits", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Deviation', (deviation) => deviation.user),
    __metadata("design:type", Array)
], User.prototype, "deviations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('NoteFolder', (folder) => folder.user),
    __metadata("design:type", Array)
], User.prototype, "noteFolders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Note', (note) => note.user),
    __metadata("design:type", Array)
], User.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('NoteTag', (tag) => tag.user),
    __metadata("design:type", Array)
], User.prototype, "noteTags", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('DailyStone', (dailyStone) => dailyStone.user),
    __metadata("design:type", Array)
], User.prototype, "dailyStones", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('FitnessActivity', (fitness) => fitness.user),
    __metadata("design:type", Array)
], User.prototype, "fitnessActivities", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('CalendarEvent', (event) => event.user),
    __metadata("design:type", Array)
], User.prototype, "calendarEvents", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map