# Roles and Responsibilities

This document defines the Role-Based Access Control (RBAC) rules mapping.

| Role | Responsibilities | Permissions & Capabilities |
| :--- | :--- | :--- |
| **Guest / Visitor** | Browse products and research | • View homepage, search, filter, and view product pages.<br>• Add items to temporary shopping cart. |
| **Registered User** | Place orders and manage account | • Manage profiles, shipping addresses, and preferences.<br>• Perform checkout and complete payments.<br>• View order history and status.<br>• Write reviews/ratings. |
| **Administrator** | Manage the store operations | • Access secure admin panel `/admin`.<br>• Create, Read, Update, and Delete (CRUD) products and categories.<br>• Manage order fulfillment and ship items.<br>• View sales analytics dashboards. |

## Access Control Middleware Design

### Token Verification
JWT tokens are generated upon successful login. The backend verifies this token for any protected endpoint using the `authMiddleware`:
```javascript
const protect = async (req, res, next) => {
    // Read token from headers or cookies
    // Verify using jwt.verify()
    // Populate req.user
    // Call next()
};
```

### Role Checks
To protect Admin-only resources, we chain an `admin` authorization middleware after `protect`:
```javascript
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};
```

---
[◄ Back to Project Architecture](../project_architecture.md) | [Back to Home](../README.md)
