export const FormatsEnum = {
  STATIC : 'static',
  ONLINE : 'online',
} as const;
export type FormatsEnum = typeof FormatsEnum[keyof typeof FormatsEnum];