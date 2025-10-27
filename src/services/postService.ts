import { APIRequestContext } from "@playwright/test";
import * as dotenv from 'dotenv'
import { CreatePostPayload } from "../types/postType";

dotenv.config()

const baseUrl = process.env.BASE_URL

export class PostService {
    private ctx: APIRequestContext

    constructor(ctx: APIRequestContext) {
        this.ctx = ctx
    }

    createPost(data: CreatePostPayload) {
        return this.ctx.post(`${baseUrl}/posts`, { data })
    }

    getPost(id: number) {
        return this.ctx.get(`${baseUrl}/posts/${id}`)
    }

    updatePost(id: number, data: Partial<CreatePostPayload>) {
        return this.ctx.patch(`${baseUrl}/posts/${id}`, { data })
    }

    deletePost(id: number) {
        return this.ctx.delete(`${baseUrl}/posts/${id}`)
    }
}