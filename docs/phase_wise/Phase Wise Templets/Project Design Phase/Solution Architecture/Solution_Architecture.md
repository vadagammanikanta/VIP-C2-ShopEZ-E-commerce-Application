# Solution Architecture

**Document Version**: 1.1
**Date**: 11 June 2026
**Project Name**: ShopEZ — MERN Stack E-commerce Application
**Phase**: Project Design

---

## 1. Introduction

This document provides a comprehensive specification of the **Solution Architecture** for the ShopEZ platform. It covers the layered system architecture, component relationships, the MVC design pattern mapping, the database entity model, and the deployment topology. The architecture adheres to the principles of **Separation of Concerns**, **Stateless API Design**, and **Scalable Cloud Deployment**.

---

## 2. Layered System Architecture

The ShopEZ platform is structured across four distinct architectural layers. The following diagram illustrates the complete system and the data flow between layers:

```mermaid
graph TD
    subgraph Presentation["🖥️ Layer 1 — Presentation (Client)"]
        Browser["Web Browser"]
        React["React.js v18\n(SPA — Component Tree)"]
        CtxAPI["Context API / Redux Toolkit\n(Global State: Auth, Cart)"]
        Axios["Axios HTTP Client\n(API Communication)"]
        Browser --> React
        React <--> CtxAPI
        React --> Axios
    end

    subgraph API["⚙️ Layer 2 — API Gateway & Middleware (Server)"]
        Router["Express.js Router\n(/api/users, /api/products,\n/api/orders, /api/categories)"]
        AuthMW["JWT Auth Middleware\n(protect + isAdmin)"]
        ErrMW["Global Error Handler\nMiddleware"]
        Router --> AuthMW
        AuthMW --> ErrMW
    end

    subgraph Business["🧠 Layer 3 — Business Logic (Controllers)"]
        UserCtrl["User Controller\n(register, login, profile)"]
        ProdCtrl["Product Controller\n(CRUD, search, filter)"]
        OrderCtrl["Order Controller\n(create, pay, fulfil)"]
        CartCtrl["Cart Controller\n(add, update, remove)"]
    end

    subgraph Data["🗄️ Layer 4 — Data Access (ODM + Database)"]
        Mongoose["Mongoose ODM\n(Schema validation,\npre-hooks, populate)"]
        MongoDB[("MongoDB Atlas\nCollections:\nusers | products | orders\ncategories | carts | reviews")]
        Mongoose <--> MongoDB
    end

    subgraph External["🔌 External Services"]
        Stripe["💳 Stripe / Razorpay\n(Payment Processing)"]
        Cloudinary["🖼️ Cloudinary\n(Image CDN)"]
    end

    Axios -->|"HTTPS REST"| Router
    ErrMW --> UserCtrl
    ErrMW --> ProdCtrl
    ErrMW --> OrderCtrl
    ErrMW --> CartCtrl
    UserCtrl --> Mongoose
    ProdCtrl --> Mongoose
    OrderCtrl --> Mongoose
    CartCtrl --> Mongoose
    OrderCtrl -.->|"Payment API"| Stripe
    ProdCtrl -.->|"Upload API"| Cloudinary
```

---

## 3. MVC Design Pattern Mapping

The ShopEZ backend strictly adheres to the **Model–View–Controller (MVC)** architectural pattern, adapted for a decoupled API-first design:

| MVC Layer | MERN Component | Responsibilities |
| :-------- | :------------- | :--------------- |
| **View** | React.js (Frontend SPA) | Renders UI components; manages local component state; dispatches API calls via Axios; updates global state via Context/Redux |
| **Controller** | Express.js Controllers | Receives validated HTTP requests; orchestrates business logic; invokes Model methods; formats and returns JSON responses |
| **Model** | Mongoose Schemas & Models | Defines data structure, validation rules, and type constraints; executes lifecycle hooks (password hashing, timestamp management); interfaces with MongoDB Atlas |

---

## 4. UML Component Diagram

```mermaid
graph LR
    subgraph Client["Client Application"]
        C1["AuthPages\n(Login/Register)"]
        C2["ProductPages\n(Home/Detail/Search)"]
        C3["CartPage"]
        C4["CheckoutWizard"]
        C5["AdminPanel\n(Dashboard/Products/Orders)"]
        C6["AuthContext"]
        C7["CartContext"]
        C1 --> C6
        C2 --> C7
        C3 --> C7
        C4 --> C6
        C4 --> C7
        C5 --> C6
    end

    subgraph Server["API Server"]
        R1["UserRouter\n/api/users"]
        R2["ProductRouter\n/api/products"]
        R3["OrderRouter\n/api/orders"]
        R4["CartRouter\n/api/cart"]
        MW["Auth Middleware"]
        UC["UserController"]
        PC["ProductController"]
        OC["OrderController"]
        CC["CartController"]
        R1 --> MW --> UC
        R2 --> MW --> PC
        R3 --> MW --> OC
        R4 --> MW --> CC
    end

    subgraph Models["Data Models (Mongoose)"]
        M1["User Model"]
        M2["Product Model"]
        M3["Order Model"]
        M4["Cart Model"]
        M5["Category Model"]
        M6["Review Model"]
    end

    UC --> M1
    PC --> M2
    PC --> M5
    OC --> M3
    OC --> M2
    CC --> M4
    CC --> M2

    Client -->|"HTTP/REST"| Server
```

