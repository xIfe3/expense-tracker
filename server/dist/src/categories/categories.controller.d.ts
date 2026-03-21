import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(user: {
        id: number;
    }): Promise<{
        id: number;
        name: string;
        color: string;
        icon: string;
        userId: number | null;
        createdAt: Date;
    }[]>;
    create(user: {
        id: number;
    }, dto: CreateCategoryDto): Promise<{
        id: number;
        name: string;
        color: string;
        icon: string;
        userId: number | null;
        createdAt: Date;
    }>;
    update(user: {
        id: number;
    }, id: number, dto: UpdateCategoryDto): Promise<{
        id: number;
        name: string;
        color: string;
        icon: string;
        userId: number | null;
        createdAt: Date;
    }>;
    remove(user: {
        id: number;
    }, id: number): Promise<{
        id: number;
        name: string;
        color: string;
        icon: string;
        userId: number | null;
        createdAt: Date;
    }>;
}
