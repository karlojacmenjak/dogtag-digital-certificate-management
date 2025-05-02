import { A, useParams } from "@solidjs/router";
import { Component, createSignal, onMount, Show } from "solid-js";
import { NavigationBar } from "../components/NavigationBar";
import { CertificateService } from "../services/CertificateService";
import { GenerateCertificateResult } from "../models/Certificate";

const SignCertificatePage: Component = () => {
  const params = useParams();

  const [roleName, setRoleName] = createSignal("");

  const [csrFile, setCsrFile] = createSignal<File | undefined>(undefined);

  const [commonName, setCommonName] = createSignal("");
  const [expirationDate, setExpirationDate] = createSignal("");

  const [certificate, setCertificate] = createSignal<
    GenerateCertificateResult | undefined
  >(undefined);

  const [certPemDataUrl, setCertPemDataUrl] = createSignal("");

  onMount(() => {
    setRoleName(params.role_name);
  });

  const signCertificate = async () => {
    let certService = new CertificateService();

    try {
      if (csrFile() == undefined) {
        throw new Error("Certificate signing request file is required.");
      }

      let csr = await csrFile()!.text();

      if (expirationDate() == "") {
        throw new Error("Not valid after date is required.");
      }

      let cert = await certService.signCertificate(
        roleName(),
        commonName(),
        csr,
        new Date(expirationDate())
      );

      setCertificate(cert);
      setCertPemDataUrl("data:text/plain;base64," + btoa(cert.certificatePem));
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div>
      <NavigationBar />

      <Show when={certificate() == undefined}>
        <div class="p-8">
          <h2>Sign certificate</h2>

          <div>
            <div class="mt-4">
              <h3>Role name</h3>
              <input
                readOnly={true}
                class="input"
                type="text"
                value={roleName()}
              />
            </div>

            <div class="mt-4">
              <h3>Certificate signing request</h3>
              <input
                class="file-input"
                type="file"
                accept={".csr,.pem,.txt"}
                on:change={(e) => {
                  let files = e.target.files;
                  if (files != undefined && files.length == 1) {
                    setCsrFile(files[0]);
                  }
                }}
              />
            </div>

            <div class="mt-4">
              <h3>Common name</h3>
              <input
                class="input"
                type="text"
                onInput={(e) => setCommonName(e.target.value)}
                value={commonName()}
              />
            </div>

            <div class="mt-4">
              <h3>Not valid after</h3>

              <input
                class="input"
                type="datetime-local"
                onChange={(e) => setExpirationDate(e.target.value)}
                value={expirationDate()}
              />
            </div>

            <div class="mt-8">
              <button on:click={() => signCertificate()} class="btn">
                Sign certificate request
              </button>
            </div>
          </div>
        </div>
      </Show>

      <Show when={certificate() != undefined}>
        <div class="p-8">
          <h2>Certificate request successfully signed</h2>

          <div class="mt-4">
            <h3>Serial number</h3>
            <input
              readOnly={true}
              class="input w-full"
              type="text"
              value={certificate()?.serial}
            />

            <A href={"/certificates/" + certificate()?.serial} target="_blank">
              <button class="btn mt-2">Details</button>
            </A>
          </div>

          <div class="mt-4">
            <h3>Certificate</h3>

            <textarea
              readOnly={true}
              class="textarea w-full rounded-lg"
              value={certificate()?.certificatePem}
            />
            <a
              href={certPemDataUrl()}
              download={certificate()?.serial + ".crt"}
            >
              <button class="btn mt-2">Download</button>
            </a>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default SignCertificatePage;
