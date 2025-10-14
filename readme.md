
---

# 📌 Postaway-II

**Postaway-II** is a robust social media backend REST API built with **Node.js, Express.js, and MongoDB**.
It enables users to post, comment, like, manage friendships, and securely reset passwords via OTPs. The system is designed with modular architecture, repository pattern, and follows RESTful principles for scalability and maintainability.

---

## 🚀 Features

### Core Features

* 👤 **User Authentication & Management**

  * User registration & login
  * Logout & logout from all devices
  * Secure password reset via OTP
  * Profile updates with avatar uploads
* 📝 **Post Management**

  * Create, read, update, delete posts
  * Only post owners can modify or delete posts
* 💬 **Comment System**

  * Add, edit, delete, and view comments
  * Only post owners or commenters can modify/delete comments
* 👍 **Like Functionality**

  * Like/unlike posts and comments
  * Like counts and user info populated
* 🤝 **Friendship Features**

  * Send, accept, reject, cancel, and unfriend
  * Retrieve friends list and pending requests
* 🔐 **Security**

  * JWT-based authentication
  * Access & refresh tokens stored in cookies
* 📦 **File Uploads**

  * Avatar and post image uploads via Multer
* 🛑 **Error Handling**

  * Centralized error middleware with descriptive messages
* 📑 **Logging**

  * Request logging middleware for debugging and monitoring

---

## 🛠 Tech Stack

* **Backend**: Node.js, Express.js
* **Database**: MongoDB (with repository pattern)
* **Authentication & Security**: JWT, OTP via Nodemailer
* **File Uploads**: Multer
* **Error Handling**: Centralized ApplicationError class
* **Logging**: Custom logger middleware

---

## 🗂 Project Structure

```mermaid
graph TD
A[Postaway-II] --> B[.vscode]
A --> C[public]
A --> D[services]
D --> D1[email.service.js]

A --> E[src]
E --> E1[config]
E1 --> E2[mongodb.js]

A --> F[features]
F --> F1[auth]
F1 --> F1a[auth.controller.js]
F1 --> F1b[auth.repository.js]
F1 --> F1c[auth.routes.js]
F1 --> F1d[auth.model.js]

F --> F2[user]
F2 --> F2a[user.controller.js]
F2 --> F2b[user.repository.js]
F2 --> F2c[user.routes.js]

F --> F3[post]
F3 --> F3a[post.controller.js]
F3 --> F3b[post.repository.js]
F3 --> F3c[post.routes.js]
F3 --> F3d[post.model.js]

F --> F4[comment]
F4 --> F4a[comment.controller.js]
F4 --> F4b[comment.repository.js]
F4 --> F4c[comment.routes.js]
F4 --> F4d[comment.model.js]

F --> F5[like]
F5 --> F5a[like.controller.js]
F5 --> F5b[like.repository.js]
F5 --> F5c[like.routes.js]
F5 --> F5d[like.model.js]

F --> F6[friendship]
F6 --> F6a[friendship.controller.js]
F6 --> F6b[friendship.repository.js]
F6 --> F6c[friendship.routes.js]
F6 --> F6d[friendship.model.js]

A --> G[middlewares]
G --> G1[errorHandler.middleware.js]
G --> G2[fileUpload.middleware.js]
G --> G3[jwt.middleware.js]
G --> G4[logger.middleware.js]
G --> G5[validator.middleware.js]

A --> H[uploads]
A --> I[utils]
I --> I1[ApplicationError.js]
I --> I2[cookies.js]

A --> J[env.js]
A --> K[.env]
A --> L[.gitignore]
A --> M[logs.txt]
A --> N[package.json]
A --> O[package-lock.json]
A --> P[README.md]
A --> Q[server.js]
```

