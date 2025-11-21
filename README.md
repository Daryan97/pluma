# Pluma - Blogging Platform

![Pluma Logo](https://ik.imagekit.io/daryandev/Pluma%20-%20Light%2016:9_EsbqpDdyIv?updatedAt=1756539494268)

A modern, open-source blogging platform built with [Vue 3](https://vuejs.org/) and [Supabase](https://supabase.com/).

## Features

- User authentication and role management (admin, author, reader)
- Post creation, editing, and deletion with rich text support
- Commenting system with moderation capabilities
- Responsive design for mobile and desktop
- SEO-friendly with sitemap and RSS feed generation

## Setup

1. Clone the repository:

    ```bash
    git clone
     cd pluma-frontend
     ```

2. Install dependencies:

     ```bash
     npm install
     ```

3. Copy `example.env` to `.env` and update the Supabase URL, Anon Key and public Site URL (used for sitemap/RSS metadata):

     ```bash
     cp example.env .env
     ```

4. Setup Supabase:

    - This section will be updated very soon.

5. Start the development server:

     ```bash
     npm run dev
     ```

6. Open your browser and navigate to the local server (e.g., `http://localhost:5175`).

### Quick Deployment

For a quick deployment using the published image:

```yaml
services:
     app:
          image: daryan997/pluma:latest
          restart: unless-stopped
          ports:
                - "80:80"
          environment:
                VITE_SITE_URL: "https://pluma.daryandev.com"
                VITE_SUPABASE_URL: "https://supa.daryandev.com"
                VITE_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzUzMzkwODAwLCJleHAiOjE5MTExNTcyMDB9.NkSvG02XqGkV9of_aPEgS-EJGCqPCzzyPWx7ru97Su8"
                VITE_ENV: "production"
```

### Build and Deployment

#### Static hosts

For production deployments on static hosts, build the project and serve the contents of `dist`:

```bash
npm run build
npm run preview
```

#### Docker / Compose

The provided `Dockerfile` builds a multi-architecture image that serves the app with Nginx. At container start-up, the image writes `/usr/share/nginx/html/env`, which allows the frontend to read Supabase credentials and the current environment at runtime (no rebuild required when these values change).

Build and push (adapt the Supabase values to your project):

```bash
docker buildx build \
     --platform linux/amd64,linux/arm64 \
     --build-arg VITE_SUPABASE_URL="https://supabase.example.com" \
     --build-arg VITE_SUPABASE_ANON_KEY="your_supabase_anon_key" \
     --build-arg VITE_ENV="production" \
     --build-arg VITE_SITE_URL="https://blog.example.com" \
     -t your-dockerhub-user/pluma:latest \
     --push .
```

Run it with the Supabase credentials as environment variables (Compose example):

```yaml
version: '3.3'

services:
     app:
          image: your-dockerhub-user/pluma:latest
          restart: unless-stopped
          ports:
                - "80:80"
          environment:
                VITE_SUPABASE_URL: "https://supabase.example.com"
                VITE_SUPABASE_ANON_KEY: "your_supabase_anon_key"
                VITE_ENV: "production"
                VITE_SITE_URL: "https://blog.example.com"
```

The container automatically exposes `/env`, so the frontend can read the runtime values without recompiling.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
