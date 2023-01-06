export class ErrorWithStatus extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ErrorWithStatus';
    this.status = status;
  }
}
