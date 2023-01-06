import {FastifyInstance} from 'fastify';
import {dtoInterceptor, jwtInterceptor} from 'italoservio_sociahigh';
import {
  AddItemsToEventDTO,
  AddUserToItemBodyDTO,
  AddUserToItemParamsDTO,
  CreateEventDTO,
  EditEventDTO,
  IdDTO,
  InviteUserDTO,
  PaginateEventDTO,
  PaginateGuestsDTO,
  PaginateItemDTO,
  PaginateUserInvitationsDTO,
  RemoveItemFromEventDTO,
  UpdateInvitationDTO,
} from './abstractions/dtos';
import {
  addItemsToEvent,
  addUserToItem,
  createEvent,
  editEvent,
  inviteUser,
  paginateEvent,
  paginateGuests,
  paginateItem,
  paginateUserInvitations,
  removeEvent,
  removeItemFromEvent,
  retrieveEventById,
  updateInvitation,
} from './cases';

export default async (server: FastifyInstance) => {
  server.route({
    method: 'PUT',
    url: '/invitations/:id',
    onRequest: [jwtInterceptor(server)],
    preValidation: [dtoInterceptor(UpdateInvitationDTO, 'body')],
    handler: updateInvitation,
  });

  server.route({
    method: 'GET',
    url: '/invitations',
    onRequest: [jwtInterceptor(server)],
    preValidation: [dtoInterceptor(PaginateUserInvitationsDTO, 'query')],
    handler: paginateUserInvitations,
  });

  server.route({
    method: 'GET',
    url: '/:id/invitations',
    onRequest: [jwtInterceptor(server)],
    preValidation: [
      dtoInterceptor(IdDTO, 'params'),
      dtoInterceptor(PaginateGuestsDTO, 'query'),
    ],
    handler: paginateGuests,
  });

  server.route({
    method: 'POST',
    url: '/:id/invitations',
    onRequest: [jwtInterceptor(server)],
    preValidation: [
      dtoInterceptor(IdDTO, 'params'),
      dtoInterceptor(InviteUserDTO, 'body'),
    ],
    handler: inviteUser,
  });

  server.route({
    method: 'DELETE',
    url: '/:id/items/:item_id',
    onRequest: [jwtInterceptor(server)],
    preValidation: [dtoInterceptor(RemoveItemFromEventDTO, 'params')],
    handler: removeItemFromEvent,
  });

  server.route({
    method: 'POST',
    url: '/:id/items',
    onRequest: [jwtInterceptor(server)],
    preValidation: [
      dtoInterceptor(IdDTO, 'params'),
      dtoInterceptor(AddItemsToEventDTO, 'body'),
    ],
    handler: addItemsToEvent,
  });

  server.route({
    method: 'GET',
    url: '/:id/items',
    onRequest: [jwtInterceptor(server)],
    preValidation: [
      dtoInterceptor(IdDTO, 'params'),
      dtoInterceptor(PaginateItemDTO, 'query'),
    ],
    handler: paginateItem,
  });

  server.route({
    method: 'PUT',
    url: '/:id/items/:item_id',
    onRequest: [jwtInterceptor(server)],
    preValidation: [
      dtoInterceptor(AddUserToItemParamsDTO, 'params'),
      dtoInterceptor(AddUserToItemBodyDTO, 'body'),
    ],
    handler: addUserToItem,
  });

  server.route({
    method: 'POST',
    url: '/',
    onRequest: [jwtInterceptor(server)],
    preValidation: [dtoInterceptor(CreateEventDTO, 'body')],
    handler: createEvent,
  });

  server.route({
    method: 'GET',
    url: '/',
    onRequest: [jwtInterceptor(server)],
    preValidation: [dtoInterceptor(PaginateEventDTO, 'query')],
    handler: paginateEvent,
  });

  server.route({
    method: 'PATCH',
    url: '/:id',
    onRequest: [jwtInterceptor(server)],
    preValidation: [
      dtoInterceptor(IdDTO, 'params'),
      dtoInterceptor(EditEventDTO, 'body'),
    ],
    handler: editEvent,
  });

  server.route({
    method: 'GET',
    url: '/:id',
    onRequest: [jwtInterceptor(server)],
    preValidation: [dtoInterceptor(IdDTO, 'params')],
    handler: retrieveEventById,
  });

  server.route({
    method: 'DELETE',
    url: '/:id',
    onRequest: [jwtInterceptor(server)],
    preValidation: [dtoInterceptor(IdDTO, 'params')],
    handler: removeEvent,
  });
};
