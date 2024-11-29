# Musik Samspil

A modern web application for managing music ensembles built with React and NestJS.

## Project Overview

This project is a monorepo workspace containing:
- Frontend: React application with TypeScript and Tailwind CSS
- Backend: NestJS API with TypeScript

## Prerequisites

- Node.js (version >= 18.16.1)
- pnpm (latest version)
- Docker and Docker Compose (for containerized development)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Musik-Samspil-Case.git
   cd Musik-Samspil-Case
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both `apps/web` and `apps/server` directories
   - Update the variables as needed

4. Start the development server & application:

   With Docker:
   ```bash
   pnpm dev:docker
   ```         

   Without Docker:
   ```bash
   pnpm dev
   ```

   The applications will be available at:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## Project Structure

Monorepo setup using pnpm workspaces.

- `apps/web`: React client application with TypeScript and Tailwind CSS
- `apps/server`: NestJS server application with TypeScript

## Development Workflow

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Commit your changes (this will trigger pre-commit hooks):
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

3. Push your changes and create a pull request:
   ```bash
   git push origin feature/your-feature-name
   ```

## Contributing as external contributor

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
