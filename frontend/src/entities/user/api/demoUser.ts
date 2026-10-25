import { demoRequest } from '../../../shared/api/demoRequest';
import type { User } from '../model/types';

const demoUser: User = {
  name: 'Иван Иванов',
  email: 'ivan.ivanov@example.com',
  joinedAt: '12 марта 2024',
  decksCount: 8,
};

export const fetchCurrentUser = () => demoRequest(demoUser);
