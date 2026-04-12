# Step Up Shoe Store Management System

A comprehensive **Shoe Store Management System** designed to streamline the operations of a shoe store. The system is user-friendly and packed with features to efficiently manage various aspects of store management.

## Features

### 1. **Item Management**

- Add, update, and delete items.
- Manage inventory and stock levels.

### 2. **Customer Management**

- Maintain customer records.
- Search and retrieve customer information quickly.

### 3. **Order Management**

- Place new orders.
- Track and manage existing orders.

### 4. **User Management**

- Add and manage system users.
- Assign roles and permissions.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- PostgreSQL database (or Neon database account)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/malintha-induwara/shoe-store-next.git
   ```
2. Navigate to the project directory:
   ```bash
   cd shoe-store-next
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Generate an authentication secret:
   ```bash
   openssl rand -base64 32
   ```
3. Add the generated secret to your `.env` file:
   ```bash
   AUTH_SECRET=your_generated_secret
   AUTH_URL=http://localhost:3000/api/auth
   ```

### Setting up Neon Database

1. Create an account at [Neon](https://neon.tech/)
2. Create a new project and database
3. In your project dashboard, find the connection details
4. Add the following to your `.env` file:
   ```bash
   POSTGRES_USER=your_neon_user
   POSTGRES_HOST=your_neon_host
   POSTGRES_PASSWORD=your_neon_password
   POSTGRES_DATABASE=your_neon_database
   POSTGRES_URL_NON_POOLING=postgres://your_neon_user:your_neon_password@your_neon_host/your_neon_database
   POSTGRES_PRISMA_URL=postgres://your_neon_user:your_neon_password@your_neon_host/your_neon_database?pgbouncer=true&connect_timeout=15
   POSTGRES_URL_NO_SSL=postgres://your_neon_user:your_neon_password@your_neon_host/your_neon_database
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
2. Access the application in your browser:
   ```
   http://localhost:3000
   ```

## Technology Stack

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)

[![React](https://img.shields.io/badge/React-black?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)

[![TypeScript](https://img.shields.io/badge/TypeScript-black?style=for-the-badge&logo=typescript&logoColor=007ACC)](https://www.typescriptlang.org/)

[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-black?style=for-the-badge&logo=tailwind-css&logoColor=38B2AC)](https://tailwindcss.com/)

[![Zod](https://img.shields.io/badge/Zod-black?style=for-the-badge&logo=zod&logoColor=3E67B1)](https://github.com/colinhacks/zod)

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-black?style=for-the-badge&logo=postgresql&logoColor=4169E1)](https://www.postgresql.org/)

[![Recharts](https://img.shields.io/badge/Recharts-black?style=for-the-badge&logo=recharts&logoColor=FF7300)](https://recharts.org/)

[![Lucide React](https://img.shields.io/badge/Lucide_React-black?style=for-the-badge&logo=lucide&logoColor=FF5C5C)](https://lucide.dev/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
