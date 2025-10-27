import { test, expect, request, Response, APIRequestContext } from "@playwright/test";
import * as dotenv from 'dotenv';
import { PostService } from "../src/services/postService";
import { faker } from "@faker-js/faker";
import { UsersService } from "../src/services/usersService";
import { CreateUserPayload } from "../src/types/userType";
import { CreatePostPayload } from "../src/types/postType";

dotenv.config()

test.describe('Testes de /posts', () => {
    let apiContext: APIRequestContext
    let user: UsersService
    let posts: PostService

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
        posts = new PostService(apiContext)
    })

    test.afterAll(async () => {
        await apiContext.dispose()
    })

    test('CRUD de posts - Cria user, cria post, pega por ID, modifica dados e deleta o post e o user', async () => {
        // Criação de um user para fazer os posts
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

        const payload: CreatePostPayload = {
            user_id: userId,
            title: `Titulo ${faker.lorem.words(3)}`,
            body: faker.lorem.paragraph()
        }

        // Criação de um post
        const createPostResponse = await posts.createPost(payload)
        expect(createPostResponse.status()).toBe(201)
        const createPost = await createPostResponse.json()
        expect(createPost).toMatchObject({
            user_id: userId,
            title: payload.title,
            body: payload.body
        })
        const postId = createPost.id

        // Pega um post a partir do ID
        const getPostResponse = await posts.getPost(postId)
        expect(getPostResponse.status()).toBe(200)
        const getPost = await getPostResponse.json()
        expect(getPost.id).toBe(postId)
        expect(getPost.user_id).toBe(userId)

        // Edita o título do post
        const newTitle = `Titulo ${faker.lorem.words(1)} - Editado`
        const updatePostResponse = await posts.updatePost(postId, {title: newTitle})
        expect(updatePostResponse.status()).toBe(200)
        const updatePost = await updatePostResponse.json()
        expect(updatePost.title).toBe(newTitle)

        // Deleta o pot criado
        const deletePostResponse = await posts.deletePost(postId)
        expect(deletePostResponse.status()).toBe(204)

        // deleta o usuário criado
        const deleteResponse = await user.deleteUser(userId)
        expect(deleteResponse.status()).toBe(204)
    })
})