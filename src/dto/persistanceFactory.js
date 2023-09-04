import {
  ATLAS_DB_NAME,
  ATLAS_URI,
  MONGO_DB_NAME,
  MONGO_URI,
  PERSISTANCE,
  PORT,
} from "../config/config.js";
import mongoose from "mongoose";
import logger from "../utils/logger.js";

export const ServerUp = async (app) => {
  switch (PERSISTANCE) {
    case "DEV":
      try {
        await mongoose.connect(MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        logger.debug("DB development connected!");
        app.listen(PORT, () =>
          logger.info(`Server Up on http://localhost:${PORT}/api/products\n`)
        );
      } catch (err) {
        logger.fatal("Error when trying to start the server.\n", err)
      }
      break;

    case "PROD":
      try {
        await mongoose.connect(ATLAS_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        logger.debug("DB production connected!");
        app.listen(PORT, () =>
          logger.info(`Server Up on http://localhost:${PORT}/api/products\n`)
        );
      } catch (err) {
        logger.fatal("Error when trying to start the server.\n", err)
      }
      break;
  }
};
