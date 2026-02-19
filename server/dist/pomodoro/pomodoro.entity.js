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
exports.Pomodoro = exports.PomodoroMode = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../database/entities/user.entity");
var PomodoroMode;
(function (PomodoroMode) {
    PomodoroMode["TIMER"] = "timer";
    PomodoroMode["STOPWATCH"] = "stopwatch";
})(PomodoroMode || (exports.PomodoroMode = PomodoroMode = {}));
let Pomodoro = class Pomodoro {
    id;
    type;
    startTime;
    endTime;
    duration;
    plannedDuration;
    activityName;
    notes;
    roleId;
    projectId;
    habitId;
    goalId;
    user;
    userId;
    createdAt;
    updatedAt;
};
exports.Pomodoro = Pomodoro;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Pomodoro.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PomodoroMode,
        default: PomodoroMode.TIMER,
    }),
    __metadata("design:type", String)
], Pomodoro.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Pomodoro.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Pomodoro.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Pomodoro.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Pomodoro.prototype, "plannedDuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Pomodoro.prototype, "activityName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Pomodoro.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Pomodoro.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Pomodoro.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Pomodoro.prototype, "habitId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Pomodoro.prototype, "goalId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.id, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Pomodoro.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Pomodoro.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Pomodoro.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Pomodoro.prototype, "updatedAt", void 0);
exports.Pomodoro = Pomodoro = __decorate([
    (0, typeorm_1.Entity)('pomodoros')
], Pomodoro);
//# sourceMappingURL=pomodoro.entity.js.map