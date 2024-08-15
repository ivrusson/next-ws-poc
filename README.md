# next-ws-poc

## Overview

`next-ws-poc` is a Next.js application demonstrating various modern technologies and practices, including:

- **Next.js App Router**: A powerful router provided by Next.js.
- **SQLite**: A lightweight database stored in the file system.
- **Drizzle ORM**: An ORM for interacting with the SQLite database.
- **next-ws**: A library for handling WebSocket connections in Next.js.

## Getting Started

### Prerequisites

- Node.js (version 14.x or higher)
- Yarn (version 1.x)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/next-ws-poc.git
   cd next-ws-poc
   ```

2. Install the dependencies:
  ```sh
   git clone https://github.com/yourusername/next-ws-poc.git
   cd next-ws-poc
   ```

3. Configure the database URL in the .env.local file:
   ```sh
   DB_URL='sample.db' # Replace with your database file path
   ```
You can use the .env.example file as a template.
The .env.local file is ignored by Git, so you can keep your database URL secret.
By default, the database file is stored in the root directory of the project.
In production, the database file should be stored in the .next/standalone directory.

4. Scripts
The following scripts can be found in the package.json file. You can run them using yarn run <script-name>.

- **dev**: Starts the development server.
- **build**: Builds the application for production.
- **start**: Starts the production server. Make sure to run build before start.
- **deploy**: Builds the application, copies necessary static files, and prepares the standalone server folder for deployment.
- **lint**: Runs the Next.js linter to check for code errors and style issues.
- **db:init**: Initializes the database schema using Drizzle ORM.
- **db:migrate**: Runs database migrations using Drizzle ORM.
- **db:studio**: Starts Drizzle ORM's database studio for managing and querying your database visually.
- **postinstall**: Runs the next-ws-cli to patch the project for WebSocket support after dependencies are installed.

## Technologies Used

### Next.js
Next.js is a React framework that enables several extra features, including server-side rendering and generating static websites. For more information, visit the [Next.js documentation](https://nextjs.org/docs).

### SQLite
SQLite is a C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine. It is the most widely deployed database engine in the world. For more information, visit the [SQLite documentation](https://www.sqlite.org/docs.html) and [better-sqlite documentation](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md).

### Drizzle ORM
Drizzle ORM is a lightweight and type-safe ORM for TypeScript and JavaScript applications. It provides an easy way to interact with SQL databases. For more information, visit the [Drizzle ORM documentation](https://orm.drizzle.team/docs/overview).

### next-ws
next-ws is a library for handling WebSocket connections in Next.js applications. It simplifies the process of setting up and managing WebSocket servers. For more information, visit the [next-ws documentation](https://github.com/apteryxxyz/next-ws).

## Configuration
This project uses environment variables for different configurations. Create a .env.local file in the root directory of the project and add the relevant variables.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request with any features, bug fixes, or improvements.

## Support
For support, please open an issue in the GitHub repository.