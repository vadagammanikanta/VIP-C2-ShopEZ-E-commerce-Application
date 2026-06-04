# Entity Relationship (ER) Diagram

This document details the database schema and relationship designs for the E-commerce system.

```mermaid
erDiagram
    USER ||--o{ ORDER : "places"
    USER ||--o{ REVIEW : "writes"
    USER ||--o{ CART : "has"
    
    CATEGORY ||--o{ PRODUCT : "contains"
    PRODUCT ||--o{ REVIEW : "receives"
    
    ORDER ||--|{ ORDER_ITEM : "contains"
    PRODUCT ||--o{ ORDER_ITEM : "referenced_in"
    
    CART ||--o{ CART_ITEM : "contains"
    PRODUCT ||--o{ CART_ITEM : "referenced_in"

    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string role "user | admin"
        array addresses
        string phone
        date createdAt
    }

    PRODUCT {
        ObjectId _id PK
        string name
        string description
        number price
        ObjectId category FK
        number stock
        array images
        number rating
        number numReviews
        ObjectId seller FK
        date createdAt
    }

    CATEGORY {
        ObjectId _id PK
        string name UK
        string slug UK
        string description
        string image
    }

    ORDER {
        ObjectId _id PK
        ObjectId user FK
        array shippingAddress
        string paymentMethod
        object paymentResult
        number itemsPrice
        number taxPrice
        number shippingPrice
        number totalPrice
        boolean isPaid
        date paidAt
        boolean isDelivered
        date deliveredAt
        string orderStatus "Processing | Shipped | Delivered | Cancelled"
        date createdAt
    }

    ORDER_ITEM {
        ObjectId product FK
        string name
        number quantity
        number price
        string image
    }

    CART {
        ObjectId _id PK
        ObjectId user FK
        date updatedAt
    }

    CART_ITEM {
        ObjectId product FK
        number quantity
        number price
    }

    REVIEW {
        ObjectId _id PK
        ObjectId user FK
        string name
        number rating
        string comment
        ObjectId product FK
        date createdAt
    }
```

## Schema Definitions

1. **User Schema**: Stores information for authentication and delivery. The `email` field is indexed and unique.
2. **Product Schema**: References the `category` model and holds metadata like inventory stock, pricing, and ratings.
3. **Category Schema**: Groups items for easier browse capabilities.
4. **Order Schema**: Links users to their purchase history, mapping shipping addresses and payment confirmation codes.
5. **Cart Schema**: Ensures persistent customer shopping cart records.
6. **Review Schema**: Collects consumer feedback on individual products.

---
[◄ Back to Project Architecture](../project_architecture.md) | [Back to Home](../README.md)
