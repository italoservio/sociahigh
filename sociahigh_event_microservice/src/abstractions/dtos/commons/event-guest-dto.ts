import schema from '../../schemas/commons/event-guest-schema';

export class EventGuestDTO {
  id?: string | Buffer;
  event_id?: string | Buffer;
  user_id?: string | Buffer;
  answer: string;
  answered_at: string | Date | null;
  invited_at: string;

  constructor(args: EventGuestDTO) {
    const {error} = schema.validate(args);
    if (error) throw error;
    Object.assign(this, args);
  }
}
