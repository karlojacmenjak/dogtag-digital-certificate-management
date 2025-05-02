import { GenerateCertificateResult } from "../models/Certificate";
import { AuthService } from "./AuthService";
import { Context } from "./Context";

export class CertificateService {
  private readonly beginCertificateRequest = "-----BEGIN CERTIFICATE REQUEST-----";
  private readonly endCertificateRequest = "-----END CERTIFICATE REQUEST-----";

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

  async getCertificate(serial: string) {
    let response = await fetch(Context.backend + "/v1/pki/cert/" + serial, {
      method: "GET",

      headers: new Headers({
        "X-Vault-Token": AuthService.getToken(),
      }),
    });

    let result = await response.json();

    if (response.status != 200) {
      throw new Error(result.errors.join("\n"));
    }

    let cert = new GenerateCertificateResult();

    cert.serial = serial;
    cert.certificatePem = result.data.certificate;

    return cert;
  }

  async createCertificate(roleName: string, commonName: string, expirationDate: Date) {
    roleName = roleName.trim();
    commonName = commonName.trim();

    if (roleName == "") {
      throw new Error("Role name is required.");
    }

    if (commonName == "") {
      throw new Error("Common name is required.");
    }

    let body = {
      common_name: commonName,
      format: "pem",
      private_key_format: "pem",
      not_after: expirationDate.toISOString(),
    };

    let response = await fetch(Context.backend + "/v1/pki/issue/" + roleName, {
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

    let cert = new GenerateCertificateResult();

    cert.serial = result.data.serial_number;
    cert.certificatePem = result.data.certificate;
    cert.privateKeyPem = result.data.private_key;

    return cert;
  }

  async signCertificate(roleName: string, commonName: string, csr: string, expirationDate: Date) {
    roleName = roleName.trim();
    commonName = commonName.trim();
    csr = csr.trim();

    if (roleName == "") {
      throw new Error("Role name is required.");
    }

    if (commonName == "") {
      throw new Error("Common name is required.");
    }

    if (!csr.startsWith(this.beginCertificateRequest) || !csr.endsWith(this.endCertificateRequest)) {
      throw new Error("Certificate signing request is not valid.");
    }

    let body = {
      csr: csr,
      common_name: commonName,
      not_after: expirationDate.toISOString(),
    };

    let response = await fetch(Context.backend + "/v1/pki/sign/" + roleName, {
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

    let cert = new GenerateCertificateResult();

    cert.serial = result.data.serial_number;
    cert.certificatePem = result.data.certificate;

    return cert;
  }
}
