import { Role } from "../models/Role";
import { AuthService } from "./AuthService";
import { Context } from "./Context";

export class RoleService {
  async getAllRoles(): Promise<string[]> {
    let response = await fetch(Context.backend + "/v1/pki/roles", {
      method: "LIST",
      headers: new Headers({
        "X-Vault-Token": AuthService.getToken(),
      }),
    });

    let result = await response.json();
    return result.data.keys;
  }

  async getRole(name: string): Promise<Role> {
    let response = await fetch(Context.backend + "/v1/pki/roles/" + name, {
      method: "GET",
      headers: new Headers({
        "X-Vault-Token": AuthService.getToken(),
      }),
    });

    let result = await response.json();

    let role = new Role();
    role.name = name;
    role.allowedDomains = result.data.allowed_domains;

    return role;
  }
}
