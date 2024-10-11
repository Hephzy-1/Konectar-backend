import app from './app.js';
import config from './config/env.js';
import { sequelize } from './config/db.js';

// Start the server after connecting to the database
async function startServer() {
  try {
    // Authenticate and sync the database
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    // Sync database models (creates tables if they don't exist)
    await sequelize.sync();
    console.log('Database synchronized.');

    // Start the server
    const PORT = config.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();