---

## 5. Database Entity Overview

The following entities are defined as Mongoose schemas and persisted as MongoDB collections:

| Entity (Collection) | Key Fields | Relationships |
| :------------------ | :--------- | :------------ |
| **User** | `_id`, `name`, `email` (unique), `password` (hashed), `role` (user/admin), `addresses[]` | References: Orders, Cart, Reviews |
| **Product** | `_id`, `name`, `description`, `price`, `stock`, `images[]`, `rating`, `numReviews`, `category` (FK), `seller` (FK) | References: Category, Reviews, OrderItems, CartItems |
| **Category** | `_id`, `name` (unique), `slug` (unique), `description`, `image` | Referenced by: Products |
| **Order** | `_id`, `user` (FK), `orderItems[]`, `shippingAddress`, `paymentMethod`, `paymentResult`, `totalPrice`, `isPaid`, `isDelivered`, `orderStatus` | References: User, Products |
| **Cart** | `_id`, `user` (FK, unique), `items[]` (product FK, quantity, price), `updatedAt` | References: User, Products |
| **Review** | `_id`, `user` (FK), `product` (FK), `rating`, `comment`, `createdAt` | References: User, Products |

---

## 6. API Endpoint Architecture

| Method | Endpoint | Auth Required | Role | Description |
| :----- | :------- | :------------ | :--- | :---------- |
| POST | `/api/users/register` | No | — | Register a new user account |
| POST | `/api/users/login` | No | — | Authenticate user and issue JWT |
| GET | `/api/users/profile` | Yes | User | Retrieve authenticated user profile |
| PUT | `/api/users/profile` | Yes | User | Update user profile |
| GET | `/api/products` | No | — | Fetch all products (supports query filters) |
| GET | `/api/products/:id` | No | — | Fetch single product by ID |
| POST | `/api/products` | Yes | Admin | Create a new product listing |
| PUT | `/api/products/:id` | Yes | Admin | Update product details |
| DELETE | `/api/products/:id` | Yes | Admin | Remove a product listing |
| POST | `/api/orders` | Yes | User | Place a new order |
| GET | `/api/orders/myorders` | Yes | User | Retrieve authenticated user's order history |
| GET | `/api/orders/:id` | Yes | User/Admin | Retrieve a specific order by ID |
| PUT | `/api/orders/:id/pay` | Yes | User | Mark order as paid (after gateway confirmation) |
| PUT | `/api/orders/:id/deliver` | Yes | Admin | Update order delivery status |

---

## 7. Deployment Topology

```mermaid
flowchart LR
    User(["🌍 End User\n(Browser)"])
    CDN["☁️ Vercel CDN\n(React SPA — static files)"]
    API["🖥️ Render\n(Node.js / Express API\n– Port 8000)"]
    DB["🗄️ MongoDB Atlas\n(Cloud Cluster)"]
    CLD["🖼️ Cloudinary\n(Image CDN)"]
    PG["💳 Stripe / Razorpay\n(Payment API)"]

    User -->|"HTTPS"| CDN
    CDN -->|"API Calls (HTTPS + CORS)"| API
    API -->|"TLS / Mongoose"| DB
    API -->|"REST API"| CLD
    API -->|"REST API"| PG
```

| Component | Platform | URL |
| :-------- | :------- | :-- |
| **Frontend (React SPA)** | Vercel | `https://e-commerce-application-neon-five.vercel.app/` |
| **Backend (Node.js API)** | Render | `https://shopez-api-c30e.onrender.com` |
| **Database** | MongoDB Atlas | Cloud-hosted (M0 Free Tier) |
| **Image Storage** | Cloudinary | CDN delivery via `res.cloudinary.com` |

---

## 8. Conclusion

The ShopEZ solution architecture delivers a well-structured, layered, and cloud-native platform. The strict separation of concerns across Presentation, API, Business Logic, and Data Access layers ensures the system is maintainable, independently scalable, and extendable. The MVC pattern provides a clear organisational framework for all backend code, while the decoupled frontend–backend deployment model enables independent versioning and continuous delivery.

---
*Document controlled by V S S S Manikanta — June 2026*
