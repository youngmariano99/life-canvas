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
exports.Resource = void 0;
const typeorm_1 = require("typeorm");
let Resource = class Resource {
    id;
    goalId;
    name;
    quantityHave;
    quantityNeeded;
    unit;
    createdAt;
    goal;
};
exports.Resource = Resource;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Resource.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'goal_id' }),
    __metadata("design:type", String)
], Resource.prototype, "goalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Resource.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity_have', type: 'numeric', default: 0 }),
    __metadata("design:type", Number)
], Resource.prototype, "quantityHave", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity_needed', type: 'numeric', default: 0 }),
    __metadata("design:type", Number)
], Resource.prototype, "quantityNeeded", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Resource.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Resource.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Goal', (goal) => goal.resources, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'goal_id' }),
    __metadata("design:type", Function)
], Resource.prototype, "goal", void 0);
exports.Resource = Resource = __decorate([
    (0, typeorm_1.Entity)('resources')
], Resource);
//# sourceMappingURL=resource.entity.js.map