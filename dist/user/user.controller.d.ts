import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateEmployeeDetailsDto } from './dto/update-employee-details.dto';
import { UpdateHRAdminSitesDto } from './dto/update-hr-admin-sites.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAll(): Promise<{
        id: number;
        name: string;
        contactInfo: string;
        site: string;
        role: import(".prisma/client").$Enums.Role;
    }[]>;
    create(createUserDto: CreateUserDto): Promise<{
        id: number;
        name: string;
        contactInfo: string;
        site: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    findOne(id: number): Promise<{
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
                shifts: import("@prisma/client/runtime/library").JsonValue[];
                rotationType: string | null;
            } | null;
            evaluations: {
                id: number;
                managerId: number | null;
                employeeId: number;
                period: import(".prisma/client").$Enums.EvalPeriod;
                scores: import("@prisma/client/runtime/library").JsonValue;
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
                surveyResponses: import("@prisma/client/runtime/library").JsonValue | null;
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
    updateEmployee(employeeId: number, updateEmployeeDetailsDto: UpdateEmployeeDetailsDto): Promise<{
        id: number;
        userId: number;
        managerId: number;
        position: string;
        department: string;
        seniority: number;
        contractStart: Date;
        contractEnd: Date | null;
        contractType: import(".prisma/client").$Enums.ContractType;
    }>;
    updateHRAdminSites(hrAdminId: number, updateHRAdminSitesDto: UpdateHRAdminSitesDto["sitesManaged"]): Promise<void>;
}
