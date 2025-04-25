import { Component, createSignal, For, onMount, Show } from "solid-js";
import { NavigationBar } from "../components/NavigationBar";
import { RoleService } from "../services/RoleService";
import { A } from "@solidjs/router";

const RolesPage: Component = () => {
  const [roles, setRoles] = createSignal<string[]>([]);

  onMount(async () => {
    let roleService = new RoleService();
    let roles = await roleService.getAllRoles();
    setRoles(roles);
  });

  return (
    <div>
      <NavigationBar />
      <div class="p-8">
        <h2 class="text-4xl">Roles</h2>
        <Show when={roles()}>
          <For each={roles()}>
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
