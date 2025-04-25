import { Context } from "./Context";

export class AuthService {
  async autologin(): Promise<boolean> {
    let token = sessionStorage.getItem("client_token");
    if (token == undefined) {
      return false;
    }

    let response = await fetch(Context.backend + "/v1//auth/token/lookup", {
      method: "POST",
      body: JSON.stringify({
        token: token,
      }),
      headers: new Headers({
        "X-Vault-Token": token,
      }),
    });

    let result = await response.json();

    if (response.status != 200) {
      return false;
    }

    return true;
  }

  async login(username: string, password: string) {
    let response = await fetch(Context.backend + "/v1/auth/userpass/login/" + username, {
      method: "POST",
      body: JSON.stringify({
        password: password,
      }),
      headers: new Headers(),
    });

    let result = await response.json();

    if (response.status != 200) {
      throw new Error(result.errors.join("\n"));
    }

    let token = result.auth.client_token;
    sessionStorage.setItem("client_token", token);
  }

  static getToken(): string {
    let token = sessionStorage.getItem("client_token");
    return token ?? "";
  }
}
