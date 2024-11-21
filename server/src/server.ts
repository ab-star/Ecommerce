import { app } from './app';  // Import the app

const PORT = process.env.PORT || 3000;

const server = app.build();  // Get the underlying Express app instance

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
