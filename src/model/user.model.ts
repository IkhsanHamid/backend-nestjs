export class RegisterUserRequest {
  username: string;
  password: string;
  name: string;
  roleId: number;
}

export class UserResponse {
  username: string;
  name: string;
  roleId: number;
}

export class LoginUserRequest {
  username: string;
  password: string;
}

export class LoginUserResponse {
  token: string;
}

export class UpdateUserRequest {
  name?: string;
  password?: string;
}
