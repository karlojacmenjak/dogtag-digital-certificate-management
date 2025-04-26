import { Component, createSignal, For, onMount, Show } from "solid-js";
import { NavigationBar } from "../components/NavigationBar";
import { RoleService } from "../services/RoleService";
import { useNavigate, useParams } from "@solidjs/router";
import { Role } from "../models/Role";

const RoleDetails: Component = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [role, setRole] = createSignal<Role>();

  onMount(async () => {
    let roleService = new RoleService();
    let role = await roleService.getRole(params.name);
    setRole(role);
  });

  const deleteRole = async () => {};

  const editRole = () => {
    navigate("/roles/edit/" + role()?.name);
  };

  return (
    <div>
      <NavigationBar />
      <div class="p-8">
        <h2>Role details</h2>

        <Show when={role()}>
          {(value) => {
            let role = value()!;

            return (
              <div>
                <div class="mt-4">
                  <h3>Role name</h3>
                  <input
                    readOnly={true}
                    class="input"
                    type="text"
                    value={role.name}
                  />
                </div>

                <div class="mt-4">
                  <h3>Allowed domains</h3>

                  <div>
                    <For each={role.allowedDomains}>
                      {(item) => (
                        <div class="mt-2">
                          <input
                            readOnly={true}
                            class="input"
                            type="text"
                            value={item}
                          />
                        </div>
                      )}
                    </For>
                  </div>
                </div>

                <div>
                  <div class="mt-4">
                    <input
                      disabled={true}
                      checked={role.allowSubdomains}
                      class="checkbox"
                      type="checkbox"
                    />
                    <label class="ml-2 font-bold">Allow subdomains</label>
                  </div>

                  <div class="mt-4">
                    <input
                      disabled={true}
                      checked={role.allowWildcardCertificates}
                      class="checkbox"
                      type="checkbox"
                    />
                    <label class="ml-2 font-bold">
                      Allow wildcard certificates
                    </label>
                  </div>

                  <div class="mt-4">
                    <input
                      disabled={true}
                      checked={role.allowLocalhost}
                      class="checkbox"
                      type="checkbox"
                    />
                    <label class="ml-2 font-bold">Allow localhost</label>
                  </div>

                  <div class="mt-4">
                    <input
                      disabled={true}
                      checked={role.allowAnyName}
                      class="checkbox"
                      type="checkbox"
                    />
                    <label class="ml-2 font-bold">Allow any name</label>
                  </div>

                  <div class="mt-4">
                    <input
                      disabled={true}
                      checked={role.enforceHostnames}
                      class="checkbox"
                      type="checkbox"
                    />
                    <label class="ml-2 font-bold">Enforce hostnames</label>
                  </div>
                </div>
              </div>
            );
          }}
        </Show>

        <div class="mt-8">
          <button on:click={() => deleteRole()} class="btn btn-ghost">
            Delete role
          </button>

          <button on:click={() => editRole()} class="btn ml-4">
            Edit role
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleDetails;
