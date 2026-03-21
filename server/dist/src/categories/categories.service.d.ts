import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: number): Promise<{
        id: number;
        name: string;
        color: string;
        icon: string;
        userId: number | null;
        createdAt: Date;
    }[]>;
    create(userId: number, dto: CreateCategoryDto): Promise<{
        id: number;
        name: string;
        color: string;
        icon: string;
        userId: number | null;
        createdAt: Date;
    }>;
    update(id: number, userId: number, dto: UpdateCategoryDto): Promise<{
        id: number;
        name: string;
        color: string;
        icon: string;
        userId: number | null;
        createdAt: Date;
    }>;
    remove(id: number, userId: number): Promise<{
        id: number;
        name: string;
        color: string;
        icon: string;
        userId: number | null;
        createdAt: Date;
    }>;
}
