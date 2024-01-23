import { Inject } from '@nestjs/common';

export function InjectRedis(connection = '') {
  const token = (connection)
    ? 'REDIS_' + connection.toUpperCase()
    : 'REDIS_DEFAULT';

  return Inject(token);
}
