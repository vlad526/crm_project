export interface IActionTokenPayload {
  sub: number;
  email: string;
  action: 'activate' | 'recovery';
  iat?: number;
  exp?: number;
}
