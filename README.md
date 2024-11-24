# E-commerce Project - Revest Solutions Pvt Ltd

## Overview

This project showcases the development of a full-stack e-commerce application, built with **Node.js**, **Express.js**, **Angular**, and **PostgreSQL**. The backend implements CRUD operations for sales orders and products, while the frontend provides an interactive and dynamic user interface for browsing products, making purchases, and viewing orders.

*****ENVIRONMENT DETAILS****

HOST_DB = localhost
DB_USER = root
DB_NAME = ecom
PRIMARY_DB = postgres
SECRET_KEY = c17b751c-73d8-4ab2-b5e8-3d92410ad83c

******INSTALLATION & RUN*******

Please setup the environment as mentioned for the node BE server in the server directory

Start command -
Staying at the root directory

npm run start

automatically it reinstallas the packages and starts both ther FE & BE services locally
FE - port 4200
BE - Port 3000

### Project Highlights
- **Backend**: Implements REST APIs for managing products and sales orders, integrated with a PostgreSQL database. Includes features like product search and dynamic filtering of sales orders.
- **Frontend**: Developed with Angular, featuring a responsive layout with a carousel, product grid, and cross-sell products section. The UI allows users to interact with the backend services seamlessly.

## Functionality

### Backend Features

- **Node.js Service**: 
  - Handles sales orders and products.
  - Implements CRUD APIs to manage products and orders.
  - Integrates with PostgreSQL for database operations.
  
- **Sales Orders API**: 
  - Manage sales orders, including creating, updating, and deleting orders.
  - Implement search and dynamic filtering for sales orders based on name, email, mobile number, status, and order date.

- **Products API**: 
  - Create, update, delete, and retrieve product details.
  - Products can be added internally or externally.
  - **API Key for Internal Products API**: Use the following API key for internal product operations:

    ```text
    c17b751c-73d8-4ab2-b5e8-3d92410ad83c
    ```

- **Secret Key for Internal Products API**: To authenticate the internal API, please use the following secret key:

    ```text
    c17b751c-73d8-4ab2-b5e8-3d92410ad83c
    ```

- **Third-party API Integration**: 
  - After a sales transaction, the order details are pushed to a third-party API (`POST https://third-party-api.com/salesOrder`) using JWT authorization.

### Frontend Features

- **Header**: 
  - Navigation links: Home, Products, About, Contact.
  - A search bar for quick product search.
  - Shopping cart icon for easy access to cart details.

- **Footer**: 
  - Contact information (email, phone number, address).

- **Hero Section**: 
  - Large hero image with a carousel featuring at least three images.
  - Grabs attention and serves as a focal point for promotions.

- **Cross-Sell Products Section**: 
  - Display at least 4 products in a grid layout.
  - Display product price and name dynamically from the backend API.

## Tools and Principles Used

- **InversifyJS** for Dependency Injection (DI) to manage service classes.
- **Inversify-Express-Utils** for cleaner integration of DI with Express.
- **Separation of Layers** following a clean architecture with controller, service, and repository layers.
- **Type Safety** with TypeScript to reduce errors and improve development speed.
- **Code Commenting** to enhance readability and maintainability.
- **Best Practices**: 
  - Modular code with clear separation of concerns.
  - RESTful API design and integration.
  - Database schema optimization with PostgreSQL.
  - Use of async/await for asynchronous operations.

## Installation

### Prerequisites

- Install **PostgreSQL** locally.
- Clone the repository.
  
  ```bash
  git clone https://github.com/yourusername/yourrepo.git
  cd yourrepo
