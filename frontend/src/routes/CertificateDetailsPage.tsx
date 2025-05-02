import { Component, createSignal, onMount, Show } from "solid-js";
import { NavigationBar } from "../components/NavigationBar";
import { useParams } from "@solidjs/router";
import { CertificateService } from "../services/CertificateService";
import { GenerateCertificateResult } from "../models/Certificate";

const CertificateDetailsPage: Component = () => {
  const params = useParams();

  const [certificate, setCertificate] = createSignal<
    GenerateCertificateResult | undefined
  >(undefined);
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
              let certificate = value()!;

              return (
                <div>
                  <div class="mt-4">
                    <h3>Serial number</h3>
                    <input
                      readOnly={true}
                      class="input w-full"
                      type="text"
                      value={certificate.serial}
                    />
                  </div>

                  <div class="mt-4">
                    <h3>Certificate</h3>

                    <textarea
                      readOnly={true}
                      class="textarea w-full rounded-lg"
                      value={certificate.certificatePem}
                    />
                    <a
                      href={certPemDataUrl()}
                      download={certificate.serial + ".crt"}
                    >
                      <button class="btn mt-2">Download</button>
                    </a>
                  </div>
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
