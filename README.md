```markdown
# NestJS Backend Test Task

A RESTful API service built with NestJS, TypeScript, Prisma, and GraphQL, supporting user registration, standard login, and biometric login with JWT-based authentication.

## Prerequisites
- Node.js (v16+)
- npm
- Docker

## Setup
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd nestjs-backend-test
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
   Ensure the following dependencies are installed:
   - `@nestjs/core`, `@nestjs/common`, `@nestjs/graphql`, `@nestjs/apollo`, `graphql`, `apollo-server-express`
   - `prisma`, `@prisma/client`
   - `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`
   - `bcrypt`
   - Dev dependencies: `@types/bcrypt`, `@types/passport-jwt`
3. **Set up environment variables**:
   - Copy `.env.example` to `.env` and update values as needed.
4. **Start PostgreSQL with Docker**:
   ```bash
   docker-compose up -d
   ```
5. **Run Prisma migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```
6. **Start the application**:
   ```bash
   npm run start:dev
   ```
   This will generate the GraphQL schema file at `src/schema.graphql`.

## GraphQL Endpoint
- Access the GraphQL playground at `http://localhost:3000/graphql`(or the forwarded URL in GitHub Codespaces).

## Example Queries/Mutations
- **Get User**:
  ```graphql
  query {
    getUser(email: "user@example.com") {
      id
      email
      createdAt
      updatedAt
    }
  }
  ```
- **Register**:
  ```graphql
  mutation {
    register(input: { email: "user@example.com", password: "password123", biometricKey: "biometric123" })
  }
  ```
- **Login**:
  ```graphql
  mutation {
    login(input: { email: "user@example.com", password: "password123" })
  }
  ```
- **Biometric Login**:
  ```graphql
  mutation {
    biometricLogin(input: { biometricKey: "biometric123" })
  }
  ```

## Testing
- Run unit tests:
  ```bash
  npm run test
  ```