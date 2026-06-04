# User Flows

This document maps out key user journeys on the E-commerce platform.

## Customer Checkout Flow

This diagram outlines how a user adds items to the cart, interacts with backend APIs, and completes a payment transaction via Stripe.

```mermaid
sequenceDiagram
    actor User
    participant Frontend as React App
    participant Backend as Node/Express API
    participant DB as MongoDB
    participant Stripe as Stripe Gateway

    User->>Frontend: Add Product to Cart
    Frontend->>User: Update Cart State & Show Badge
    User->>Frontend: Click "Proceed to Checkout"
    Frontend->>Backend: Validate Session / Token
    Backend-->>Frontend: Token Valid
    Frontend->>User: Display Shipping Address & Payment Form
    User->>Frontend: Submit Order Details
    Frontend->>Backend: POST /api/orders (Create Order, Status: Pending)
    Backend->>DB: Check Stock & Save Order
    Backend->>Stripe: Request Payment Intent
    Stripe-->>Backend: Client Secret
    Backend-->>Frontend: Return Order & Payment Details
    Frontend->>Stripe: Confirm Card Payment (Direct Client-to-Stripe)
    Stripe-->>Frontend: Payment Success Token
    Frontend->>Backend: PUT /api/orders/:id/pay (Payment Token)
    Backend->>DB: Mark Order as Paid, Deduct Product Stock
    Backend-->>Frontend: Return Order Paid Success
    Frontend->>User: Display Success Screen with Invoice
```

---
[◄ Back to Project Architecture](../project_architecture.md) | [Back to Home](../README.md)
