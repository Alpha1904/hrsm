import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma, Role, User, ContractType, Employee } from '@prisma/client';
import { UpdateEmployeeDetailsDto } from './dto/update-employee-details.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}


  async getAll(){
    return await this.prisma.user.findMany();
  }
  
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existUser = await this.prisma.user.findFirst({
        where: { contactInfo: createUserDto.contactInfo },
      });
      
      if (existUser) {
        throw new ConflictException(
          'User with this contact info already exists',
        );
      }

      // If managerId is provided, validate it exists
      if (createUserDto.managerId) {
        const managerExists = await this.prisma.manager.findUnique({
          where: { id: createUserDto.managerId },
        });
        if (!managerExists) {
          throw new NotFoundException('Manager not found');
        }
      }

      return await this.prisma.$transaction(async (tx) => {
        // Create the user first
        const user = await tx.user.create({
          data: {
            name: createUserDto.name,
            contactInfo: createUserDto.contactInfo,
            site: createUserDto.site,
            role: createUserDto.role,
          },
        });

        // Create the role-specific record with provided details
        await this.createRoleSpecificRecord(tx, user.id, user.role, createUserDto);

        // Return just the basic user object
        return user;
      });
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      throw new ConflictException('Failed to create user');
    }
  }

  // Method to get user with all relations (separate from create)
  async findUserWithRelations(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: this.getUserInclude(),
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Helper method to get include options for user queries
  private getUserInclude() {
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
        orderBy: { timestamp: Prisma.SortOrder.desc },
      },
      receivedMessages: {
        take: 5,
        orderBy: { timestamp: Prisma.SortOrder.desc },
      },
    };
  }

  private async createRoleSpecificRecord(tx: any, userId: number, role: Role, createUserDto: CreateUserDto) {
    switch (role) {
      case Role.EMPLOYEE:
        await tx.employee.create({
          data: {
            userId,
            position: createUserDto.position || 'To be assigned',     
            department: createUserDto.department || 'To be assigned',
            seniority: createUserDto.seniority || 0,
            contractStart: createUserDto.contractStart ? new Date(createUserDto.contractStart) : new Date(),
            contractEnd: createUserDto.contractEnd ? new Date(createUserDto.contractEnd) : null,
            contractType: createUserDto.contractType || ContractType.FullTime,
            managerId: createUserDto.managerId || null,
          },
        });
        break;
        
      case Role.MANAGER:
        await tx.manager.create({
          data: {
            userId,
            // team relationship will be established when employees are assigned
          },
        });
        break;
        
      case Role.HR_ADMIN:
        await tx.hR_Admin.create({
          data: {
            userId,
            sitesManaged: createUserDto.sitesManaged || [],  
          },
        });
        break;
        
      case Role.RECRUITER:
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

  // Additional helper methods for managing relationships

  async assignEmployeeToManager(employeeId: number, managerId: number): Promise<void> {
    try {
      // Validate manager exists
      const manager = await this.prisma.manager.findUnique({
        where: { id: managerId },
      });
      
      if (!manager) {
        throw new NotFoundException('Manager not found');
      }

      // Validate employee exists
      const employee = await this.prisma.employee.findUnique({
        where: { id: employeeId },
      });
      
      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      await this.prisma.employee.update({
        where: { id: employeeId },
        data: { managerId },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new ConflictException('Failed to assign employee to manager');
    }
  }

  async updateEmployeeDetails(
    employeeId: number, 
    details: UpdateEmployeeDetailsDto
  ): Promise<Employee> {
    try {
      const employee = await this.prisma.employee.findUnique({
        where: { id: employeeId },
      });

      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      // If managerId is being updated, validate it exists
      if (details.managerId) {
        const manager = await this.prisma.manager.findUnique({
          where: { id: details.managerId },
        });
        if (!manager) {
          throw new NotFoundException('Manager not found');
        }
      }

      await this.prisma.employee.update({
        where: { id: employeeId },
        data: details,
      });

      return employee;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new ConflictException('Failed to update employee details');
    }
  }

  async updateHRAdminSites(hrAdminId: number, sitesManaged?: string[]): Promise<void> {
    try {
      const hrAdmin = await this.prisma.hR_Admin.findUnique({
        where: { id: hrAdminId },
      });

      if (!hrAdmin) {
        throw new NotFoundException('HR Admin not found');
      }

      await this.prisma.hR_Admin.update({
        where: { id: hrAdminId },
        data: { sitesManaged },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new ConflictException('Failed to update HR admin sites');
    }
  }

  // New method to get all employees by manager
  async getEmployeesByManager(managerId: number) {
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
      throw new NotFoundException('Manager not found');
    }

    return manager.team;
  }

  // New method to get all users by role
  async getUsersByRole(role: Role) {
    return await this.prisma.user.findMany({
      where: { role },
      include: this.getUserInclude(),
    });
  }
}