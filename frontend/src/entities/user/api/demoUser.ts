import type { User } from '../model/types';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export async function fetchCurrentUser(): Promise<User> {
  const response = await fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}` } });
  if (!response.ok) throw new Error('Не удалось загрузить профиль');
  const user = await response.json();
  return { name: user.username, email: '', joinedAt: new Date(user.created_at).toLocaleDateString(), decksCount: 0 };
}