```
Postaway-II/
│── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.repository.js
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.model.js
│   │   ├── user/
│   │   │   ├── user.controller.js
│   │   │   ├── user.repository.js
│   │   │   ├── user.routes.js
│   │   │   ├── user.model.js
│   │   ├── post/
│   │   │   ├── post.controller.js
│   │   │   ├── post.repository.js
│   │   │   ├── post.routes.js
│   │   │   ├── post.model.js
│   │   ├── comment/
│   │   │   ├── comment.controller.js
│   │   │   ├── comment.repository.js
│   │   │   ├── comment.routes.js
│   │   │   ├── comment.model.js
│   │   ├── like/
│   │   │   ├── like.controller.js
│   │   │   ├── like.repository.js
│   │   │   ├── like.routes.js
│   │   │   ├── like.model.js
│   │   ├── friendship/
│   │   │   ├── friendship.controller.js
│   │   │   ├── friendship.repository.js
│   │   │   ├── friendship.routes.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── upload.middleware.js
│   │   └── logger.middleware.js
│   │
│   ├── utils/
│   │   └── ApplicationError.js
│   │
├── server.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

### ⚡ API Flow Diagram

```mermaid
sequenceDiagram
participant Client
participant Routes
participant Controller
participant Repository
participant MongoDB

Client->>Routes: Send request (e.g., POST /api/posts)
Routes->>Controller: Call appropriate controller
Controller->>Repository: Perform DB operations
Repository->>MongoDB: Query / Update database
MongoDB-->>Repository: Return data
Repository-->>Controller: Return result
Controller-->>Routes: Send response
Routes-->>Client: Return response (JSON)
```

---

## ⚡ API Endpoints

### Authentication Routes (`/api/users`)

* `POST /signup` → Register a new user
* `POST /signin` → Login user
* `POST /logout` → Logout current session
* `POST /logout-all-devices` → Logout user from all devices

### User Profile Routes (`/api/users`)

* `GET /get-details/:userId` → Get user info (password excluded)
* `GET /get-all-details` → Get all users info (passwords excluded)
* `PUT /update-details/:userId` → Update user profile & avatar

### Post Routes (`/api/posts`)

* `POST /` → Create a post
* `GET /all` → Get all posts (news feed)
* `GET /:postId` → Get a specific post
* `GET /:` → Get all posts for a specific user
* `PUT /:postId` → Update a post
* `DELETE /:postId` → Delete a post

### Comment Routes (`/api/comments`)

* `GET /:postId` → Get comments for a post
* `POST /:postId` → Add comment to a post
* `PUT /:commentId` → Update a comment
* `DELETE /:commentId` → Delete a comment

### Like Routes (`/api/likes`)

* `GET /:id` → Get likes for a post/comment
* `POST /toggle/:id` → Toggle like/unlike

### Friendship Routes (`/api/friends`)

* `GET /get-friends/:userId` → Get friends list
* `GET /get-pending-requests` → Get pending friend requests
* `POST /toggle-friendship/:friendId` → Send/cancel/unfriend
* `POST /response-to-request/:friendId` → Accept/reject a request

### OTP Routes (`/api/otp`)

* `POST /send` → Send OTP for password reset
* `POST /verify` → Verify OTP
* `POST /reset-password` → Reset password after OTP verification

---

## 🔐 Authentication & Security

* All routes except **signup & signin** are protected using **JWT**.
* Access & refresh tokens stored in cookies for session management.
* Password reset secured via **OTP verification**.

---

## ⚙️ Installation

```bash
# Clone repo
git clone https://github.com/UjjwalShakeya/postaway-api-mongo
cd postaway-api-mongo

# Install dependencies
npm install

# Create .env file with required configs
JWT_SECRET=your_secret_key
DB_URL=mongodb://localhost:27017/your_db_name
DB_NAME=your_db_name  
EMAIL_USER=your_email
EMAIL_PASS=your_email_password

# Run server
node server.js
```

---

## 🧪 Testing API

* Use **Postman / Thunder Client** to test endpoints.
* Example login response:

```json
{
  "success": true,
  "message": "Login successful",
}
```

---

## 📖 Documentation & Conventions

* **MVC & Repository Pattern**: Controller handles request/response, repository handles DB logic.
* **Error Handling**: Centralized via `ApplicationError`.
* **Pagination & Sorting**: Supported for posts & comments.
* **Ownership Validation**: Only owners can modify/delete their posts/comments.
* **Friendship Management**: Full CRUD support with pending request handling.

---

## 👨‍💻 Author

Developed by **Ujjwal Shakeya** ✨

---
