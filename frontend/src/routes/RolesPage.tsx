import { Component, createSignal, For, onMount } from "solid-js";
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
        <h2>Roles</h2>

        <div>
          <For each={roles()}>
            {(item) => (
              <A href={"/roles/details/" + item}>
                <div class="border mt-4 p-2">{item}</div>
              </A>
            )}
          </For>
        </div>

        <div class="mt-8">
          <A href={"/roles/create"}>
            <button class="btn">Create role</button>
          </A>
        </div>
      </div>
    </div>
  );
};

export default RolesPage;
