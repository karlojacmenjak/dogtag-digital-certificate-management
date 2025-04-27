import { Component, createSignal, For, onMount } from "solid-js";
import { NavigationBar } from "../components/NavigationBar";
import { A } from "@solidjs/router";
import { CertificateService } from "../services/CertificateService";

const CertificatesPage: Component = () => {
  const [allCerts, setAllCerts] = createSignal<string[]>([]);
  const [currentCerts, setCurrentCerts] = createSignal<string[]>([]);

  onMount(async () => {
    let certService = new CertificateService();
    let certificates = await certService.getAllCertificates();

    setAllCerts(certificates);
    setCurrentCerts(certificates);
  });

  const onSearch = (search: string) => {
    search = search.trim();

    if (search.length == 0) {
      setCurrentCerts(allCerts());
      return;
    }

    let certs = allCerts().filter((e) => e.includes(search));
    setCurrentCerts(certs);
  };

  return (
    <div>
      <NavigationBar />
      <div class="p-8">
        <h2>Certificates</h2>

        <div class="mt-4">
          <input
            class="input w-full"
            type="text"
            placeholder="Search certificates"
            onInput={(e) => onSearch(e.target.value)}
          />
        </div>

        <div class="mt-4">
          <For each={currentCerts()}>
            {(item) => (
              <A href={"/certificates/" + item}>
                <div class="border mt-4 p-2">{item}</div>
              </A>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

export default CertificatesPage;
