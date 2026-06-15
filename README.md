# ShopEZ — MERN Stack E-commerce Application

Welcome to the **ShopEZ** repository! This is a production-grade, full-stack e-commerce application built using the **MERN** stack (MongoDB, Express.js, React, Node.js). 

---

## 🔗 Live Demo & Test Credentials

You can access the live deployment of the application:
* 🌐 **[ShopEZ Web Application (Vercel)](https://e-commerce-application-neon-five.vercel.app/)**
* ⚙️ **[Backend REST API (Render)](https://shopez-api-c30e.onrender.com)**

### 🔑 Pre-seeded Test Accounts

* **Administrator Account (Inventory CRUD & Orders Access)**:
  * **Email**: `admin@shopez.com`
  * **Password**: `adminpassword123`
* **Customer Account (Product Browsing, Reviews & Checkout)**:
  * **Email**: `test@email.com`
  * **Password**: `password123`
  * *(You can also register a new account directly on the sign-up page)*

---

## 📂 Academic Design Documents & PDFs

All the official project design artifacts, schemas, and diagrams have been compiled into high-fidelity PDF documents. You can navigate and read them directly in the **[MERN phase wise](MERN%20phase%20wise)** directory at the root of the repository:

* 📋 **[FSD Documentation PDF](MERN%20phase%20wise/Project%20Documentation/FSD_Documentation.pdf)** - Full Stack Development (FSD) technical reference report, complete with system architecture, ER diagrams, UML class diagrams, and API routing references.
* 💡 **[Brainstorming & Ideation Phase](MERN%20phase%20wise/Phase%20Wise%20Templets/Brainstorming%20&%20Ideation%20Phase)** - User Empathy Maps, Problem Statements, and MoSCoW Prioritization frameworks.
* 📊 **[Requirement Analysis Phase](MERN%20phase%20wise/Phase%20Wise%20Templets/Requirement%20Analysis)** - Data Flow Diagrams (DFDs), Technology Stack decisions, and Solution Requirements.
* 🏗️ **[Project Design Phase](MERN%20phase%20wise/Phase%20Wise%20Templets/Project%20Design%20Phase)** - Problem-Solution Fit matrices and Proposed Solution architecture.
* 📅 **[Project Planning Phase](MERN%20phase%20wise/Phase%20Wise%20Templets/Project%20Planning%20Phase)** - Product backlog scheduling, story point mapping, Gantt charts, and Risk Registers.
* 🧪 **[Project Development Phase](MERN%20phase%20wise/Phase%20Wise%20Templets/Project%20Developement)** - User Acceptance Testing (UAT) templates and test case executions.

---

## 🛠️ Repository Layout

The repository is structured as a decoupled monorepo:
* **[client/](client)**: React.js frontend client SPA built with Vite.
* **[server/](server)**: Node.js/Express.js backend REST API.
* **[MERN phase wise/](MERN%20phase%20wise)**: Compiled academic PDF templates and design specifications.

---

## 🚀 How to Run Locally

Follow these steps to configure and execute the application on your local machine:

### 1. Configure Environment Variables
Create a `.env` file inside the `server/` directory and configure the following variables:
```env
PORT=8000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/shopez
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 2. Quick Setup & Run (Root Scripts)
If you have Node.js and npm installed globally, you can set up and run the entire application using root commands:

```bash
# 1. Install all dependencies (Root, Client, and Server workspaces)
npm run install:all

# 2. Seed database with mock products and default admin account
npm run seed

# 3. Launch both backend API and React client concurrently
npm run dev
```

* **Frontend Client** will launch on: [http://localhost:5173](http://localhost:5173)
* **Backend API Server** will run on: [http://localhost:8000](http://localhost:8000)

### 3. Alternative Manual Execution
Alternatively, you can run client and server processes in separate terminal instances:

* **To start the backend API**:
  ```bash
  cd server
  npm install
  npm run seed   # (If running for the first time)
  npm run dev
  ```

* **To start the frontend React app**:
  ```bash
  cd client
  npm install
  npm run dev
  ```
