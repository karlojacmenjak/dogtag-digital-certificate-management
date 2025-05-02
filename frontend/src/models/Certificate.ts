export class GenerateCertificateResult {
  serial: string = "";

  certificatePem: string = "";
  privateKeyPem: string = "";
}

export class Certificate {
  serial: string = "";
  certificatePem: string = "";

  isValid: boolean = false;

  issuerCommonName: string = "";
  subjectCommonName: string = "";
  subjectOrganization: string = "";
  subjectOrganizationalUnit: string = "";
  subjectLocality: string = "";
  subjectProvince: string = "";
  subjectCountry: string = "";

  notValidBefore!: Date;
  notValidAfter!: Date;

  isRevoked: boolean = false;
  revocationTime?: Date = undefined;
}
