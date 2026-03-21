import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: number;
            name: string;
            email: string;
        };
        access_token: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: number;
            name: string;
            email: string;
        };
        access_token: string;
    }>;
    getProfile(userId: number): Promise<{
        id: number;
        name: string;
        email: string;
    }>;
    private generateToken;
}
