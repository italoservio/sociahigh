import * as config from '../../knexfile';
import knex, {Knex} from 'knex';

const knexConfig = (config as Knex.Config)[
  process.env.NODE_ENV! as keyof Knex.Config
];

export default knex(knexConfig as Knex.Config);
