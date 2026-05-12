# 🌍 WanderLust Server

This is the backend server for **WanderLust**, a travel-based application.  
It provides REST APIs to manage destination data using MongoDB.

---

## 🚀 Features

This server handles full CRUD operations for travel destinations:

### 📌 GET
- Get all destinations from MongoDB collection
- Get a single destination by **ID**

### ➕ POST
- Add a new destination

### ✏️ PATCH
- Update a destination using its **ID**

### ❌ DELETE
- Delete a destination using its **ID**

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose

---

## 📡 API Endpoints

| Method | Endpoint              | Description                |
|--------|----------------------|----------------------------|
| GET    | /destinations        | Get all destinations       |
| GET    | /destinations/:id    | Get single destination     |
| POST   | /destinations        | Create new destination     |
| PATCH  | /destinations/:id    | Update destination         |
| DELETE | /destinations/:id   | Delete destination         |

---

## 📦 Purpose

This project was built to practice:
- REST API development
- CRUD operations
- MongoDB integration
- Backend structure for full-stack apps

---

## ✨ Note

This is my first README file, and I’m continuously improving my backend development skills.
