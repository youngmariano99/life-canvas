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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectActivitiesController = void 0;
const common_1 = require("@nestjs/common");
const project_activities_service_1 = require("./project-activities.service");
const create_project_activity_dto_1 = require("./dto/create-project-activity.dto");
const update_project_activity_dto_1 = require("./dto/update-project-activity.dto");
let ProjectActivitiesController = class ProjectActivitiesController {
    projectActivitiesService;
    constructor(projectActivitiesService) {
        this.projectActivitiesService = projectActivitiesService;
    }
    create(createDto) {
        return this.projectActivitiesService.create(createDto);
    }
    findAll() {
        return this.projectActivitiesService.findAll();
    }
    findOne(id) {
        return this.projectActivitiesService.findOne(id);
    }
    update(id, updateDto) {
        return this.projectActivitiesService.update(id, updateDto);
    }
    remove(id) {
        return this.projectActivitiesService.remove(id);
    }
};
exports.ProjectActivitiesController = ProjectActivitiesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_project_activity_dto_1.CreateProjectActivityDto]),
    __metadata("design:returntype", void 0)
], ProjectActivitiesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProjectActivitiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectActivitiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_project_activity_dto_1.UpdateProjectActivityDto]),
    __metadata("design:returntype", void 0)
], ProjectActivitiesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectActivitiesController.prototype, "remove", null);
exports.ProjectActivitiesController = ProjectActivitiesController = __decorate([
    (0, common_1.Controller)('project-activities'),
    __metadata("design:paramtypes", [project_activities_service_1.ProjectActivitiesService])
], ProjectActivitiesController);
//# sourceMappingURL=project-activities.controller.js.map