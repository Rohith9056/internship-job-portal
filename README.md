# Internship & Job Listing Portal 🚀

A full-stack web application for discovering internships and job opportunities, searching and filtering listings, viewing opportunity details, and submitting applications online.

The project also includes an admin dashboard for managing opportunities and viewing submitted applications.

---

## 📌 Project Overview

The Internship & Job Listing Portal provides a centralized platform where students and job seekers can find relevant internship and job opportunities.

Users can:

- Browse available opportunities
- Search opportunities by job title or company
- Filter opportunities by domain
- View complete opportunity details
- Apply through the portal
- Receive application confirmation

Administrators can:

- Login securely
- Add new opportunities
- Edit existing opportunities
- Delete opportunities
- View submitted applications
- Delete applications

---

## ✨ Features

### 👨‍💻 User Features

- View internship and job opportunities
- Search by job title or company
- Filter by domain
- View opportunity details
- Submit applications
- Application confirmation message
- Responsive user interface

### 🔐 Admin Features

- Admin login using JWT authentication
- Add opportunities
- Edit opportunities
- Delete opportunities
- View submitted applications
- Delete applications
- Admin logout

### 🎨 UI Features

- Modern glassmorphism design
- Responsive layout
- 3D career illustration
- Interactive cards
- Search and filter interface
- Hover animations
- Mobile-friendly design

---

## 🛠️ Technologies Used

### Frontend

- React.js
- Vite
- JavaScript
- CSS3
- HTML5

### Backend

- Node.js
- Express.js
- REST API

### Database

- MongoDB
- MongoDB Atlas
- Mongoose

### Authentication

- JSON Web Token (JWT)

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Google Chrome

---

## 📂 Project Structure

```text
internship-job-portal/
│
├── backend/
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Application.js
│   │   └── Opportunity.js
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   ├── career-3d.svg
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── responsive.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md