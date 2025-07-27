News Aggregator API

---

Project Overview:

This project provides a robust API for user authentication, managing user preferences, and fetching personalized news articles. Users can register, log in, define their news preferences (e.g., categories, sources), and then retrieve news articles tailored to those preferences.

Key Features:

- User Authentication: Secure user registration and login using JSON Web Tokens (JWT).
- User Preferences Management: Users can view and update their news preferences.
- Personalized News Feed: Fetch news articles relevant to a logged-in user's defined preferences.
- Secure Endpoints: All sensitive operations are protected by JWT-based authentication middleware.

---

Installation

To get this API up and running on your local machine, follow these steps:

Prerequisites

Make sure you have the following installed:

- Node.js: [LTS version recommended](https://nodejs.org/en/download/)
- npm (comes with Node.js)
- Git

Setup Steps

1.  Clone the Repository:

    ```bash
    git clone <your-repository-url>
    cd <your-project-folder>
    ```

    (Replace `<your-repository-url>` and `<your-project-folder>` with your actual repository URL and desired folder name.)

2.  Install Dependencies:

    npm install

3.  Create Environment Variables:
    Create a `.env` file in the root of your project and add the following:

        ```
        MONGODB_URI
        JWT_SECRET
        NEWS_API_BASE_URL="https://newsapi.org/"
        NEWS_API_KEY
        ```

        Important: Replace `your_super_secret_jwt_key` and any other placeholder values with strong, unique secrets. For `JWT_SECRET`, use a long, random string.

4.  Run the Application:
    ```bash
    npm start
    ```
    The API will now be running, typically on Server is listening on Port_Mentioned (or the port you specified in `.env`). Access it in the http://localhost:3000

---

API Endpoint Documentation

The API uses JSON Web Tokens (JWT) for authentication on protected routes.

Authentication

Mechanism: JSON Web Token (JWT) directly in the header.
How to Use: After a successful login, you'll receive a JWT. Include this token directly in the `Authorization` header of subsequent requests to protected endpoints.

Example Header:
`Authorization: <your_jwt_token_here>`

Endpoints

User Management

1. Register a New User

- Endpoint: `/users/signup`
- Method: `POST`
- Description: Creates a new user account.
- Request Body (JSON):
  ```json
  {
    "username": "unique_username",
    "email": "user@example.com",
    "password": "strong_password",
    "preferences": {
      "categories": [],
      "languages": [],
      "countries": [],
      "sources": []
    }
  }
  ```
- Response (Success - 200 Created):
  ```json
  {
    "message": "User with userId: {user.email} created successfully"
  }
  ```
- Response (Error - 400 Bad Request / 500 Internal Server Error):
  ```json
  {
    "message": "Error message"
  }
  ```

2. Login Existing User

- Endpoint: `/users/login`
- Method: `POST`
- Description: Authenticates a user and returns a JWT.
- Request Body (JSON):
  ```json
  {
    "email": "user@example.com",
    "password": "strong_password"
  }
  ```
- Response (Success - 200 OK):
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- Response (Error - 401 Unauthorized / 400 Bad Request):
  ```json
  {
    "message": "{respective error messages}"
  }
  ```

User Preferences

1. Get User Preferences

- Endpoint: `/users/preferences`
- Method: `GET`
- Description: Retrieves the news preferences for the authenticated user.
- Authentication: Required (JWT)
- Response (Success - 200 OK):
  ```json
  {
    "preferences": {
      "categories": ["technology", "sports"],
      "sources": ["BBC News", "CNN"],
      "languages": ["en"]
      // ... other preference fields
    }
  }
  ```
- Response (Error - 401 Unauthorized /404 Token Not found):
  ```json
  {
    "message": "Error message"
  }
  ```

2. Update User Preferences

- Endpoint: `/users/preferences`
- Method: `PUT`
- Description: Updates the news preferences for the authenticated user.
- Authentication: Required (JWT)
- Request Body (JSON):
  ```json
  {
    "categories": ["business", "science"],
    "sources": ["The New York Times"],
    "languages": ["es", "en"]
    // ... update specific preference fields
  }
  ```
- Response (Success - 200 OK):
  ```json
  {
    "message": "Preferences updated successfully"
  }
  ```
- Response (Error - 401 Unauthorized / 500 Internal Server Error):
  ```json
  {
    "message": "Error message"
  }
  ```

News Articles

1. Get News Articles

- Endpoint: `/news`
- Method: `GET`
- Description: Fetches news articles personalized to the authenticated user's preferences.
- Authentication: Required (JWT)
- Response (Success - 200 OK):
  ```json
  {
    "message": "fetched newsarticles",
    "news": {
      "status": "ok",
      "totalResults": 664,
      "articles": [
        // ... articles array ...
      ]
    }
  }
  ```
- Response (Error - 401 Unauthorized / 500 Internal Server Error):
  ```json
  {
    "message": "Error message"
  }
  ```
