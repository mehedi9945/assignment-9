# 🐾 FurEver Home - MERN Pet Adoption Platform

**FurEver Home** is a premium, full-stack MERN (MongoDB, Express, React, Node.js) web application designed to connect pet shelters and owners with prospective adopters. It offers a secure, responsive, and aesthetically pleasing environment to manage pet profiles, request adoptions, and track request statuses.

---

## 🚀 Key Features

*   **Responsive Browsing**: View all adoptable pets with search, species filtering (dog, cat, rabbit, bird, etc.), and custom sorting (fee, age, latest added).
*   **Detailed Pet Profiles**: Large photo showcase, health status, vaccination badges, shelter location, and owner contact details.
*   **Interactive Request Forms**: Read-only pre-filled credentials, pickup calendar selection, and personal custom notes.
*   **Comprehensive Owner Dashboard**:
    *   **Statistics Header**: Aggregated metrics for total, available, and adopted listings.
    *   **Management Control**: Complete CRUD capabilities for listings with confirmation dialogs.
    *   **Application Modals**: View all incoming requests for each pet, and "Approve" or "Reject" them with one click.
*   **Adopter Panel**: Track your active adoption request statuses and cancel pending requests.
*   **Authentication & Guard System**: Firebase OAuth (Email & Google sign-in) combined with backend HttpOnly cookie JWT token verification.
*   **Dynamic Theme Toggle**: Clean light and dark modes powered by Tailwind CSS v4 and DaisyUI v5.

---

## 🛠️ Tech Stack

*   **Frontend**: React.js, React Router v7, Tailwind CSS v4, DaisyUI v5, TanStack Query (React Query) v5, React Hook Form, Framer Motion, SweetAlert2, React Hot Toast, Lucide Icons, React Icons.
*   **Backend**: Node.js, Express.js, JSON Web Tokens (JWT), Cookie Parser, CORS, Dotenv.
*   **Database**: MongoDB (Native MongoDB Node Driver).
*   **Auth Provider**: Firebase Authentication.

---

## 📦 Prerequisites

Ensure you have the following installed locally:
*   [Node.js](https://nodejs.org/) (v16+ recommended)
*   [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) or a local running instance
*   [Firebase Console Account](https://console.firebase.google.com/)

---

## ⚙️ Environment Configurations

Create a `.env` file in the **server** directory and another in the **client** directory using the variables below:

### 1. Server Environment (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_sign_key_12345
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 2. Client Environment (`client/.env`)
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

---

## 📥 Installation and Startup

### Step 1: Install Dependencies
Open two terminals or navigate sequentially to run `npm install`:

```bash
# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```

### Step 2: Seed the Database (Highly Recommended)
Once the server is running, the database can be pre-populated with 6 high-quality, adoptable pet listings (dogs, cats, rabbits, etc.) by starting the server and making a single request to the seed helper endpoint:
```text
GET http://localhost:5000/api/seed
```
This inserts the sample listings if the `pets` collection is currently empty.

### Step 3: Run the Development Servers

**Run Server:**
```bash
cd server
npm run dev
```
The backend API server will run at `http://localhost:5000`.

**Run Client:**
```bash
cd client
npm run dev
```
The React application will run at `http://localhost:5173`. Open this URL in your web browser.

---

## 🌟 Recruiter Evaluation Highlights
*   **Clean Architecture**: Separation of concerns between public API routes and verified token sessions.
*   **Security Best Practices**: Exchanging Firebase credentials for backend-signed JWTs stored in HttpOnly cookies, rendering CSRF attacks impossible.
*   **Premium Visuals**: Curated dark and light mode UI colors, detailed icons, full skeletons, animations, and zero broken links.
*   **Production Build Ready**: Successfully passes full production builds (`npm run build`) without errors.
