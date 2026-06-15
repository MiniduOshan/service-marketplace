# Service Marketplace

Welcome to the Service Marketplace repository! This project is a comprehensive web application designed to connect customers with skilled workers (e.g., painters, electricians, plumbers).

Below is an overview of the technologies, frameworks, and techniques used to build both the frontend and backend of this platform.

## Technologies Used

### Frontend (Client-Side)
The frontend is a modern, reactive Single Page Application (SPA) built for high performance and excellent user experience.

- **[React](https://react.dev/) (v19):** The core JavaScript library for building the user interface using a component-based architecture.
- **[Vite](https://vitejs.dev/):** A lightning-fast build tool and development server that provides instant server start and hot module replacement (HMR).
- **[Tailwind CSS](https://tailwindcss.com/) (v4):** A utility-first CSS framework used for rapidly building responsive, custom designs without writing custom CSS files.
- **[React Router DOM](https://reactrouter.com/):** Handles client-side routing, enabling seamless navigation between pages without reloading the browser.
- **[Lucide React](https://lucide.dev/) & React Icons:** Provides clean, consistent, and customizable SVG icons across the UI.

### Backend (Server-Side API)
The backend acts as a robust, secure RESTful API that manages business logic, data persistence, and user authentication.

- **[Laravel](https://laravel.com/) (v12):** A powerful PHP framework that provides an elegant syntax and tools for routing, sessions, caching, and authentication.
- **[PHP](https://www.php.net/) (8.2+):** The underlying server-side programming language.
- **[MySQL](https://www.mysql.com/):** The relational database management system used to safely store users, bookings, services, and transactions.

### Mobile App (Cross-Platform)
The mobile application provides a native-like experience for both iOS and Android users, allowing them to book services or manage jobs on the go.

- **[Flutter](https://flutter.dev/):** Google's UI toolkit for building natively compiled applications for mobile from a single codebase.
- **[Dart](https://dart.dev/):** The programming language optimized for building fast apps on multiple platforms.
- **Key Packages:**
  - `http`: Handles REST API communication with the Laravel backend.
  - `google_sign_in`: Provides seamless social authentication via Google.
  - `shared_preferences`: Manages local on-device caching and session tokens securely.
  - `image_picker`: Allows users to upload profile pictures or job-related photos from their camera or gallery.

---

## Architectural Techniques & Concepts

1. **Decoupled Architecture:** 
   The frontend (React) and backend (Laravel) are completely separated. The React app consumes data from the Laravel application via standard HTTP endpoints (RESTful API). This ensures clear separation of concerns.

2. **Single Page Application (SPA):**
   The UI behaves like a native application. After the initial page load, React Router handles all subsequent navigation dynamically, resulting in a significantly faster and smoother user experience.

3. **RESTful API Design:**
   The backend exposes a structured API with predictable URLs (`/api/v1/...`) and uses standard HTTP methods (GET, POST, PATCH, DELETE) to interact with resources (e.g., bookings, users, services).

4. **Token-Based Authentication:**
   User sessions and API security are managed using authentication tokens. When a user logs in, they receive a secure token used to authenticate subsequent API requests.

5. **Utility-First Styling & Componentization:**
   Instead of writing large CSS files, styling is done directly within React components using Tailwind's utility classes. This keeps the styling scoped, modular, and easy to maintain.

6. **Relational Data Modeling (Eloquent ORM):**
   Laravel's Eloquent Object-Relational Mapper (ORM) is used to map database tables to PHP objects, allowing for intuitive data manipulation and complex relationship querying (e.g., fetching a booking along with its associated customer and worker).
