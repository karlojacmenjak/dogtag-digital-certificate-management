import { Component, createResource, createSignal, For, Show } from "solid-js";
import { NavigationBar } from "../components/NavigationBar";
import { RoleService } from "../services/RoleService";
import { A, useParams } from "@solidjs/router";

const RoleDetails: Component = () => {
  const params = useParams();

  const [getRole] = createResource(async () => {
    let service = new RoleService();
    return service.getRole(params.name);
  });

  return (
    <div>
      <NavigationBar />
      <div class="p-8">
        <h2 class="text-4xl">Role {params.name}</h2>
        <Show when={getRole()}>
          {(getRole) => {
            let role = getRole()!;
            return (
              <div>
                <p>{role.name}</p>
              </div>
            );
          }}
        </Show>
      </div>
    </div>
  );
};

export default RoleDetails;
