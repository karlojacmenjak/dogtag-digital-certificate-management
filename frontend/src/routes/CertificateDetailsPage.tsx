import { Component, createSignal, onMount, Show } from "solid-js";
import { NavigationBar } from "../components/NavigationBar";
import { useParams } from "@solidjs/router";
import { CertificateService } from "../services/CertificateService";
import { Certificate } from "../models/Certificate";

const CertificateDetailsPage: Component = () => {
  const params = useParams();

  const [certificate, setCertificate] = createSignal<Certificate | undefined>(
    undefined
  );
  const [certPemDataUrl, setCertPemDataUrl] = createSignal("");

  onMount(async () => {
    let certService = new CertificateService();
    let cert = await certService.getCertificate(params.serial);

    setCertificate(cert);
    setCertPemDataUrl("data:text/plain;base64," + btoa(cert.certificatePem));
  });

  return (
    <div>
      <NavigationBar />
      <div class="p-8">
        <h2>Certificate details</h2>

        <div>
          <Show when={certificate()}>
            {(value) => {
              let cert = value()!;

              return (
                <div>
                  <div class="mt-4">
                    <h3>Serial number</h3>
                    <input
                      readOnly={true}
                      class="input w-full"
                      type="text"
                      value={cert.serial}
                    />
                  </div>

                  <div class="mt-4">
                    <h3>Certificate</h3>

                    <textarea
                      readOnly={true}
                      class="textarea w-full rounded-lg"
                      value={cert.certificatePem}
                    />
                    <a href={certPemDataUrl()} download={cert.serial + ".crt"}>
                      <button class="btn mt-2">Download</button>
                    </a>
                  </div>

                  <table class="table border mt-4">
                    <tbody>
                      <tr class="table-row">
                        <th>Issuer common name</th>
                        <td>{cert.issuerCommonName}</td>
                      </tr>

                      <tr class="table-row">
                        <th>Subject common name</th>
                        <td>{cert.subjectCommonName}</td>
                      </tr>

                      <tr class="table-row">
                        <th>Organization</th>
                        <td>{cert.subjectOrganization}</td>
                      </tr>

                      <tr class="table-row">
                        <th>OrganizationalUnit</th>
                        <td>{cert.subjectOrganizationalUnit}</td>
                      </tr>

                      <tr class="table-row">
                        <th>Locality</th>
                        <td>{cert.subjectLocality}</td>
                      </tr>

                      <tr class="table-row">
                        <th>Province</th>
                        <td>{cert.subjectProvince}</td>
                      </tr>

                      <tr class="table-row">
                        <th>Country</th>
                        <td>{cert.subjectCountry}</td>
                      </tr>

                      <tr class="table-row">
                        <th>Not valid before</th>
                        <td>{cert.notValidBefore.toLocaleString()}</td>
                      </tr>

                      <tr class="table-row">
                        <th>Not valid after</th>
                        <td>{cert.notValidAfter.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            }}
          </Show>
        </div>
      </div>
    </div>
  );
};

export default CertificateDetailsPage;
