import { APIRequestContext } from '@playwright/test';
import { CreateUserPayload } from '../types/userType';
import * as dotenv from 'dotenv';

dotenv.config()

const baseUrl = process.env.BASE_URL

export class UsersService {
    private ctx: APIRequestContext;

    constructor(ctx: APIRequestContext) {
        this.ctx = ctx;
    }

    createUser(data: CreateUserPayload) {
        return this.ctx.post(`${baseUrl}/users`, { data });
    }

    getUser(id: number) {
        return this.ctx.get(`${baseUrl}/users/${id}`);
    }
    
    updateUser(id: number, data: Partial<CreateUserPayload>) {
        return this.ctx.patch(`${baseUrl}/users/${id}`, { data });
    }
    
    deleteUser(id: number) {
        return this.ctx.delete(`${baseUrl}/users/${id}`);
    }
}