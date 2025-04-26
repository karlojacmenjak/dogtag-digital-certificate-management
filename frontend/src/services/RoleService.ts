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

    role.allowSubdomains = result.data.allow_subdomains;
    role.allowWildcardCertificates = result.data.allow_wildcard_certificates;
    role.allowLocalhost = result.data.allow_localhost;
    role.allowAnyName = result.data.allow_any_name;
    role.enforceHostnames = result.data.enforce_hostnames;

    return role;
  }

  async createRole(role: Role) {
    role.name = role.name.trim();

    let body = {
      allowed_domains: role.allowedDomains,
      allow_subdomains: role.allowSubdomains,
      allow_wildcard_certificates: role.allowWildcardCertificates,
      allow_localhost: role.allowLocalhost,
      allow_any_name: role.allowAnyName,
      enforce_hostnames: role.enforceHostnames,
    };

    let response = await fetch(Context.backend + "/v1/pki/roles/" + role.name, {
      method: "POST",
      body: JSON.stringify(body),
      headers: new Headers({
        "X-Vault-Token": AuthService.getToken(),
      }),
    });

    let result = await response.json();

    if (response.status != 200) {
      throw new Error(result.errors.join("\n"));
    }
  }
}
