import { getCliOrmConfig } from '@libs/core';
import * as dotenv from 'dotenv';

dotenv.config({ path: `env/.env.${process.env.NODE_ENV}` });

// @see https://mikro-orm.io/docs/configuration
export default getCliOrmConfig();
