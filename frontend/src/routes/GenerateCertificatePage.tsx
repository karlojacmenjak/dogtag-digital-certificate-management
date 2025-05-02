import { A, useParams } from "@solidjs/router";
import { Component, createSignal, onMount, Show } from "solid-js";
import { NavigationBar } from "../components/NavigationBar";
import { CertificateService } from "../services/CertificateService";
import { GenerateCertificateResult } from "../models/Certificate";

const GenerateCertificatePage: Component = () => {
  const params = useParams();

  const [roleName, setRoleName] = createSignal("");

  const [commonName, setCommonName] = createSignal("");
  const [expirationDate, setExpirationDate] = createSignal("");

  const [certificate, setCertificate] = createSignal<
    GenerateCertificateResult | undefined
  >(undefined);

  const [certPemDataUrl, setCertPemDataUrl] = createSignal("");
  const [privateKeyDataUrl, setPrivateKeyDataUrl] = createSignal("");

  onMount(() => {
    setRoleName(params.role_name);
  });

  const generateCertificate = async () => {
    let certService = new CertificateService();

    try {
      if (expirationDate() == "") {
        throw new Error("Not valid after date is required.");
      }

      let cert = await certService.createCertificate(
        roleName(),
        commonName(),
        new Date(expirationDate())
      );

      setCertificate(cert);
      setCertPemDataUrl("data:text/plain;base64," + btoa(cert.certificatePem));
      setPrivateKeyDataUrl(
        "data:text/plain;base64," + btoa(cert.privateKeyPem)
      );
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div>
      <NavigationBar />

      <Show when={certificate() == undefined}>
        <div class="p-8">
          <h2>Generate certificate</h2>

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
              <button on:click={() => generateCertificate()} class="btn">
                Generate certificate
              </button>
            </div>
          </div>
        </div>
      </Show>

      <Show when={certificate() != undefined}>
        <div class="p-8">
          <h2>Certificate successfully generated</h2>

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
            <h3>Private key</h3>

            <p class="font-bold">
              The private key is only available once. Make sure you copy and
              save it now.
            </p>

            <textarea
              readOnly={true}
              class="textarea w-full rounded-lg"
              value={certificate()?.privateKeyPem}
            />
            <a
              href={privateKeyDataUrl()}
              download={"private-" + certificate()?.serial + ".pem"}
            >
              <button class="btn mt-2">Download</button>
            </a>
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

export default GenerateCertificatePage;
