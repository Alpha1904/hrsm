import { Role } from '@prisma/client';
export declare class UserQueryDto {
    site?: string;
    role?: Role;
    search?: string;
    page?: number;
    limit?: number;
}
