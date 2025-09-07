import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma, Role, User, Employee } from '@prisma/client';
import { UpdateEmployeeDetailsDto } from './dto/update-employee-details.dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    getAll(): Promise<{
        id: number;
        name: string;
        contactInfo: string;
        site: string;
        role: import(".prisma/client").$Enums.Role;
    }[]>;
    create(createUserDto: CreateUserDto): Promise<User>;
    findUserWithRelations(userId: number): Promise<{
        employee: ({
            manager: {
                user: {
                    id: number;
                    name: string;
                    contactInfo: string;
                };
            } & {
                id: number;
                userId: number;
            };
            documents: {
                id: number;
                fileName: string;
                type: string;
                uploadDate: Date;
                content: Uint8Array;
                employeeId: number | null;
                candidateId: number | null;
                applicationId: number | null;
            }[];
            leaves: {
                id: number;
                managerId: number | null;
                type: import(".prisma/client").$Enums.LeaveType;
                employeeId: number;
                hrAdminId: number | null;
                startDate: Date;
                endDate: Date;
                status: import(".prisma/client").$Enums.LeaveStatus;
                balanceRemaining: number;
            }[];
            schedule: {
                id: number;
                employeeId: number;
                shifts: Prisma.JsonValue[];
                rotationType: string | null;
            } | null;
            evaluations: {
                id: number;
                managerId: number | null;
                employeeId: number;
                period: import(".prisma/client").$Enums.EvalPeriod;
                scores: Prisma.JsonValue;
                achievements: string | null;
                improvements: string | null;
                goals: string[];
                selfEval: boolean;
            }[];
            trainings: {
                id: number;
                managerId: number | null;
                type: import(".prisma/client").$Enums.TrainingType;
                employeeId: number;
                title: string;
                completionDate: Date | null;
                certification: string | null;
            }[];
            payments: {
                id: number;
                employeeId: number;
                hrAdminId: number | null;
                baseSalary: number;
                bonuses: number | null;
                primes: number | null;
                payslipDate: Date;
            }[];
            departure: {
                id: number;
                employeeId: number;
                hrAdminId: number | null;
                reason: import(".prisma/client").$Enums.DepartureReason;
                exitDate: Date;
                indemnity: number | null;
                surveyResponses: Prisma.JsonValue | null;
            } | null;
        } & {
            id: number;
            userId: number;
            managerId: number;
            position: string;
            department: string;
            seniority: number;
            contractStart: Date;
            contractEnd: Date | null;
            contractType: import(".prisma/client").$Enums.ContractType;
        }) | null;
        manager: ({
            team: ({
                user: {
                    id: number;
                    name: string;
                    contactInfo: string;
                };
            } & {
                id: number;
                userId: number;
                managerId: number;
                position: string;
                department: string;
                seniority: number;
                contractStart: Date;
                contractEnd: Date | null;
                contractType: import(".prisma/client").$Enums.ContractType;
            })[];
        } & {
            id: number;
            userId: number;
        }) | null;
        hrAdmin: {
            id: number;
            userId: number;
            sitesManaged: string[];
        } | null;
        recruiter: ({
            jobPostings: {
                id: number;
                site: string;
                department: string;
                status: import(".prisma/client").$Enums.PostingStatus;
                title: string;
                description: string;
                recruiterId: number;
            }[];
            applications: {
                id: number;
                candidateId: number;
                status: import(".prisma/client").$Enums.ApplicationStatus;
                recruiterId: number | null;
                postingId: number;
            }[];
        } & {
            id: number;
            userId: number;
        }) | null;
        sentMessages: {
            id: number;
            content: string;
            recruiterId: number | null;
            senderId: number;
            receiverId: number;
            timestamp: Date;
        }[];
        receivedMessages: {
            id: number;
            content: string;
            recruiterId: number | null;
            senderId: number;
            receiverId: number;
            timestamp: Date;
        }[];
    } & {
        id: number;
        name: string;
        contactInfo: string;
        site: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    private getUserInclude;
    private createRoleSpecificRecord;
    assignEmployeeToManager(employeeId: number, managerId: number): Promise<void>;
    updateEmployeeDetails(employeeId: number, details: UpdateEmployeeDetailsDto): Promise<Employee>;
    updateHRAdminSites(hrAdminId: number, sitesManaged?: string[]): Promise<void>;
    getEmployeesByManager(managerId: number): Promise<({
        user: {
            id: number;
            name: string;
            contactInfo: string;
            site: string;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        id: number;
        userId: number;
        managerId: number;
        position: string;
        department: string;
        seniority: number;
        contractStart: Date;
        contractEnd: Date | null;
        contractType: import(".prisma/client").$Enums.ContractType;
    })[]>;
    getUsersByRole(role: Role): Promise<({
        employee: ({
            manager: {
                user: {
                    id: number;
                    name: string;
                    contactInfo: string;
                };
            } & {
                id: number;
                userId: number;
            };
            documents: {
                id: number;
                fileName: string;
                type: string;
                uploadDate: Date;
                content: Uint8Array;
                employeeId: number | null;
                candidateId: number | null;
                applicationId: number | null;
            }[];
            leaves: {
                id: number;
                managerId: number | null;
                type: import(".prisma/client").$Enums.LeaveType;
                employeeId: number;
                hrAdminId: number | null;
                startDate: Date;
                endDate: Date;
                status: import(".prisma/client").$Enums.LeaveStatus;
                balanceRemaining: number;
            }[];
            schedule: {
                id: number;
                employeeId: number;
                shifts: Prisma.JsonValue[];
                rotationType: string | null;
            } | null;
            evaluations: {
                id: number;
                managerId: number | null;
                employeeId: number;
                period: import(".prisma/client").$Enums.EvalPeriod;
                scores: Prisma.JsonValue;
                achievements: string | null;
                improvements: string | null;
                goals: string[];
                selfEval: boolean;
            }[];
            trainings: {
                id: number;
                managerId: number | null;
                type: import(".prisma/client").$Enums.TrainingType;
                employeeId: number;
                title: string;
                completionDate: Date | null;
                certification: string | null;
            }[];
            payments: {
                id: number;
                employeeId: number;
                hrAdminId: number | null;
                baseSalary: number;
                bonuses: number | null;
                primes: number | null;
                payslipDate: Date;
            }[];
            departure: {
                id: number;
                employeeId: number;
                hrAdminId: number | null;
                reason: import(".prisma/client").$Enums.DepartureReason;
                exitDate: Date;
                indemnity: number | null;
                surveyResponses: Prisma.JsonValue | null;
            } | null;
        } & {
            id: number;
            userId: number;
            managerId: number;
            position: string;
            department: string;
            seniority: number;
            contractStart: Date;
            contractEnd: Date | null;
            contractType: import(".prisma/client").$Enums.ContractType;
        }) | null;
        manager: ({
            team: ({
                user: {
                    id: number;
                    name: string;
                    contactInfo: string;
                };
            } & {
                id: number;
                userId: number;
                managerId: number;
                position: string;
                department: string;
                seniority: number;
                contractStart: Date;
                contractEnd: Date | null;
                contractType: import(".prisma/client").$Enums.ContractType;
            })[];
        } & {
            id: number;
            userId: number;
        }) | null;
        hrAdmin: {
            id: number;
            userId: number;
            sitesManaged: string[];
        } | null;
        recruiter: ({
            jobPostings: {
                id: number;
                site: string;
                department: string;
                status: import(".prisma/client").$Enums.PostingStatus;
                title: string;
                description: string;
                recruiterId: number;
            }[];
            applications: {
                id: number;
                candidateId: number;
                status: import(".prisma/client").$Enums.ApplicationStatus;
                recruiterId: number | null;
                postingId: number;
            }[];
        } & {
            id: number;
            userId: number;
        }) | null;
        sentMessages: {
            id: number;
            content: string;
            recruiterId: number | null;
            senderId: number;
            receiverId: number;
            timestamp: Date;
        }[];
        receivedMessages: {
            id: number;
            content: string;
            recruiterId: number | null;
            senderId: number;
            receiverId: number;
            timestamp: Date;
        }[];
    } & {
        id: number;
        name: string;
        contactInfo: string;
        site: string;
        role: import(".prisma/client").$Enums.Role;
    })[]>;
}
