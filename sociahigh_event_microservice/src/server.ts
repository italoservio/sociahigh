import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import fastify from 'fastify';
import {errorInterceptor} from 'italoservio_sociahigh';
import routes from './routes';

dotenv.config();

const server = fastify({logger: true});

server.register(cors, {
  origin: '*',
  methods: ['POST', 'PUT', 'DELETE', 'GET', 'PATCH'],
});
server.register(jwt, {secret: process.env.JWT_SECRET!});
server.register(helmet, {contentSecurityPolicy: false});
server.register(routes, {prefix: '/api/v1/events'});
server.setErrorHandler(errorInterceptor);

server.listen(
  {
    port: Number(process.env.SERVER_PORT),
    host: '0.0.0.0',
  },
  err => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
  },
);
