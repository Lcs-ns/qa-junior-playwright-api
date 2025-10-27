import { test, expect, request, APIRequestContext } from "@playwright/test";
import { faker } from "@faker-js/faker";
import * as dotenv from 'dotenv';
import { UsersService } from "../src/services/usersService";
import { CreateUserPayload } from "../src/types/userType";

dotenv.config()

test.describe('Testes de /users', () => {
    let apiContext: APIRequestContext
    let users: UsersService

    test.beforeAll(async ({ }) => {
        apiContext = await request.newContext({
            baseURL: process.env.BASE_URL,
            extraHTTPHeaders: {
                Authorization: `Bearer ${process.env.PRIMARY_TOKEN}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
        users = new UsersService(apiContext)
    })

    test.afterAll(async () => {
        await apiContext.dispose()
    })

    test('CRUD de um user - Cria user, pega por ID, modifica dados e deleta', async () => {
        const userEmail = `${faker.internet.email().split('@')[0]}.${Date.now()}@exemplo.com`
        const payload: CreateUserPayload = {
            name: faker.person.fullName(),
            email: userEmail,
            gender: 'male',
            status: 'active'
        }

        // Cria user
        const createResponse = await users.createUser(payload)
        expect(createResponse.status()).toBe(201)
        const createdUser = await createResponse.json()
        expect(createdUser).toMatchObject({
            name: payload.name,
            email: payload.email,
            gender: payload.gender,
            status: payload.status
        })
        expect(createdUser.id).toBeDefined()
        const userId = createdUser.id as number

        // Pega o user por ID
        const getResponse = await users.getUser(userId)
        expect(getResponse.status()).toBe(200)
        const got = await getResponse.json()
        expect(got.id).toBe(userId)
        expect(got.email).toBe(payload.email)

        // Modifica o nome do user
        const newName = `${payload.name} - nome editado`
        const patchResponse = await users.updateUser(userId, { name: newName })
        expect(patchResponse.status()).toBe(200)
        const patched = await patchResponse.json()
        expect(patched.name).toBe(newName)

        // Deleta user
        const deleteResponse = await users.deleteUser(userId)
        expect(deleteResponse.status()).toBe(204)

        // Verifica se o user deletado ainda existe
        const getDeleteUser = await users.getUser(userId)
        expect(getDeleteUser.status()).toBe(404)
    })
})