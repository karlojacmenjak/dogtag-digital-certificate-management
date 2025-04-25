import { Component, createSignal, For, onMount } from "solid-js";
import { NavigationBar } from "../components/NavigationBar";
import { RoleService } from "../services/RoleService";
import { useParams } from "@solidjs/router";
import { Role } from "../models/Role";

const RoleDetails: Component = () => {
  const params = useParams();

  const [role, setRole] = createSignal<Role>();

  const [name, setName] = createSignal<string>("");
  const [allowedDomains, setAllowedDomains] = createSignal<string[]>([]);

  onMount(async () => {
    let roleService = new RoleService();
    let role = await roleService.getRole(params.name);
    setRole(role);

    setName(role.name);
    setAllowedDomains(role.allowedDomains);
  });

  return (
    <div>
      <NavigationBar />
      <div class="p-8">
        <h2 class="text-4xl">Role</h2>
        <div>
          <h3>Role name</h3>
          <p>{name()}</p>
        </div>
        <div>
          <h3>Allowed domains</h3>
          <For each={allowedDomains()}>
            {(item, index) => (
              <div>
                <input type="text" value={item} />
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

export default RoleDetails;
