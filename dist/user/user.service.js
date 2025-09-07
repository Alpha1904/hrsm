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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAll() {
        return await this.prisma.user.findMany();
    }
    async create(createUserDto) {
        try {
            const existUser = await this.prisma.user.findFirst({
                where: { contactInfo: createUserDto.contactInfo },
            });
            if (existUser) {
                throw new common_1.ConflictException('User with this contact info already exists');
            }
            if (createUserDto.managerId) {
                const managerExists = await this.prisma.manager.findUnique({
                    where: { id: createUserDto.managerId },
                });
                if (!managerExists) {
                    throw new common_1.NotFoundException('Manager not found');
                }
            }
            return await this.prisma.$transaction(async (tx) => {
                const user = await tx.user.create({
                    data: {
                        name: createUserDto.name,
                        contactInfo: createUserDto.contactInfo,
                        site: createUserDto.site,
                        role: createUserDto.role,
                    },
                });
                await this.createRoleSpecificRecord(tx, user.id, user.role, createUserDto);
                return user;
            });
        }
        catch (error) {
            if (error instanceof common_1.ConflictException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.ConflictException('Failed to create user');
        }
    }
    async findUserWithRelations(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: this.getUserInclude(),
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    getUserInclude() {
        return {
            employee: {
                include: {
                    documents: true,
                    leaves: true,
                    schedule: true,
                    evaluations: true,
                    trainings: true,
                    payments: true,
                    departure: true,
                    manager: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    contactInfo: true,
                                },
                            },
                        },
                    },
                },
            },
            manager: {
                include: {
                    team: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    contactInfo: true,
                                },
                            },
                        },
                    },
                },
            },
            hrAdmin: true,
            recruiter: {
                include: {
                    jobPostings: true,
                    applications: true,
                },
            },
            sentMessages: {
                take: 5,
                orderBy: { timestamp: client_1.Prisma.SortOrder.desc },
            },
            receivedMessages: {
                take: 5,
                orderBy: { timestamp: client_1.Prisma.SortOrder.desc },
            },
        };
    }
    async createRoleSpecificRecord(tx, userId, role, createUserDto) {
        switch (role) {
            case client_1.Role.EMPLOYEE:
                await tx.employee.create({
                    data: {
                        userId,
                        position: createUserDto.position || 'To be assigned',
                        department: createUserDto.department || 'To be assigned',
                        seniority: createUserDto.seniority || 0,
                        contractStart: createUserDto.contractStart ? new Date(createUserDto.contractStart) : new Date(),
                        contractEnd: createUserDto.contractEnd ? new Date(createUserDto.contractEnd) : null,
                        contractType: createUserDto.contractType || client_1.ContractType.FullTime,
                        managerId: createUserDto.managerId || null,
                    },
                });
                break;
            case client_1.Role.MANAGER:
                await tx.manager.create({
                    data: {
                        userId,
                    },
                });
                break;
            case client_1.Role.HR_ADMIN:
                await tx.hR_Admin.create({
                    data: {
                        userId,
                        sitesManaged: createUserDto.sitesManaged || [],
                    },
                });
                break;
            case client_1.Role.RECRUITER:
                await tx.recruiter.create({
                    data: {
                        userId,
                    },
                });
                break;
            default:
                throw new Error(`Unknown role: ${role}`);
        }
    }
    async assignEmployeeToManager(employeeId, managerId) {
        try {
            const manager = await this.prisma.manager.findUnique({
                where: { id: managerId },
            });
            if (!manager) {
                throw new common_1.NotFoundException('Manager not found');
            }
            const employee = await this.prisma.employee.findUnique({
                where: { id: employeeId },
            });
            if (!employee) {
                throw new common_1.NotFoundException('Employee not found');
            }
            await this.prisma.employee.update({
                where: { id: employeeId },
                data: { managerId },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.ConflictException('Failed to assign employee to manager');
        }
    }
    async updateEmployeeDetails(employeeId, details) {
        try {
            const employee = await this.prisma.employee.findUnique({
                where: { id: employeeId },
            });
            if (!employee) {
                throw new common_1.NotFoundException('Employee not found');
            }
            if (details.managerId) {
                const manager = await this.prisma.manager.findUnique({
                    where: { id: details.managerId },
                });
                if (!manager) {
                    throw new common_1.NotFoundException('Manager not found');
                }
            }
            await this.prisma.employee.update({
                where: { id: employeeId },
                data: details,
            });
            return employee;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.ConflictException('Failed to update employee details');
        }
    }
    async updateHRAdminSites(hrAdminId, sitesManaged) {
        try {
            const hrAdmin = await this.prisma.hR_Admin.findUnique({
                where: { id: hrAdminId },
            });
            if (!hrAdmin) {
                throw new common_1.NotFoundException('HR Admin not found');
            }
            await this.prisma.hR_Admin.update({
                where: { id: hrAdminId },
                data: { sitesManaged },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.ConflictException('Failed to update HR admin sites');
        }
    }
    async getEmployeesByManager(managerId) {
        const manager = await this.prisma.manager.findUnique({
            where: { id: managerId },
            include: {
                team: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        if (!manager) {
            throw new common_1.NotFoundException('Manager not found');
        }
        return manager.team;
    }
    async getUsersByRole(role) {
        return await this.prisma.user.findMany({
            where: { role },
            include: this.getUserInclude(),
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map