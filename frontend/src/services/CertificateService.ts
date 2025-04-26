import { AuthService } from "./AuthService";
import { Context } from "./Context";

export class CertificateService {
  async getAllCertificates(): Promise<string[]> {
    let response = await fetch(Context.backend + "/v1/pki/certs", {
      method: "LIST",
      headers: new Headers({
        "X-Vault-Token": AuthService.getToken(),
      }),
    });

    let result = await response.json();
    return result.data.keys;
  }
}
