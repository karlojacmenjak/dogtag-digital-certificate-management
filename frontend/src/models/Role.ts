export class Role {
  name: string = "";
  allowedDomains: string[] = [];

  allowBareDomains: boolean = false;
  allowSubdomains: boolean = false;
  allowWildcardCertificates: boolean = false;
  allowLocalhost: boolean = false;
  allowAnyName: boolean = false;
  enforceHostnames: boolean = false;

  organization: string = "";
  organizationalUnit: string = "";
  locality: string = "";
  province: string = "";
  country: string = "";
}
