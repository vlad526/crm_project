export const CoursesEnum = {
  FS : 'FS',
  QACX : 'QACX',
  JCX : 'JCX',
  JSCX : 'JSCX',
  FE : 'FE',
  PCX : 'PCX',
} as const;
export type CoursesEnum = typeof CoursesEnum[keyof typeof CoursesEnum];



