import { Certificate, GenerateCertificateResult } from "../models/Certificate";
import { AuthService } from "./AuthService";
import { Context } from "./Context";
import * as pkijs from "pkijs";
import * as pvtsutils from "pvtsutils";

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

    let cert = new Certificate();

    cert.serial = serial;
    cert.certificatePem = result.data.certificate;
    this.getCertificateDetails(cert);

    if (result.data.revocation_time != 0) {
      cert.isRevoked = true;
      cert.revocationTime = new Date(result.data.revocation_time_rfc3339);
    }

    cert.isValid = this.getCertificateValidity(cert);

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

  async revokeCertificate(serial: string) {
    let body = {
      serial_number: serial,
    };

    let response = await fetch(Context.backend + "/v1/pki/revoke", {
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

  private getCertificateValidity(cert: Certificate) {
    if (cert.isRevoked) {
      return false;
    }

    let notBefore = cert.notValidBefore.getTime();
    let notAfter = cert.notValidAfter.getTime();
    let now = new Date().getTime();

    return now >= notBefore && now < notAfter;
  }

  private getCertificateDetails(cert: Certificate) {
    let pem = cert.certificatePem
      .replace("-----BEGIN CERTIFICATE-----", "")
      .replace("-----END CERTIFICATE-----", "")
      .replaceAll("\n", "")
      .replaceAll("\r", "")
      .trim();

    let buffer = pvtsutils.Convert.FromBase64(pem);
    let pkiCert = pkijs.Certificate.fromBER(buffer);

    const rdnmap: Record<string, string> = {
      CN: "2.5.4.3",
      O: "2.5.4.10",
      OU: "2.5.4.11",
      L: "2.5.4.7",
      ST: "2.5.4.8",
      C: "2.5.4.6",
    };

    let issuerAttrs = pkiCert.issuer.typesAndValues;
    let subjectAttrs = pkiCert.subject.typesAndValues;

    cert.issuerCommonName = this.getAttribute(issuerAttrs, rdnmap["CN"]);
    cert.subjectCommonName = this.getAttribute(subjectAttrs, rdnmap["CN"]);
    cert.subjectOrganization = this.getAttribute(subjectAttrs, rdnmap["O"]);
    cert.subjectOrganizationalUnit = this.getAttribute(subjectAttrs, rdnmap["OU"]);
    cert.subjectLocality = this.getAttribute(subjectAttrs, rdnmap["L"]);
    cert.subjectProvince = this.getAttribute(subjectAttrs, rdnmap["ST"]);
    cert.subjectCountry = this.getAttribute(subjectAttrs, rdnmap["C"]);

    cert.notValidBefore = pkiCert.notBefore.value;
    cert.notValidAfter = pkiCert.notAfter.value;
  }

  private getAttribute(attrs: pkijs.AttributeTypeAndValue[], type: string) {
    let attr = attrs.find((e) => e.type == type);
    if (attr == undefined) {
      return "";
    }

    return attr.value.valueBlock.value;
  }
}
