# Solution Requirements

**Document Version**: 1.1
**Date**: 11 June 2026
**Project Name**: ShopEZ — MERN Stack E-commerce Application
**Phase**: Requirement Analysis

---

## 1. Introduction

This document specifies the complete set of **Functional** and **Non-Functional Requirements** for the ShopEZ e-commerce platform. Each requirement is assigned a unique identifier to enable traceability from inception through design, implementation, and User Acceptance Testing (UAT). Requirements are classified by priority (MoSCoW) and complexity.

---

## 2. Functional Requirements

### 2.1 User Management

| Req. ID | Requirement Description | Priority | Complexity | Maps to USN |
| :------ | :---------------------- | :------- | :--------- | :---------- |
| FR-01 | The system shall permit new users to register by providing a unique email address, full name, and password. Email must be validated for format correctness. | Must Have | Low | USN-1 |
| FR-02 | The system shall authenticate registered users via email and password credentials and issue a signed JWT token upon success. | Must Have | Low | USN-2 |
| FR-03 | The system shall store JWT tokens exclusively in HTTP-only cookies to prevent client-side JavaScript access (XSS mitigation). | Must Have | Low | USN-2 |
| FR-04 | The system shall enforce Role-Based Access Control (RBAC) distinguishing between the `user` and `admin` roles. | Must Have | Medium | USN-0 |
| FR-05 | Authenticated users shall be able to update their profile information including name, password, phone number, and saved shipping addresses. | Should Have | Low | USN-1 |

### 2.2 Product Catalogue

| Req. ID | Requirement Description | Priority | Complexity | Maps to USN |
| :------ | :---------------------- | :------- | :--------- | :---------- |
| FR-06 | The system shall display a paginated catalogue of products, each presenting product name, image, description, price, rating, and stock availability. | Must Have | Medium | USN-3 |
| FR-07 | The system shall provide a full-text search facility allowing customers to query products by name and description keywords. | Must Have | Medium | USN-3 |
| FR-08 | The system shall support dynamic filtering of product listings by Category, Price Range (min/max slider), and Average Star Rating. | Must Have | Medium | USN-3 |
| FR-09 | The system shall support sorting of product results by: Newest First, Price Ascending, Price Descending, and Highest Rated. | Should Have | Low | USN-3 |
| FR-10 | Administrators shall be able to Create, Read, Update, and Delete (CRUD) product records, including uploading product images via Cloudinary. | Must Have | High | USN-3 |

### 2.3 Shopping Cart & Checkout

| Req. ID | Requirement Description | Priority | Complexity | Maps to USN |
| :------ | :---------------------- | :------- | :--------- | :---------- |
| FR-11 | The system shall allow authenticated users to add products to a persistent shopping cart stored in the MongoDB database. | Must Have | Medium | USN-4 |
| FR-12 | The system shall allow users to modify item quantities and remove items from their cart; the cart total shall recalculate in real time. | Must Have | Low | USN-4 |
| FR-13 | The system shall present a guided, multi-step checkout flow: (1) Shipping Address → (2) Payment Method Selection → (3) Order Review & Placement. | Must Have | High | USN-5 |
| FR-14 | The system shall integrate with a Payment Gateway (Stripe / Razorpay) to securely process card and UPI-based transactions. | Must Have | High | USN-6 |
| FR-15 | Upon successful payment, the system shall create an order record, deduct purchased quantities from product stock, and clear the user's cart. | Must Have | High | USN-6 |

### 2.4 Order Management

| Req. ID | Requirement Description | Priority | Complexity | Maps to USN |
| :------ | :---------------------- | :------- | :--------- | :---------- |
| FR-16 | Authenticated users shall be able to access a history of all their past orders, including order status, item details, and payment confirmation. | Must Have | Medium | USN-7 |
| FR-17 | Administrators shall be able to view a consolidated list of all platform orders and update order fulfilment status (Processing → Shipped → Delivered → Cancelled). | Must Have | Medium | USN-7 |

