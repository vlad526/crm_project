export const UserRoleEnum ={
  MANAGER : 'manager',
  ADMIN : 'admin',
} as const;

export type UserRoleEnum = typeof UserRoleEnum[keyof typeof UserRoleEnum];
