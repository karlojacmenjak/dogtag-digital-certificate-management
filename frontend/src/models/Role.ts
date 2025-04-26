export class Role {
  name: string = "";
  allowedDomains: string[] = [];

  allowSubdomains: boolean = false;
  allowWildcardCertificates: boolean = false;
  allowLocalhost: boolean = false;
  allowAnyName: boolean = false;
  enforceHostnames: boolean = false;
}
