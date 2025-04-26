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

    role.allowBareDomains = result.data.allow_bare_domains;
    role.allowSubdomains = result.data.allow_subdomains;
    role.allowWildcardCertificates = result.data.allow_wildcard_certificates;
    role.allowLocalhost = result.data.allow_localhost;
    role.allowAnyName = result.data.allow_any_name;
    role.enforceHostnames = result.data.enforce_hostnames;

    role.organization = result.data.organization;
    role.organizationalUnit = result.data.ou;
    role.locality = result.data.locality;
    role.province = result.data.province;
    role.country = result.data.country;

    return role;
  }

  async createRole(role: Role) {
    role.name = role.name.trim();

    if (role.name.length == 0) {
      throw new Error("Role name is required.");
    }

    role.allowedDomains = role.allowedDomains.map((e) => e.trim()).filter((e) => e.length != 0);

    let response = await fetch(Context.backend + "/v1/pki/roles/" + role.name, {
      method: "POST",
      body: JSON.stringify(this.getRoleBody(role)),
      headers: new Headers({
        "X-Vault-Token": AuthService.getToken(),
      }),
    });

    let result = await response.json();

    if (response.status != 200) {
      throw new Error(result.errors.join("\n"));
    }
  }

  async updateRole(role: Role) {
    role.name = role.name.trim();

    if (role.name.length == 0) {
      throw new Error("Role name is required.");
    }

    role.allowedDomains = role.allowedDomains.map((e) => e.trim()).filter((e) => e.length != 0);

    let response = await fetch(Context.backend + "/v1/pki/roles/" + role.name, {
      method: "PATCH",
      body: JSON.stringify(this.getRoleBody(role)),
      headers: new Headers({
        "X-Vault-Token": AuthService.getToken(),
      }),
    });

    let result = await response.json();

    if (response.status != 200) {
      throw new Error(result.errors.join("\n"));
    }
  }

  async deleteRole(role: Role) {
    role.name = role.name.trim();

    let response = await fetch(Context.backend + "/v1/pki/roles/" + role.name, {
      method: "DELETE",
      headers: new Headers({
        "X-Vault-Token": AuthService.getToken(),
      }),
    });

    let result = await response.text();
  }

  private getRoleBody(role: Role) {
    return {
      allowed_domains: role.allowedDomains,

      allow_bare_domains: role.allowBareDomains,
      allow_subdomains: role.allowSubdomains,
      allow_wildcard_certificates: role.allowWildcardCertificates,
      allow_localhost: role.allowLocalhost,
      allow_any_name: role.allowAnyName,
      enforce_hostnames: role.enforceHostnames,

      organization: role.organization,
      ou: role.organizationalUnit,
      locality: role.locality,
      province: role.province,
      country: role.country,
    };
  }
}
