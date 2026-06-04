# Technical Architecture

This document describes the technical architecture of the MERN stack E-commerce application.

## System Architecture Diagram

```mermaid
graph TD
    %% Frontend Layer
    subgraph Client ["Client (Frontend)"]
        React["React.js (SPA)"]
        Redux["Redux Toolkit (State Management)"]
        UI["CSS / Styled Components"]
        Axios["Axios / Fetch API"]
        React --> Redux
        React --> UI
        React --> Axios
    end

    %% Network Layer
    Axios -->|HTTP REST API (JSON / HTTPS)| ExpressRouter

    %% Backend Layer
    subgraph Server ["Server (Backend - Node.js)"]
        ExpressRouter["Express.js Router"]
        AuthMiddleware["JWT Auth & Role Middlewares"]
        Controllers["Controllers (Business Logic)"]
        MongooseODM["Mongoose (ODM)"]

        ExpressRouter --> AuthMiddleware
        AuthMiddleware --> Controllers
        Controllers --> MongooseODM
    end

    %% Database Layer
    subgraph Database ["Database Layer"]
        MongoDB[("MongoDB Database")]
        MongooseODM --> MongoDB
    end

    %% External Services
    subgraph External ["External Services"]
        Stripe["Stripe / Razorpay (Payments)"]
        Cloudinary["Cloudinary (Image Storage)"]
        SendGrid["Nodemailer / SendGrid (Emails)"]
    end

    Controllers -.-> Stripe
    Controllers -.-> Cloudinary
    Controllers -.-> SendGrid
```

## Architectural Layers

### 1. Presentation Layer (Client-Side)
*   **React.js**: A component-based JavaScript library used to build the Single Page Application (SPA).
*   **Redux Toolkit**: Centralized state management for shopping cart details, active session/auth tokens, and cached API responses.
*   **Axios**: An HTTP client used to interact with the backend REST APIs.

### 2. Router & Middleware Layer
*   **Express Router**: Handles endpoint mappings (`/api/users`, `/api/products`, `/api/orders`).
*   **Security Middlewares**: CORS handling, token verification via JWT, rate limiting, and parameter validation.

### 3. Controller & Business Logic Layer
*   **Controllers**: Express handler functions processing user actions, performing database operations, handling third-party integrations, and returning status responses.

### 4. Data Access Layer
*   **Mongoose ODM**: Handles database schema validation, models construction, query generation, and hook executions.
*   **MongoDB**: Document-oriented database storing records in BSON format, optimized for high read/write performance.

---
[◄ Back to Project Architecture](../project_architecture.md) | [Back to Home](../README.md)
