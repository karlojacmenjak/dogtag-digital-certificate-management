import { Component, createSignal, For, onMount, Show } from "solid-js";
import { NavigationBar } from "../components/NavigationBar";
import { RoleService } from "../services/RoleService";
import { A } from "@solidjs/router";
import { CertificateService } from "../services/CertificateService";

const CertificatesPage: Component = () => {
  const [certificates, setCertificates] = createSignal<string[]>([]);

  onMount(async () => {
    let certService = new CertificateService();
    let certificates = await certService.getAllCertificates();
    setCertificates(certificates);
  });

  return (
    <div>
      <NavigationBar />
      <div class="p-8">
        <h2>Certificates</h2>

        <div>
          <Show when={certificates()}>
            <For each={certificates()}>
              {(item) => <div class="border mt-4 p-2">{item}</div>}
            </For>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default CertificatesPage;
