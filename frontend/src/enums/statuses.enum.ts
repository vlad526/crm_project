export const StatusesEnum ={
  INWORK : 'in_work',
  NEW : 'new',
  AGREE : 'agree',
  DISAGREE : 'disagree',
  DUBBING : 'dubbing',
} as const;

export type StatusesEnum = typeof StatusesEnum[keyof typeof StatusesEnum];


