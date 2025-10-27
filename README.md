# QA Júnior Playwright API

## Descrição
Projeto de automação de testes de API utilizando o framework Playwright. Os testes cobrem os principais endpoints do site [GoRest](https://gorest.co.in/), validando operações CRUD (GET, POST, PUT, DELETE) para `/users`, `/posts` e `/comments`.

Foi utilizado o padrão **Service Object Model** para organizar a lógica de acesso aos endpoints, facilitando a manutenção e reutilização dos serviços de API.

## Tecnologias Utilizadas
- [Playwright](https://playwright.dev/)
- TypeScript
- [Faker](https://fakerjs.dev/) para geração de dados dinâmicos
- Dotenv para gerenciamento de variáveis de ambiente

## Estrutura dos Testes
Os testes estão organizados na pasta `tests/` e cobrem os seguintes cenários para cada endpoint:

- **GET**: Valida o status code e a estrutura dos dados retornados.
- **POST**: Cria um novo registro, valida o status code, a estrutura dos dados e verifica se o registro aparece em uma consulta GET subsequente.
- **PUT**: Atualiza um registro existente e valida as alterações.
- **DELETE**: Remove um registro e valida que ele não aparece mais nas consultas subsequentes.

### Endpoints Testados
- `/users`
- `/posts`
- `/comments`

## Como Executar os Testes
1. Instale as dependências:
	```bash
	npm install
	```
2. Configure o arquivo `.env` com a URL base e o token de autenticação:
	```env
	BASE_URL=https://gorest.co.in/public/v2
	PRIMARY_TOKEN=token_aqui
	```
3. Execute os testes:
	```bash
	npx playwright test
	```
4. Para visualizar o relatório HTML:
	```bash
	npx playwright show-report
	```