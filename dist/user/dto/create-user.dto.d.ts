import { ContractType, Role } from '@prisma/client';
export declare class CreateUserDto {
    name: string;
    contactInfo: string;
    site: string;
    role: Role;
    position?: string;
    department?: string;
    seniority?: number;
    contractStart?: string;
    contractEnd?: string;
    contractType?: ContractType;
    managerId?: number;
    sitesManaged?: string[];
}
