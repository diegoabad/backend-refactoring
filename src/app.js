import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
import path from "path";
import passport from "passport";
import { fileURLToPath } from "url";
import swaggerJSDoc from "swagger-jsdoc";
import SwaggerUiExpress from "swagger-ui-express";

import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import sessionRouter from "./routers/session.router.js";
import loggerTest from "./routers/loggerTest.router.js";
import initializePassport from "./config/passport.config.js";
import { MONGO_DB_NAME, MONGO_URI } from "./config/config.js";
import { generateProductsMocking, roleAccess } from "./utils/utils.js";
import { ServerUp } from "./dto/persistanceFactory.js";
import { generateProducts } from "./utils/utils.js";
import errorHandler from "./middleware/error.middleware.js";
import error404 from "./middleware/404.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.disable("x-powered-by");
app.use(errorHandler);

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "API documentation - Refactoring",
      description: "Documentation of routing products and carts",
    },
  },
  apis: ["./docs/**/*.yaml"],
};

const specs = swaggerJSDoc(swaggerOptions);

const hbs = exphbs.create();
app.engine("handlebars", hbs.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      dbName: MONGO_DB_NAME,
    }),
    secret: "Chris-P-Bacon",
    resave: true,
    saveUninitialized: true,
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/api/session/login");
};

app.use("/api/products", ensureAuthenticated, roleAccess, productsRouter);
app.use("/api/carts", ensureAuthenticated, roleAccess, cartsRouter);
app.use("/api/session", sessionRouter);
app.use("/api/loggerTest", loggerTest);
app.use("/docs", SwaggerUiExpress.serve, SwaggerUiExpress.setup(specs));
app.use(error404);

// mocking products
generateProductsMocking();

// DB products
generateProducts();

ServerUp(app);
