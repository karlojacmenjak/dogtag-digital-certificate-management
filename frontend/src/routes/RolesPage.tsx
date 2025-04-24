import { Component, createResource, createSignal, For, Show } from "solid-js";
import { NavigationBar } from "../components/NavigationBar";
import { RoleService } from "../services/RoleService";
import { A } from "@solidjs/router";

const RolesPage: Component = () => {
  const [getRoles] = createResource(async () => {
    let service = new RoleService();
    return service.getAllRoles();
  });

  return (
    <div>
      <NavigationBar />
      <div class="p-8">
        <h2 class="text-4xl">Roles</h2>
        <Show when={getRoles()}>
          <For each={getRoles()}>
            {(item) => (
              <A href={"/roles/" + item}>
                <div class="border mt-4">{item}</div>
              </A>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
};

export default RolesPage;