### 2.5 Reviews & Ratings

| Req. ID | Requirement Description | Priority | Complexity | Maps to USN |
| :------ | :---------------------- | :------- | :--------- | :---------- |
| FR-18 | Authenticated users who have placed at least one order shall be able to submit a star rating (1–5) and text review for any product. | Should Have | Medium | USN-8 |
| FR-19 | Upon review submission, the product's aggregate rating and review count shall be recalculated and persisted. | Should Have | Low | USN-8 |

### 2.6 Admin Dashboard

| Req. ID | Requirement Description | Priority | Complexity | Maps to USN |
| :------ | :---------------------- | :------- | :--------- | :---------- |
| FR-20 | The Admin Dashboard shall display key business metrics including: total revenue, total orders, total users, and total products. | Should Have | Medium | USN-9 |
| FR-21 | The Admin Dashboard shall display a time-series chart depicting monthly revenue aggregates. | Should Have | High | USN-9 |

---

## 3. Non-Functional Requirements

| Req. ID | Category | Requirement Description | Priority |
| :------ | :------- | :---------------------- | :------- |
| NFR-01 | **Security** | All user passwords must be hashed using Bcrypt (salt rounds ≥ 10) prior to persistence in the database. | Must Have |
| NFR-02 | **Security** | All API routes that modify data or access protected resources must require a valid JWT; unauthenticated requests shall return HTTP 401. | Must Have |
| NFR-03 | **Security** | Admin-only API routes shall apply an additional `isAdmin` middleware check; non-admin access shall return HTTP 403. | Must Have |
| NFR-04 | **Performance** | Product catalogue API responses must be returned within 500ms under normal load conditions. | Should Have |
| NFR-05 | **Performance** | All product images must be served via the Cloudinary CDN to ensure sub-second image load times globally. | Should Have |
| NFR-06 | **Usability** | The frontend UI must be fully responsive, rendering correctly on screens from 320px (mobile) to 1920px (desktop). | Must Have |
| NFR-07 | **Reliability** | The system must use MongoDB's document atomicity to ensure that stock deduction and order creation are performed within a single consistent operation, preventing overselling. | Must Have |
| NFR-08 | **Maintainability** | All backend code must follow the MVC pattern: Router → Middleware → Controller → Model. No business logic shall be placed directly in route handlers. | Should Have |
| NFR-09 | **Scalability** | The stateless JWT authentication model shall ensure that the API can be horizontally scaled without shared session state concerns. | Could Have |

---

## 4. Requirements Traceability Matrix

| Req. ID | Phase Documented | Design Artefact | Implementation File | UAT Test Case |
| :------ | :--------------- | :-------------- | :------------------ | :------------ |
| FR-01, FR-02, FR-03 | Requirement Analysis | Solution Architecture | `server/controllers/userController.js` | UAT-001, UAT-002 |
| FR-06, FR-07, FR-08, FR-09 | Requirement Analysis | Data Flow Diagram | `server/controllers/productController.js` | UAT-003 |
| FR-11, FR-12 | Requirement Analysis | ER Diagram | `server/models/Cart.js` | UAT-004 |
| FR-13, FR-14, FR-15 | Requirement Analysis | User Flow Sequence | `server/controllers/orderController.js` | UAT-005 |
| FR-10 | Requirement Analysis | Solution Architecture | `server/controllers/productController.js` | UAT-006 |
| FR-17 | Requirement Analysis | Solution Architecture | `server/controllers/orderController.js` | UAT-007 |

---

## 5. Conclusion

The twenty-one functional requirements and nine non-functional requirements defined in this document constitute the full contractual specification of the ShopEZ platform. All requirements are traceable to User Stories, design artefacts, source code implementation files, and UAT test cases, ensuring end-to-end verifiability of system correctness.

---
*Document controlled by V S S S Manikanta — June 2026*
