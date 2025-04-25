import { Component, createResource, createSignal, For, onMount, Show } from "solid-js";
import { NavigationBar } from "../components/NavigationBar";
import { RoleService } from "../services/RoleService";
import { A, useParams } from "@solidjs/router";
import { Role } from "../models/Role";

const RoleDetails: Component = () => {
  const params = useParams();

  const [role, setRole] = createSignal<Role>();

  const [name, setName] = createSignal<string>("");
  const [allowedDomains, setAllowedDomains] = createSignal<string[]>([]);

  onMount(async () => {
    let service = new RoleService();
    let role = await service.getRole(params.name);
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
      </div>
    </div>
  );
};

export default RoleDetails;
