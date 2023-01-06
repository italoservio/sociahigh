import {AnswerEnum} from '../../utils/enums';
import {useInterceptor} from '../../utils/interceptor';
import {
  CreateEventRequest,
  EditEventRequest,
  Event,
  EventGuestsRequest,
  EventGuestsResponse,
  EventItemPaginationRequest,
  EventPaginationRequest,
  EventPaginationResponse,
  Invitation,
  InviteByEmailOrPhoneRequest,
  Item,
  PaginationRequest,
  PaginationResponse,
  UpdateItemRequest,
  UserInvitationsResponse,
} from './types';

export function useEventsAPI() {
  const api = useInterceptor();
  const base = import.meta.env.VITE_EVENT_MICROSERVICE_URL;

  //#region Event
  async function createEvent(payload: CreateEventRequest) {
    const resource = '/api/v1/events/';
    return api.post<Event>(base + resource, payload);
  }

  async function editEvent(event_id: string, payload: EditEventRequest) {
    const resource = `/api/v1/events/${event_id}`;
    return api.patch<Event>(base + resource, payload);
  }

  async function retrieveEventById(event_id: string) {
    const resource = `/api/v1/events/${event_id}`;
    return api.get<Event>(base + resource);
  }

  async function retrieveEventPaginated(queryParams: PaginationRequest) {
    const resource = '/api/v1/events/';
    const query_string = '?' + new URLSearchParams(queryParams).toString();
    return api.get<PaginationResponse<EventPaginationResponse>>(
      base + resource + query_string,
    );
  }

  async function removeEvent(event_id: string) {
    const resource = `/api/v1/events/${event_id}`;
    return api.delete<null>(base + resource);
  }
  //#endregion

  //#region Items
  async function addItemToEvent(
    event_id: string,
    payload: Pick<Item, 'name' | 'value'>[],
  ) {
    const resource = `/api/v1/events/${event_id}/items`;
    return api.post<Item[]>(base + resource, {items: payload});
  }

  async function removeItemFromEvent(event_id: string, item_id: string) {
    const resource = `/api/v1/events/${event_id}/items/${item_id}`;
    return api.delete(base + resource);
  }

  async function retrieveEventItemsPaginated(
    event_id: string,
    queryParams: EventItemPaginationRequest,
  ) {
    const resource = `/api/v1/events/${event_id}/items`;
    const query_string =
      '?' +
      new URLSearchParams(queryParams as unknown as URLSearchParams).toString();
    return api.get<PaginationResponse<Item>>(base + resource + query_string);
  }

  async function updateItem(
    event_id: string,
    item_id: string,
    payload: UpdateItemRequest,
  ) {
    const resource = `/api/v1/events/${event_id}/items/${item_id}`;
    return api.put(base + resource, payload);
  }
  //#endregion

  //#region Invitations/Guests
  async function retrieveEventGuestsPaginated(
    event_id: string,
    queryParams: EventGuestsRequest,
  ) {
    const resource = `/api/v1/events/${event_id}/invitations`;
    const query_string = '?' + new URLSearchParams(queryParams).toString();
    return api.get<PaginationResponse<EventGuestsResponse>>(
      base + resource + query_string,
    );
  }

  async function retrieveUserInvitationsPaginated(
    queryParams: EventPaginationRequest,
  ) {
    const resource = '/api/v1/events/invitations';
    const query_string =
      '?' +
      new URLSearchParams(queryParams as unknown as URLSearchParams).toString();
    return api.get<PaginationResponse<UserInvitationsResponse>>(
      base + resource + query_string,
    );
  }

  async function updateInvitation(invitation_id: string, answer: AnswerEnum) {
    const resource = `/api/v1/events/invitations/${invitation_id}`;
    return api.put<Invitation>(base + resource, {answer});
  }

  async function inviteByPhoneOrEmail(
    event_id: string,
    payload: InviteByEmailOrPhoneRequest,
  ) {
    const resource = `/api/v1/events/${event_id}/invitations`;
    return api.post<Invitation>(base + resource, payload);
  }
  //#endregion

  return {
    createEvent,
    editEvent,
    retrieveEventById,
    removeEvent,
    addItemToEvent,
    removeItemFromEvent,
    retrieveEventPaginated,
    retrieveUserInvitationsPaginated,
    retrieveEventItemsPaginated,
    retrieveEventGuestsPaginated,
    inviteByPhoneOrEmail,
    updateInvitation,
    updateItem,
  };
}
