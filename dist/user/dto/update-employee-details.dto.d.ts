import { ContractType } from '@prisma/client';
export declare class UpdateEmployeeDetailsDto {
    position?: string;
    department?: string;
    seniority?: number;
    contractEnd?: Date;
    contractType?: ContractType;
    managerId?: number;
}
