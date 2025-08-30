# Pluma - Blogging Platform

![Pluma Logo](https://ik.imagekit.io/daryandev/Pluma%20-%20Light%2016:9_EsbqpDdyIv?updatedAt=1756539494268)

A modern, open-source blogging platform built with [Vue 3](https://vuejs.org/) and [Supabase](https://supabase.com/).

## Features

- User authentication and role management (admin, author, reader)
- Post creation, editing, and deletion with rich text support
- Commenting system with moderation capabilities
- Responsive design for mobile and desktop

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

3. Copy `example.env` to `.env` and update the Supabase URL and Anon Key:

    ```bash
    cp example.env .env
    ```

4. Setup Supabase:

   - This section will be updated very soon.

6. Start the development server:

    ```bash
    npm run dev
    ```

7. Open your browser and navigate to `http://localhost:5137`.

## Deployment

For production deployment, build the project and serve the static files:

```bash
npm run build
npm run preview
```

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
