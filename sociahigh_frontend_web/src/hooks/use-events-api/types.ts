import {AnswerEnum} from '../../utils/enums';
import {User} from '../use-users-api/types';

export type PaginationRequest = {
  page: string;
  page_size: string;
};

export type PaginationResponse<T> = {
  items: T[];
  page: string;
  pageSize: string;
};

export type EventPaginationRequest = PaginationRequest & {
  answer?: AnswerEnum[];
};

export type EventPaginationResponse = Event & {
  accepted_guests: number;
  total_guests: number;
  items_with_user: number;
  total_items: number;
};

export type UserInvitationsResponse = Event & {
  invitation: Invitation;
};

export type EventGuestsRequest = PaginationRequest & {
  name?: string;
};

export type EventGuestsResponse = Omit<Invitation, 'user_id'> & {
  user: User;
};

export type EventItemPaginationRequest = {
  with_user?: boolean;
} & PaginationRequest;

export type CreateEventRequest = {
  name: string;
  description: string;
  starts_at: string;
  address: Omit<Address, 'id'>;
};

export type EditEventRequest = {
  name?: string;
  description?: string;
  starts_at?: string;
  address?: Address;
};

export type UpdateItemRequest = {
  user_id: string;
};

export type InviteByEmailOrPhoneRequest = {
  phone?: string;
  email?: string;
};

export type Event = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  starts_at: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at?: any;
  address: Address;
  items: Item[];
};

export type Address = {
  id?: string;
  zip: string;
  place: string;
  number: string;
  city: string;
  state: string;
  country: string;
};

export type Invitation = {
  id: string;
  user_id: string;
  answer: AnswerEnum;
  answered_at: Date;
  invited_at: Date;
};

export type Item = {
  id: string;
  user_id: string;
  user?: User;
  name: string;
  value: number;
  event_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
};
