# E-commerce Project - Revest Solutions Pvt Ltd

## Overview

This project showcases the development of a full-stack e-commerce application, built with Node.js, Express.js, Angular, and PostgreSQL. The backend implements CRUD operations for sales orders and products, while the frontend provides an interactive and dynamic user interface for browsing products, making purchases, and viewing orders.

The project also leverages the Dependency Injection (DI) principle through InversifyJS, ensuring a more modular and maintainable codebase. This allows for better management of service classes and their dependencies, promoting a clean and scalable architecture.

## Key Modules

1. Product Module
Dynamic Product Management: Users can easily create, read, update, and delete product listings with a user-friendly interface. This module allows for efficient management of products, with special attention to usability.
Advanced Filters: The product module includes dynamic filters based on various parameters, including price range, date ranges, name, email, and more, making it easy to find products that match specific criteria.
Internal vs. External Products: There are two types of product categories:
Internal Products: For internal users with restricted access.
External Products: For external users, with permissions for public-facing product listings.

2. Dynamic Integration Module
Third-party Integration: This module allows the system to dynamically integrate with external systems after each sale is completed. It supports third-party systems for sales order publishing by simply providing an API URL and Authorization Token.
Sale Publishing: Whenever a sale is made, the details are automatically pushed to the third-party system via a POST request to a configurable API endpoint.
Success Tracking: The system tracks whether the sale was successfully published to the third-party system and provides feedback on the status.

3. Sales/Order Module
Order Management: This module is specifically responsible for managing the creation and filtering of sales orders.
Advanced Filters for Sales: Similar to the Product module, the Sales module includes advanced filters like name, email, mobile number, and dates for efficient sales tracking.
Publication Status: The system can also track whether a sale was successfully published to the integrated third-party system, offering transparency and status updates.

## Getting Started

- Install **PostgreSQL** locally.
- Clone the repository.

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

automatically it reinstalls the packages and starts both ther FE & BE services locally
FE - port 4200
BE - Port 3000

## Api Documentation 
I have attached a postman collection export file prsent in the root directory

## Quick Note
I tried setting up test cases for both FE & BE but due to some configuration issues
was facing some issues so in the interest of time worked on theother important prorities 

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

- **Third-party API Integration**: 
  - After a sales transaction, the order details are pushed to a third-party API (`POST https://third-party-api.com/salesOrder`) using JWT authorization.

### Frontend Features

- **Header**: 
  - Landing page for Displaying a list of products with pagination
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

## Tools and Principles Used

## Tools and Principles Used

- **InversifyJS** for Dependency Injection (DI) to manage service classes.
- **Inversify-Express-Utils** for cleaner integration of DI with Express.
- **Separation of Layers** following a clean architecture with controller, service, and repository layers.
- **Type Safety** with **TypeScript** to reduce errors and improve development speed.
- **Code Commenting** to enhance readability and maintainability.
- **Best Practices**: 
  - Modular code with clear separation of concerns.
  - **RESTful API** design and integration.
  - **Database schema optimization** with **PostgreSQL**.
  - Use of **async/await** for asynchronous operations.
  - **Sequelize** ORM for managing relational databases and simplifying database queries and migrations.
  - **Sequelize with TypeScript**: Ensures type safety for database models and queries, providing better integration with the TypeScript ecosystem and reducing runtime errors.
  - **Logging**: Integrated **Winston** for structured and customizable logging, helping track system activities, errors, and events.

## Future Enhancements

- **Efficient Searches**: 
  - **Indexing**: Implement database indexing on frequently queried fields like product name, category, price, and order status to speed up search results.
  - **Caching**: Introduce caching mechanisms (e.g., Redis) to store frequently accessed data and reduce the load on the database, significantly improving search speed and performance.
  
- **Advanced Error Handling**:
  - **Order Status Tracking**: Improve error handling by tracking and logging order statuses throughout the sales process, ensuring that any failures are caught and reported.
  - **Third-party Publish Tracking**: Enhance the error management system to track whether a sale was successfully published to an integrated third-party system and log any failures or retries.
  - **Product Tracking**: Implement detailed error logging and tracking for product updates, creation, and deletion to ensure system reliability.

- **Object Storage for Static Data**: 
  - **Efficient Data Management**: Use object storage solutions (e.g., AWS S3 or Google Cloud Storage) for storing static data like product images, documents, and other media to improve scalability and access speed.

- **User Authentication**: 
  - **Role-Based Access Control (RBAC)**: Implement RBAC to provide granular access control, where different roles (admin, internal user, external user) have different levels of permissions for managing products, orders, and other system components.
  - **JWT Authentication**: Use JWT for secure user authentication and authorization, ensuring that only authorized users can access protected routes and resources.

- **Analytics Dashboard**:
  - **Sales Performance**: Integrate an analytics dashboard that tracks sales performance metrics like revenue, orders, top-selling products, etc.
  - **User Activity**: Track and display user behavior, such as browsing patterns, click-through rates, and conversion statistics, to gain insights for business decisions and optimize marketing strategies.

- **UI/UX Improvements**:
  - **Interactive Design**: Enhance the frontend by implementing a more interactive design with advanced features like interactive product filters, real-time price updates, and dynamic product recommendations.
  - **Product Recommendations**: Introduce a personalized recommendation engine that suggests products to users based on their browsing history, past purchases, or similar user behavior.





