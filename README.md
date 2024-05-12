# Agence Client Portal

## Description

Agence Client Portal is a web application built with Next.js and expressjs for managing clients and their data.

## Features

- Authentication using NextAuth.js
- Client management
- Data visualization with charts powered by Tremor
- Integration with Firebase for real-time updates and cloud storage
- Prisma used as ORM for database access
- PostgreSQL database hosted on Vercel
- Firestore used for notifications and chats
- Express js for backend

## Installation

1. Clone the repository from the `dev` branch
2. Switch folder `nextjs` for frontend or `express` for backend
3. Install dependencies: `npm install`
4. Check environment variables (see `.env`)
5. Run prisma: `npx prisma generate`
6. Run the development server: `npm run dev`

## Usage

1. Sign up or log in to access the client portal.
2. Add, update, or delete clients and their information.
3. View data visualizations to gain insights into client data.
4. Receive real-time updates and notifications via Firebase.
5. Utilize cloud storage for file uploads and management.

## Technologies Used

- Next.js as a React framework
- Express.js as a Node backend framework
- Tailwind CSS for styling
- Prisma as ORM for database access
- PostgreSQL database hosted on Vercel
- Firebase Cloud Storage for file storage
- Firestore for real-time updates, notifications, and chats
- NextAuth.js for authentication
- Tremor for data visualization
- Vercel for nextjs deployment
- Render for expressjs deployment

## Contributing

To contribute on the project, here is the procedure to follow:

1. When there is a need to work on a task, please create a new branch from the `dev` branch.
2. Make your changes and commit them to this new branch.
3. Next, create a pull request to merge your changes with the `dev` branch.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For questions or support, please contact [contact@bertinselendo.com](mailto:contact@bertinselendo.com).
