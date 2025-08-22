---

# 📌 Postaway

Postaway is a social media backend application built with **Node.js, Express.js**.
It provides user authentication, post creation & management, comments, likes, bookmarks, and additional features like filtering, sorting, and pagination.

---

## 🚀 Features

### Core Features

* 👤 **User Management**: Register, login, view users.
* 📝 **Post Management**: Create, retrieve, update, and delete posts.
* 💬 **Comments**: Add, update, delete, and view comments on posts.
* 👍 **Likes**: Toggle like/unlike on posts.
* 🔐 **Authentication**: JWT-based secure authentication.
* 📦 **File Uploads**: Upload media for posts.
* 🛑 **Error Handling**: Centralized error middleware.
* 📑 **Logging**: Request logger middleware (excludes user routes).

### Additional Features Implemented

* 🔍 **Filter posts** by caption.
* 🗂 **Draft & Archive posts**.
* 📊 **Sort posts** by engagement & date.
* 📌 **Bookmark posts** for later.
* 📄 **Pagination** for posts & comments.

---

## 🛠 Tech Stack

* **Backend**: Node.js, Express.js
* **Authentication**: JWT (JSON Web Token)
* **Middleware**: Multer (file uploads), Morgan/Custom Logger
* **Error Handling**: Custom ApplicationError class

---

## 📂 Project Structure

```
Postaway/
│── src/
│   ├── modules/
│   │   ├── user/
│   │   │   ├── user.model.js
│   │   │   ├── user.controller.js
│   │   │   ├── user.routes.js
│   │   ├── post/
│   │   │   ├── post.model.js
│   │   │   ├── post.controller.js
│   │   │   ├── post.routes.js
│   │   ├── comment/
│   │   │   ├── comment.model.js
│   │   │   ├── comment.controller.js
│   │   │   ├── comment.routes.js
│   │   ├── like/
│   │   │   ├── like.model.js
│   │   │   ├── like.controller.js
│   │   │   ├── like.routes.js
│   │   ├── bookmark/
│   │   │   ├── bookmark.model.js
│   │   │   ├── bookmark.controller.js
│   │   │   ├── bookmark.routes.js
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

## ⚡ API Endpoints

### User Routes (`/api/users`)

* `POST /register` → Register a new user
* `POST /login` → Login user & get JWT
* `GET /` → Get all users

### Post Routes (`/api/posts`)

* `POST /` → Create a new post
* `GET /` → Get all posts (with filter, sort & pagination)
* `GET /:id` → Get post by ID
* `PUT /:id` → Update post
* `DELETE /:id` → Delete post
* `PATCH /:id/draft/archive` → Save as draft or Archive post

### Comment Routes (`/api/comments`)

* `POST /:postid` → Add comment to post
* `GET /:postid` → Get all comments on a post (with pagination)
* `PUT /:commentId` → Update comment
* `DELETE /:commentId` → Delete comment

### Like Routes (`/api/likes`)

* `POST /:postid/toggle` → like post
* `GET /:postid` → Get all likes on a post
* `DELETE /:postid/toggle`→ unlike on a post

### Bookmark Routes (`/api/bookmarks`)

* `POST /:postid` → Bookmark a post
* `GET /` → Get all bookmarked posts for user
* `DELETE /:postid` → Remove bookmark

---

## 🔐 Authentication & Security

* All routes except **User Registration & Login** are protected using **JWT authentication**.
* Use the token in `Authorization: Bearer <token>` header for secured routes.

---

## ⚙️ Installation

```bash
# Clone repo
git clone https://github.com/UjjwalShakeya/postaway-api.git
cd postaway-api

# Install dependencies
npm install

# Create .env file
JWT_SECRET=your_secret_key

# Run server
node server.js
```

---

## 🧪 Testing API

Use **Postman / Thunder Client** to test routes.
Example login response:

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

---

## 📖 Documentation

* Each module (User, Post, Comment, Like, Bookmark) follows **MVC pattern**.
* Error handling is centralized using `ApplicationError`.
* Logger middleware tracks API requests.
* Pagination & sorting supported in post & comment APIs.

---

## 👨‍💻 Author

Developed by **Ujjwal Shakeya** ✨

---