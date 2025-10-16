export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export type VerifiedJwtPayload = JwtPayload & {
  iat?: number;
  exp?: number;
};
