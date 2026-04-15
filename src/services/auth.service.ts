import type { User, UserRole } from '../types';

const USERS_KEY = 'team_finance_users';

function getStoredUsers(): (User & { passwordHash: string })[] {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users: (User & { passwordHash: string })[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function generateId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11);
}

export async function signUp(
  name: string,
  email: string,
  password: string,
  role: UserRole
): Promise<User> {
  const users = getStoredUsers();
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('A user with this email already exists.');
  }

  const passwordHash = await hashPassword(password);
  const newUser: User & { passwordHash: string } = {
    id: generateId(),
    name,
    email: email.toLowerCase(),
    role,
    createdAt: new Date().toISOString(),
    passwordHash,
  };

  users.push(newUser);
  saveUsers(users);

  const { passwordHash: _, ...user } = newUser;
  return user;
}

export async function login(
  email: string,
  password: string
): Promise<User> {
  const users = getStoredUsers();
  const passwordHash = await hashPassword(password);
  const found = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.passwordHash === passwordHash
  );
  if (!found) {
    throw new Error('Invalid email or password.');
  }
  const { passwordHash: _, ...user } = found;
  return user;
}

export function getAllUsers(): User[] {
  return getStoredUsers().map(({ passwordHash: _, ...u }) => u);
}

export function updateUserRole(userId: string, newRole: UserRole): User {
  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) throw new Error('User not found.');
  users[idx].role = newRole;
  saveUsers(users);
  const { passwordHash: _, ...user } = users[idx];
  return user;
}

export function deleteUser(userId: string): void {
  const users = getStoredUsers().filter((u) => u.id !== userId);
  saveUsers(users);
}
