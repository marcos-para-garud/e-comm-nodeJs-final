// 1. Import Exprerss
import express from 'express';
import swagger from 'swagger-ui-express';
import dotenv from "dotenv";

import productRouter from './transaction in MongoDb-IV/src/features/product/product.routes.js';
import userRouter from './transaction in MongoDb-IV/src/features/user/user.routes.js';
import jwtAuth from './transaction in MongoDb-IV/src/middlewares/jwt.middleware.js';
import cartRouter from './transaction in MongoDb-IV/src/features/cartItems/cartItems.routes.js';
import apiDocs from './transaction in MongoDb-IV/swagger.json' assert { type: 'json' };
import loggerMiddleware from './transaction in MongoDb-IV/src/middlewares/logger.middleware.js';
import { ApplicationError } from './transaction in MongoDb-IV/src/error-handler/applicationError.js';
import {connectToMongoDB} from './transaction in MongoDb-IV/src/config/mongodb.js';
import orderRouter from './transaction in MongoDb-IV/src/features/order/order.routes.js';

// 2. Create Server
const server = express();

// load all the environment variables in application
dotenv.config();

// CORS policy configuration
server.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Origin',
    'http://localhost:5500'
  );
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  // return ok for preflight request.
  if (req.method == 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

server.use(express.json());
// Bearer <token>
// for all requests related to product, redirect to product routes.
// localhost:3200/api/products
server.use(
  '/api-docs',
  swagger.serve,
  swagger.setup(apiDocs)
);

server.use(loggerMiddleware);
server.use('/api/orders', jwtAuth, orderRouter);

server.use(
  '/api/products',
  jwtAuth,
  productRouter
);
server.use(
  '/api/cartItems',
  loggerMiddleware,
  jwtAuth,
  cartRouter
);
server.use('/api/users', userRouter);

// 3. Default request handler
server.get('/', (req, res) => {
  res.send('Welcome to Ecommerce APIs');
});

// Error handler middleware
server.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof ApplicationError) {
    return res.status(err.code).send(err.message);
  }

  // server errors.
  res
    .status(500)
    .send(
      'Something went wrong, please try later'
    );
});

// 4. Middleware to handle 404 requests.
server.use((req, res) => {
  res
    .status(404)
    .send(
      'API not found. Please check our documentation for more information at localhost:3200/api-docs'
    );
});

// 5. Specify port.
server.listen(3200, ()=>{
  console.log('Server is running at 3200');
  connectToMongoDB();
});

