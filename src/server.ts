import { createServer } from 'http';
import { app } from './app';
import "./config/env";

(async () => {

  createServer(app)
    .listen(
      process.env.PORT,
      () => {
        console.info(`Server running on port ${process.env.PORT}`)
      }
    );
})();