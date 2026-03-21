import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    getProfile(user: {
        id: number;
    }): Promise<{
        id: number;
        name: string;
        email: string;
    }>;
}
