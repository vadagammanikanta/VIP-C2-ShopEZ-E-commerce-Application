# Data Flow Diagrams and User Stories

**Document Version**: 1.1
**Date**: 11 June 2026
**Project Name**: ShopEZ — MERN Stack E-commerce Application
**Phase**: Requirement Analysis

---

## 1. Introduction

This document presents the **Data Flow Diagrams (DFDs)** and formal **User Stories** for the ShopEZ platform. The DFDs model the system at two levels of abstraction — the Context Level (Level 0) and the Functional Decomposition Level (Level 1) — illustrating how data flows between the system's actors, processes, and data stores. User Stories are subsequently defined to specify system behaviour from the end-user's perspective.

---

## 2. Data Flow Diagrams

### 2.1 Level 0 — Context Diagram

The Level 0 Context Diagram presents the ShopEZ system as a single process ("black box"), illustrating only the external entities and the high-level data flows between them and the system.

```mermaid
flowchart LR
    Customer(["👤 Customer"])
    Admin(["🔑 Administrator"])
    PayGW(["💳 Payment Gateway"])
    Cloudinary(["🖼️ Cloudinary CDN"])

    System{{"🛒 ShopEZ\nE-commerce System"}}

    Customer -->|"Registration / Login Credentials"| System
    Customer -->|"Search Queries, Cart Actions, Order Details"| System
    System -->|"Product Catalogue, Cart State, Order Confirmations"| Customer

    Admin -->|"Product Data, Category Data, Order Status Updates"| System
    System -->|"Sales Metrics, Order Lists, Platform Reports"| Admin

    System -->|"Payment Request (Amount, Token)"| PayGW
    PayGW -->|"Payment Success / Failure Response"| System

    System -->|"Image Upload Request"| Cloudinary
    Cloudinary -->|"Hosted Image URL"| System
```

---

### 2.2 Level 1 — Functional Decomposition

The Level 1 DFD decomposes the ShopEZ system into its three core sub-processes, showing data flows between each process and the underlying data stores.

#### Sub-Process 1: Authentication

```mermaid
flowchart TD
    Customer(["👤 Customer"])
    P1["Process 1.0\nUser Authentication"]
    DS1[("🗄️ DS-1: Users Collection\n(MongoDB)")]

    Customer -->|"email, password, name"| P1
    P1 -->|"Hash password (Bcrypt)"| DS1
    P1 -->|"Validate credentials"| DS1
    DS1 -->|"User record"| P1
    P1 -->|"JWT Token (HTTP-only Cookie)"| Customer
```

#### Sub-Process 2: Shopping & Order Placement

```mermaid
flowchart TD
    Customer(["👤 Customer"])
    P2A["Process 2.1\nProduct Search & Browse"]
    P2B["Process 2.2\nCart Management"]
    P2C["Process 2.3\nCheckout & Order Creation"]
    DS2[("🗄️ DS-2: Products Collection")]
    DS3[("🗄️ DS-3: Cart Collection")]
    DS4[("🗄️ DS-4: Orders Collection")]
    PayGW(["💳 Payment Gateway"])

    Customer -->|"Search query / filters"| P2A
    P2A -->|"Query"| DS2
    DS2 -->|"Product list"| P2A
    P2A -->|"Product results"| Customer

    Customer -->|"Add/Update/Remove item"| P2B
    P2B -->|"Read/Write cart"| DS3
    DS3 -->|"Cart state"| P2B
    P2B -->|"Updated cart"| Customer

    Customer -->|"Shipping address, payment method"| P2C
    P2C -->|"Verify stock"| DS2
    P2C -->|"Payment request"| PayGW
    PayGW -->|"Payment confirmation"| P2C
    P2C -->|"Write order record"| DS4
    P2C -->|"Deduct stock"| DS2
    P2C -->|"Clear cart"| DS3
    P2C -->|"Order confirmation + Invoice"| Customer
```

#### Sub-Process 3: Administration

