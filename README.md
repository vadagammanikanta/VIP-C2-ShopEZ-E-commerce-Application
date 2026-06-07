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
👉 **[Live Demo Link (e.g. Vercel/Render URL)](#)**

---

## 🚀 How to Create a Demo Link

### Option A: Share Your Local App Instantly (Local Tunnel)
If you are running the app locally and want to generate a quick, temporary link to show others:
1. Make sure your React app is running locally on port `5173` (`npm run dev`).
2. Open a new terminal and run:
   ```bash
   npx localtunnel --port 5173
   ```
3. This will output a public URL (e.g., `https://xxxx.localtunnel.me`) that anyone can open in their browser to view your app.

*(Note: If your backend runs on port `8000`, you would also need to expose port `8000` via localtunnel and update the `VITE_API_URL` environment variable to point to that backend tunnel URL).*

---

### Option B: Deploy Publicly (Permanent Link)
For a permanent live link, deploy the MERN stack application to the cloud:

1. **Database**: Create a free database cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and get your connection string.
2. **Backend Server**: Deploy the `server` folder to [Render](https://render.com/) or [Railway](https://railway.app/).
   - Add your environment variable `MONGO_URI` (pointing to MongoDB Atlas).
   - Set start command to `npm start`.
3. **Frontend Client**: Deploy the `client` folder to [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).
   - Set build command to `npm run build`.
   - Set output directory to `dist`.
   - Add environment variable `VITE_API_URL` pointing to your deployed backend URL.
