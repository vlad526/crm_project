export const TypesEnum = {
  PRO : 'pro',
  MINIMAL : 'minimal',
  PREMIUM : 'premium',
  INCUBATOR : 'incubator',
  VIP : 'vip',
} as const;
export type TypesEnum = typeof TypesEnum[keyof typeof TypesEnum];