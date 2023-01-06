import {FastifyInstance} from 'fastify';
import {dtoInterceptor, jwtInterceptor} from 'italoservio_sociahigh';
import {
  AddressDTO,
  AuthenticateDTO,
  CreateUserDTO,
  IdDTO,
  PaginateUserAddressDTO,
  PaginateUserDTO,
  UserAddressByIdDTO,
} from './abstractions/dtos';
import {
  addressToUser,
  authenticateUser,
  createUser,
  paginateUser,
  paginateUserAddress,
  retrieveUserById,
  retrieveUserByToken,
  retrieveUserAddressById,
} from './cases';

export default async (server: FastifyInstance) => {
  server.route({
    method: 'POST',
    url: '/authenticate',
    preValidation: [dtoInterceptor(AuthenticateDTO, 'body')],
    handler: authenticateUser,
  });

  server.route({
    method: 'GET',
    url: '/profile',
    onRequest: [jwtInterceptor(server)],
    handler: retrieveUserByToken,
  });

  server.route({
    method: 'POST',
    url: '/:id/address',
    onRequest: [jwtInterceptor(server)],
    preValidation: [
      dtoInterceptor(IdDTO, 'params'),
      dtoInterceptor(AddressDTO, 'body'),
    ],
    handler: addressToUser,
  });

  server.route({
    method: 'GET',
    url: '/:id/address',
    onRequest: [jwtInterceptor(server)],
    preValidation: [
      dtoInterceptor(IdDTO, 'params'),
      dtoInterceptor(PaginateUserAddressDTO, 'query'),
    ],
    handler: paginateUserAddress,
  });

  server.route({
    method: 'GET',
    url: '/:id/address/:address_id',
    onRequest: [jwtInterceptor(server)],
    preValidation: [dtoInterceptor(UserAddressByIdDTO, 'params')],
    handler: retrieveUserAddressById,
  });

  server.route({
    method: 'POST',
    url: '/',
    preValidation: [dtoInterceptor(CreateUserDTO, 'body')],
    handler: createUser,
  });

  server.route({
    method: 'GET',
    url: '/',
    onRequest: [jwtInterceptor(server)],
    preValidation: [dtoInterceptor(PaginateUserDTO, 'query')],
    handler: paginateUser,
  });

  server.route({
    method: 'GET',
    url: '/:id',
    onRequest: [jwtInterceptor(server)],
    preValidation: [dtoInterceptor(IdDTO, 'params')],
    handler: retrieveUserById,
  });
};
