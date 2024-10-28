# Travel Destinations

This project is a monorepo workspace containing a vanilla JavaScript frontend and an Express.js API backend for a Travel Destinations application.

## Prerequisites

- Node.js (version >= 18.16.1)
- pnpm (latest version)

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/your-username/travel-destinations.git
   cd travel-destinations
   ```

2. Install dependencies:

   ```
   pnpm install
   ```

3. Start the development servers:

   ```
   pnpm start
   ```

   This will start both the API (http://localhost:3000) and the frontend (http://localhost:8080) concurrently.

## Project Configuration

### Workspaces

This project uses pnpm workspaces. The workspace configuration can be found in:

### Scripts

The following scripts are available in the root `package.json`:

- `pnpm start`: Starts both the API and frontend servers
- `pnpm start:api`: Starts only the API server
- `pnpm start:web`: Starts only the frontend server
- `pnpm lint`: Runs ESLint on all JavaScript files
- `pnpm format`: Runs Prettier to format all files

### Linting and Formatting

This project uses Biome for linting and code formatting. The configurations can be found in:

- `biome.json`: Biome configuration
- `.biomeignore`: Files and directories to be ignored by Biome

You can run linting and formatting using the following commands:
- `pnpm lint`: Runs Biome linter on all files
- `pnpm format`: Runs Biome formatter on all files

## ER Diagrams

### V1 (Basic Version)

![ER Diagram V1](/assets/ER-Diagram-v1.png)

This initial version of the ER diagram for the Travel Destinations project meets the minimum requirements, depicting a simple relationship between users and destinations. It shows a one-to-many relationship where one user can have multiple destinations.

### V2 (For mongo : No-Normlaization)
![ER Diagram V2](/assets/ER-Diagram-v2.png)

The second version of the ER diagram is designed for MongoDB without normalization. This version is intended to be implemented within our final submission. The digram shows a one to many for users to trips, and a many to many for the trips to destinations. The destinations array in the trips table also holds an array of destination_id's 

### V3 (For SQL : Normalized)

![ER Diagram V3](/assets/ER-Diagram-v3.png)

The third version of the ER diagram is tailored for SQL databases with normalization considerations. This version includes normalized tables to reduce redundancy and improve data integrity. It hold similar strucutre to v2 but introduces a join table called `TripDestinations` that contains `trip_id` and `destination_id` to establish a many-to-many relationship between trips and destinations.

## Docker

This project is containerized using Docker, allowing for easy deployment and consistent environments across different systems. Below is a detailed explanation of how we containerize and run our Travel Destinations application.

### Project Structure

Our project uses a multi-container setup with Docker Compose. The main components are:

1. API (Express.js backend)
2. Web (Vanilla JavaScript frontend)

Each component has its own Dockerfile, and we use a `docker-compose.yml` file to orchestrate the containers.

### Dockerfiles

#### API Dockerfile

The API Dockerfile is located at `apps/api/Dockerfile`:

#### Web Dockerfile

The Web Dockerfile is located at `apps/web/Dockerfile`:

This Dockerfile sets up the environment for the Web frontend, installs dependencies, and starts the development server.

### Docker Compose

We use Docker Compose to define and run our multi-container application. The `docker-compose.yml` file is located in the root directory:

This Docker Compose file defines two services: `api` and `web`. It sets up the build context, port mappings, environment variables, volumes for live code reloading, and a shared network for inter-container communication.

### Running the Containerized Application

To run the containerized application, follow these steps:

1. Ensure you have Docker and Docker Compose installed on your system.

2. Navigate to the root directory of the project where the `docker-compose.yml` file is located.

3. Build and start the containers:

   ```
   docker-compose up --build
   ```

   This command will build the Docker images (if they haven't been built before or if there are changes) and start the containers.

4. Once the containers are up and running, you can access:
   - The API at `http://localhost:3000`
   - The Web frontend at `http://localhost:8080`

5. To stop the containers, use:

   ```
   docker-compose down
   ```

### Development Workflow with Docker

When developing with Docker:

1. Changes to the code in `apps/api` and `apps/web` will be reflected in real-time due to the volume mounts.

2. If you need to add new dependencies:
   - Stop the containers
   - Add the dependency to the respective `package.json` file
   - Rebuild and start the containers: `docker-compose up --build`

3. To run commands inside a container:
   ```
   docker-compose exec api pnpm your-command
   docker-compose exec web pnpm your-command
   ```

4. To view logs:
   ```
   docker-compose logs api
   docker-compose logs web
   ```

### Production Deployment

For production deployment:

1. Update the Dockerfiles to use production builds (e.g., `CMD ["pnpm", "start"]` instead of `CMD ["pnpm", "dev"]`).

2. Create a `docker-compose.prod.yml` file with production-specific configurations.

3. Build and run the production containers:
   ```
   docker-compose -f docker-compose.prod.yml up --build
   ```

### Benefits of Dockerization

- Consistent development environment across team members
- Easy setup for new developers
- Simplified deployment process
- Isolation of services
- Scalability and portability

By containerizing our Travel Destinations application, we ensure a consistent and reproducible environment for development, testing, and production deployment.

### Docker Desktop

![Docker Images](/assets/docker-image.png)

The image above shows the Docker Desktop interface with the Travel Destinations API and Web images. These images are built from the Dockerfiles in the respective directories and can be run as containers using Docker Compose.

![Docker Container](/assets/docker-container-v1.png)

The image above shows the running containers for the Travel Destinations API and Web services. These containers are isolated environments that run the application components and can be accessed through the specified ports.

![Docker Container](/assets/docker-container-v2.png)

### Git Hooks

We use Husky for Git hooks and lint-staged for running linters on staged files before committing. The configuration can be found in the root `package.json`:

## Development Workflow

1. Make your changes in the respective `apps/api` or `apps/web` directories.
2. Stage your changes: `git add .`
3. Commit your changes: `git commit -m "Your commit message"`
   - This will trigger the pre-commit hook, running linters and formatters on staged files.
4. Push your changes: `git push`
5. Please NEVER push to main, and always make sure to create a new branch and make a pull request.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

Developers: Patrick, Digna, Frej, Kengo

