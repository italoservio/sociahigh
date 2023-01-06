import axios, {AxiosResponse} from 'axios';
import {FastifyRequest} from 'fastify';
import {UserDTO} from '../../abstractions/dtos';

export async function retrieveExternalUserById(
  req: FastifyRequest,
  user_id: string,
): Promise<AxiosResponse<UserDTO>> {
  const domain = process.env.USER_MICROSERVICE_URL;
  const resource = `/api/v1/users/${user_id}`;
  const endpoint = domain + resource;

  return axios.get<UserDTO>(endpoint, {
    headers: {
      authorization: req.headers.authorization!,
    },
  });
}
