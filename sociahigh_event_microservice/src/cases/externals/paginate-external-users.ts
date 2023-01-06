import axios, {AxiosResponse} from 'axios';
import {FastifyRequest} from 'fastify';
import {UserDTO, PaginateUserDTO, PaginateDTO} from '../../abstractions/dtos';

export async function paginateExternalUsers(
  req: FastifyRequest,
  filters: PaginateUserDTO,
): Promise<AxiosResponse<PaginateDTO & {items: UserDTO[]}>> {
  const query_params = new URLSearchParams(
    filters as unknown as Record<string, string>,
  ).toString();

  const domain = process.env.USER_MICROSERVICE_URL;
  const resource = `/api/v1/users?${query_params}`;
  const endpoint = domain + resource;

  return axios.get<PaginateDTO & {items: UserDTO[]}>(endpoint, {
    headers: {
      authorization: req.headers.authorization!,
    },
  });
}
