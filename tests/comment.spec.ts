import { test, expect, APIRequestContext, request } from '@playwright/test';
import * as dotenv from 'dotenv';
import { UsersService } from '../src/services/usersService';
import { PostService } from '../src/services/postService';
import { CommentService } from '../src/services/commentService';
import { CreateUserPayload } from '../src/types/userType';
import { faker } from '@faker-js/faker';
import { CreatePostPayload } from '../src/types/postType';
import { CreateCommentPayload } from '../src/types/commentType';

dotenv.config()

test.describe('Testes de /comments', () => {
    let apiContext: APIRequestContext
    let user: UsersService
    let post: PostService
    let comment: CommentService

    test.beforeAll(async ({ }) => {
        apiContext = await request.newContext({
            baseURL: process.env.BASE_URL,
            extraHTTPHeaders: {
                Authorization: `Bearer ${process.env.PRIMARY_TOKEN}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })

        user = new UsersService(apiContext)
        post = new PostService(apiContext)
        comment = new CommentService(apiContext)
    })

    test.afterAll(async () => {
        await apiContext.dispose()
    })

    test('CRUD de comment - Cria user, post, e comment, pega por ID, modifica dados e deleta os dados', async () => {
        // Criação de user e post para poder criar um comment e manipular
        const userPayload: CreateUserPayload = {
            name: faker.person.fullName(),
            email: faker.internet.email({ provider: 'example.com' }) + `.${Date.now()}`,
            gender: 'male',
            status: 'active'
        }
        const userResponse = await user.createUser(userPayload)
        expect(userResponse.status()).toBe(201)
        const userResponseJson = await userResponse.json()
        const userId = userResponseJson.id
        const postPayload: CreatePostPayload = {
            user_id: userId,
            title: `Titulo ${faker.lorem.words(3)}`,
            body: faker.lorem.paragraph()
        }
        const createPostResponse = await post.createPost(postPayload)
        expect(createPostResponse.status()).toBe(201)
        const createPost = await createPostResponse.json()
        expect(createPost).toMatchObject({
            user_id: userId,
            title: postPayload.title,
            body: postPayload.body
        })
        const postId = createPost.id

        // Criação de um comment
        const payload: CreateCommentPayload = {
            post_id: postId,
            name: faker.person.fullName(),
            email: faker.internet.email({ provider: 'example.com' }) + `.${Date.now()}`,
            body: 'Teste de comment'
        }
        const createCommentResponse = await comment.createComment(payload)
        expect(createCommentResponse.status()).toBe(201)
        const createComment = await createCommentResponse.json()
        expect(createComment).toMatchObject({
            post_id: postId,
            name: payload.name,
            email: payload.email,
            body: payload.body
        })
        const commentId = createComment.id

        // Pegar comment por id
        const getCommentResponse = await comment.getComment(commentId)
        expect(getCommentResponse.status()).toBe(200)
        const getComment = await getCommentResponse.json()
        expect(getComment.id).toBe(commentId)
        expect(getComment.post_id).toBe(postId)

        // Editar body do comment
        const newBody = 'Comment agora editado'
        const updateCommentResponse = await comment.updateComment(commentId, { body: newBody })
        expect(updateCommentResponse.status()).toBe(200)
        const updateComment = await updateCommentResponse.json()
        expect(updateComment.body).toBe(newBody)

        // Deletar comment, depois deletar post e depois deletar user
        const deleteComment = await comment.deleteComment(commentId)
        expect(deleteComment.status()).toBe(204)

        const deletePost = await post.deletePost(postId)
        expect(deletePost.status()).toBe(204)

        const deleteUser = await user.deleteUser(userId)
        expect(deleteUser.status()).toBe(204)
    })
})