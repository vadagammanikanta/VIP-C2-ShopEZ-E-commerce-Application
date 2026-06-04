# E-commerce Features

This document provides a breakdown of all implementation features.

## Customer-Facing Features

### 1. Authentication & Security
*   **Sign Up & Sign In**: Register with email validation and securely log in.
*   **JWT Security**: Protected HTTP-only cookies storing JWT payload for session management.
*   **Profile Management**: Update passwords, shipping details, and contact numbers.

### 2. Search & Browsing
*   **Search**: Full-text searching across product names and descriptions.
*   **Filtering**: Dynamically filter items by Category, Price Range, and Rating.
*   **Sorting**: Sort items by popular listings, new arrivals, price asc/desc.

### 3. Order Management
*   **Shopping Cart**: Save cart state temporarily in LocalStorage or persist it inside the database.
*   **Stock Lock**: Verify and deduct stock items upon checkout success.
*   **Checkout Flow**: Multi-step checkout (Address -> Method -> Payment).
*   **Payment Services**: Stripe & Razorpay gateway implementation.

---

## Admin Management Features

### 1. Business Insights
*   **Sales Metrics**: Monthly revenues, transaction histories, and user growth charts.
*   **Order Tracking**: View processing orders, update shipping carriers, and change fulfillment milestones.

### 2. Catalog Operations
*   **Product Control (CRUD)**: Create, update, or remove inventory records with Cloudinary image management.
*   **Category Controls**: Organize catalogs by adding, renaming, or deleting category structures.

---
[◄ Back to Project Architecture](../project_architecture.md) | [Back to Home](../README.md)
