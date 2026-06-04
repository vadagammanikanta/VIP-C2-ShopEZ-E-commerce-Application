# MVC Pattern in MERN

This document explains the Model-View-Controller architecture configuration.

```
       [ BROWSER ] ◄────────────────────────────────────────┐
            │                                               │
            ▼                                               │
┌───────────────────────┐                                   │
│         VIEW          │ (React Components & UI)           │ HTTP
└───────────┬───────────┘                                   │ Response
            │ Trigger Events (API Requests)                 │
            ▼                                               │
┌────────────────────────────────────────────────────────┐  │
│                      SERVER (Node/Express)             │  │
│                                                        │  │
│   ┌───────────────┐        ┌───────────────┐           │  │
│   │    ROUTER     │ ─────► │  CONTROLLER   │           │──┘
│   └───────────────┘        └───────┬───────┘           │
│                                    │ interacts         │
│                                    ▼                   │
│                            ┌───────────────┐           │
│                            │     MODEL     │ (Mongoose)│
│                            └───────┬───────┘           │
└────────────────────────────────────┼───────────────────┘
                                     ▼
                               ┌───────────┐
                               │ DATABASE  │ (MongoDB)
                               └───────────┘
```

## MVC Core Division

1.  **View (Client Layer - React)**:
    *   Dynamic single page layout interface that renders state data.
    *   State stores are located in `src/redux` or local states.
    *   Sends API fetch requests to backend endpoints.

2.  **Router (Entry Layer - Express Routes)**:
    *   Catches HTTP queries.
    *   Runs auth, logging, and body validation middlewares.
    *   Routes data flows into appropriate Controllers.

3.  **Controller (Logic Layer - Express Controllers)**:
    *   Acts as the mediator. Processes validation inputs, coordinates CRUD instructions with Models, and formats output JSON objects.

4.  **Model (Data Layer - Mongoose Schema)**:
    *   Specifies database schema rules, indices, pre-hooks (e.g., password hashing), and relationships.

---
[◄ Back to Project Architecture](../project_architecture.md) | [Back to Home](../README.md)
