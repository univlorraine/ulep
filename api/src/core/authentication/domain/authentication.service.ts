export interface AuthenticationService {
  authenticate(accessToken: string): Promise<string>;

  login(email: string, password: string): Promise<string>;

  register(email: string, password: string): Promise<void>;
}
