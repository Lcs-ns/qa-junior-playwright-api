import { APIRequestContext } from "@playwright/test";
import * as dotenv from 'dotenv';
import { CreateCommentPayload } from "../types/commentType";

dotenv.config()

const baseUrl = process.env.BASE_URL

export class CommentService {
    private ctx: APIRequestContext

    constructor(ctx: APIRequestContext) {
        this.ctx = ctx
    }

    createComment(data: CreateCommentPayload) {
        return this.ctx.post(`${baseUrl}/comments`, { data })
    }

    getComment(id: number) {
        return this.ctx.get(`${baseUrl}/comments/${id}`)
    }

    updateComment(id: number, data: Partial<CreateCommentPayload>) {
        return this.ctx.patch(`${baseUrl}/comments/${id}`, { data })
    }

    deleteComment(id: number) {
        return this.ctx.delete(`${baseUrl}/comments/${id}`)
    }
}