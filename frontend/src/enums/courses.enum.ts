export const CoursesEnum = {
  FS : 'fs',
  QACX : 'qacx',
  JCX : 'jcx',
  JSCX : 'jscx',
  FE : 'fe',
  PCX : 'pcx',
} as const;
export type CoursesEnum = typeof CoursesEnum[keyof typeof CoursesEnum];



