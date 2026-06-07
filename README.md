# E-commerce Application

Welcome to the MERN Stack E-commerce Application repository. This project is built using MongoDB, Express.js, React, and Node.js.

---

## 🛠️ Project Architecture & Design Docs

Before beginning development, we have established the project architecture, database models, and workflows. Click on any of the sections below to read the detailed design documentation:

*   **[Project Architecture Index](project_architecture.md)** ([Local file:// Link](file:///d:/PROJECTS/E-commerce%20Application/project_architecture.md))
    *   **[Technical Architecture](docs/technical_architecture.md)** ([Local file:// Link](file:///d:/PROJECTS/E-commerce%20Application/docs/technical_architecture.md)) - MERN stack design layout.
    *   **[Entity Relationship (ER) Diagram](docs/er_diagram.md)** ([Local file:// Link](file:///d:/PROJECTS/E-commerce%20Application/docs/er_diagram.md)) - Database schema relationships and Mongoose models.
    *   **[E-commerce Features](docs/features.md)** ([Local file:// Link](file:///d:/PROJECTS/E-commerce%20Application/docs/features.md)) - Complete list of user and admin features.
    *   **[Roles & Responsibilities](docs/roles_responsibilities.md)** ([Local file:// Link](file:///d:/PROJECTS/E-commerce%20Application/docs/roles_responsibilities.md)) - Role-Based Access Control (RBAC) permissions.
    *   **[User Flows](docs/user_flow.md)** ([Local file:// Link](file:///d:/PROJECTS/E-commerce%20Application/docs/user_flow.md)) - User checkout sequence flow and payment flows.
    *   **[MVC Pattern Mapping](docs/mvc_pattern.md)** ([Local file:// Link](file:///d:/PROJECTS/E-commerce%20Application/docs/mvc_pattern.md)) - Model-View-Controller structure definition.
*   **[E-commerce UI Walkthrough](walkthrough.md)** - Walkthrough guide showing full screenshot tours of the user interfaces.

## 🔗 Live Demo

You can access the live demo of the application here:
👉 **[ShopEZ Live Demo (Vercel)](https://e-commerce-application-neon-five.vercel.app/)**

*   **Frontend Client**: [https://e-commerce-application-neon-five.vercel.app/](https://e-commerce-application-neon-five.vercel.app/)
*   **Backend Server**: [https://shopez-api-c30e.onrender.com](https://shopez-api-c30e.onrender.com)

### 🔑 Test Accounts & Credentials
You can log in and test the application features using these pre-seeded accounts:

*   **Administrator Account (Full CRUD & Orders Access)**:
    *   **Email**: `admin@shopez.com`
    *   **Password**: `adminpassword123`
*   **Customer Account (Add to Cart & Checkout)**:
    *   *You can register any new account on the Sign Up page, or use:*
    *   **Email**: `test@email.com`
    *   **Password**: `password123`

---

## 📋 Project Subtasks Implementation Matrix

Here is how each milestone card from your project portal is implemented in this repository:

### 📁 1. Project Architecture
*   **ER Diagram** ➔ Documented with Mongoose schema structures in [er_diagram.md](docs/er_diagram.md) ([file:// Link](file:///d:/PROJECTS/E-commerce%20Application/docs/er_diagram.md)).
*   **Features** ➔ Full specification of guest, customer, and admin capabilities in [features.md](docs/features.md) ([file:// Link](file:///d:/PROJECTS/E-commerce%20Application/docs/features.md)).
*   **Roles & Responsibilities** ➔ RBAC middleware checks and permissions matrix outlined in [roles_responsibilities.md](docs/roles_responsibilities.md) ([file:// Link](file:///d:/PROJECTS/E-commerce%20Application/docs/roles_responsibilities.md)).
*   **User Flow** ➔ Checkout, stock validation, and payment API sequence mapped in [user_flow.md](docs/user_flow.md) ([file:// Link](file:///d:/PROJECTS/E-commerce%20Application/docs/user_flow.md)).
*   **MVC Pattern** ➔ Description of client-server decoupling into Model-View-Controller in [mvc_pattern.md](docs/mvc_pattern.md) ([file:// Link](file:///d:/PROJECTS/E-commerce%20Application/docs/mvc_pattern.md)).

### ⚙️ 2. Project Setup & Configuration
*   **Creating Project Folder** ➔ Initialized decoupled [client/](client) and [server/](server) workspaces.
*   **Client Setup** ➔ Scaffolded Vite-React client, installed Router, Axios, and Lucide libraries, and configured global styles resets.
*   **Server Setup** ➔ Initialized package config dependencies, Express server, and Nodemon hot-reload configurations.

### 💻 3. Backend Development
*   **Backend Structure** ➔ Created controllers ([controllers/](server/controllers)), routes ([routes/](server/routes)), schemas/models ([models/](server/models)), and auth middleware ([middleware/](server/middleware)).
*   **Development and Execution** ➔ Built REST endpoints for user authentication, product listings, and order tracking. Hosted on Render: [https://shopez-api-c30e.onrender.com](https://shopez-api-c30e.onrender.com).

### 🗄️ 4. Database Development
*   **Configure MongoDB** ➔ Configured connection string in [server/.env](server/.env) targeting your remote **MongoDB Atlas cloud database cluster**.
*   **Create Database Collections** ➔ Collections created for `users`, `products`, `orders`, and `carts`.
*   **Create Schema and Models** ➔ Implemented in [Schema.js](server/Schema.js) using ES6 schemas syntax.

### 🎨 5. Frontend Development
*   **Frontend Structure** ➔ Divided into auth state layers ([AuthContext.jsx](client/src/context/AuthContext.jsx)), cart context ([CartContext.jsx](client/src/context/CartContext.jsx)), components ([components/](client/src/components)), and router page pathways.
*   **Development and Execution** ➔ Designed layout views (Home catalog, searching, categories filters, product details, sizes selectors, shipping totals) and the dark-themed Admin Dashboard ([AdminDashboard.jsx](client/src/pages/AdminDashboard.jsx)). Hosted on Vercel: [https://e-commerce-application-neon-five.vercel.app/](https://e-commerce-application-neon-five.vercel.app/).

### 🚀 6. Project Execution
*   **Steps For Execution** ➔ Detailed run guides outlined below.
*   **Demo Screenshots** ➔ Captured 6 UI screenshots inside the [/screenshots](screenshots) directory and documented in [walkthrough.md](walkthrough.md).
*   **Drive Links (Deployed URLs)** ➔ Deployed links mapped directly under the [Live Demo](#-live-demo) section.

---

## 🚀 How to Run Locally (Steps for Execution)

Follow these steps to run both the server and client locally:

### 1. Configure Environmental Variables
Inside the `server` folder, create a `.env` file (which is git-ignored) and add:
```env
PORT=8000
MONGO_URI=mongodb+srv://myAtlasDBUser:8oS9VguGPNblp34x@ac-tidroey-shard-00-00.mj29o7m.mongodb.net:27017,ac-tidroey-shard-00-01.mj29o7m.mongodb.net:27017,ac-tidroey-shard-00-02.mj29o7m.mongodb.net:27017/shopez?ssl=true&replicaSet=atlas-qop2mc-shard-0&authSource=admin
JWT_SECRET=shopez_secret_key_998877
```

### 2. Start Backend API Server
```bash
cd server
npm install
npm run dev
```
*(The server will start running on http://localhost:8000)*

### 3. Seed Mock Products & Admin Profile
```bash
cd server
npm run seed
```

### 4. Start Frontend Client App
```bash
cd client
npm install
npm run dev
```
*(The React app will open on http://localhost:5173)*

