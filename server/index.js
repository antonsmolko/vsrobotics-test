// @ts-check
import fastify from 'fastify';
import fastifyCors from "fastify-cors";

import addRoutes from './routes.js';

const setUpCors = (app) => {
  app.register(fastifyCors, {
    origin: (origin, cb) => {
      if(/localhost/.test(origin)){
        cb(null, true)
        return
      }
      cb(new Error("Not allowed"))
    }
  });
};

export default async (options) => {
  const app = fastify({ logger: { prettyPrint: true } });
  setUpCors(app);
  addRoutes(app, options.state || {});

  return app;
};