```mermaid
flowchart TD
    Admin(["🔑 Administrator"])
    P3A["Process 3.1\nProduct & Category CRUD"]
    P3B["Process 3.2\nOrder Fulfilment Management"]
    P3C["Process 3.3\nSales Analytics Aggregation"]
    DS2[("🗄️ DS-2: Products Collection")]
    DS4[("🗄️ DS-4: Orders Collection")]
    DS5[("🗄️ DS-5: Categories Collection")]
    Cloudinary(["🖼️ Cloudinary CDN"])

    Admin -->|"Product data + image file"| P3A
    P3A -->|"Upload image"| Cloudinary
    Cloudinary -->|"Image URL"| P3A
    P3A -->|"Write/Update/Delete record"| DS2
    P3A -->|"Write/Update/Delete record"| DS5
    P3A -->|"Operation confirmation"| Admin

    Admin -->|"Order status update"| P3B
    P3B -->|"Update order status"| DS4
    P3B -->|"Updated order"| Admin

    Admin -->|"Analytics request"| P3C
    P3C -->|"Aggregate queries"| DS4
    DS4 -->|"Revenue / order data"| P3C
    P3C -->|"Dashboard metrics + charts"| Admin
```

---

## 3. User Stories

| User Type | Epic | USN | User Story | Acceptance Criteria | Story Points | Priority | Sprint |
| :-------- | :--- | :-- | :--------- | :------------------ | :----------- | :------- | :----- |
| **Customer** | Registration | USN-1 | As a customer, I can register by entering my name, email, and password so that I can access personalised features. | User account is created in the database; user is redirected to the dashboard upon success; duplicate email returns HTTP 400. | 2 | 🔴 High | Sprint 1 |
| **Customer** | Login | USN-2 | As a customer, I can log in using my registered email and password so that I can securely access my account. | System validates credentials; a JWT token is issued and stored in an HTTP-only cookie; incorrect credentials return HTTP 401. | 2 | 🔴 High | Sprint 1 |
| **Customer** | Browsing | USN-3 | As a customer, I can search for products by keyword and filter results by category, price range, and star rating so that I can efficiently find relevant items. | Search results accurately reflect the applied search term and filters; results update dynamically without full page reload. | 3 | 🔴 High | Sprint 1 |
| **Customer** | Shopping Cart | USN-4 | As a customer, I can add products to my cart, adjust quantities, and remove items so that I can manage my intended purchase. | Cart total updates in real time; cart state persists across page reloads and device sessions; out-of-stock items cannot be added. | 3 | 🔴 High | Sprint 2 |
| **Customer** | Checkout | USN-5 | As a customer, I can complete a guided checkout by entering my shipping address and selecting a payment method so that I can place an order. | All three checkout steps are navigable; order is created upon placement; shipping address is validated before proceeding. | 3 | 🔴 High | Sprint 2 |
| **Customer** | Payment | USN-6 | As a customer, I can securely pay for my order via an integrated payment gateway so that my transaction is processed without storing sensitive card data on the server. | Payment is processed via the gateway; order status changes to "Paid"; product stock is deducted; order confirmation is displayed. | 5 | 🔴 High | Sprint 2 |
| **Customer** | Reviews | USN-7 | As a customer who has completed a purchase, I can leave a star rating and written review for a product so that other shoppers benefit from my experience. | Review appears on the product detail page; aggregate rating is recalculated; only authenticated users with a prior purchase may review. | 2 | 🟡 Medium | Sprint 3 |
| **Admin** | Catalogue | USN-8 | As an administrator, I can add, edit, and delete product listings including uploading product images so that the storefront catalogue remains accurate and current. | Product changes reflect immediately on the public storefront; images are successfully uploaded to Cloudinary and served via CDN URL. | 3 | 🔴 High | Sprint 1 |
| **Admin** | Orders | USN-9 | As an administrator, I can view all platform orders and update their delivery status so that customers receive timely fulfilment updates. | Status transitions follow the sequence: Processing → Shipped → Delivered; status changes are reflected immediately in the customer's order history. | 2 | 🔴 High | Sprint 3 |
| **Admin** | Dashboard | USN-10 | As an administrator, I can view aggregated sales metrics and monthly revenue charts so that I can make informed business decisions. | Dashboard accurately displays total revenue, total orders, and monthly breakdown; data reflects live database state. | 3 | 🟡 Medium | Sprint 3 |

---

## 4. Conclusion

The Level 0 and Level 1 DFDs provide a comprehensive and unambiguous model of how data traverses the ShopEZ system between its actors, processes, and persistent data stores. The User Stories derived from this analysis constitute the authoritative specification of observable system behaviour, directly traceable to the Sprint Backlog defined in the *Project Planning* document.

---
*Document controlled by V S S S Manikanta — June 2026*
