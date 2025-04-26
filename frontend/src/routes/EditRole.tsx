import { Component, createSignal, For, onMount, Show } from "solid-js";
import { NavigationBar } from "../components/NavigationBar";
import { RoleService } from "../services/RoleService";
import { useLocation, useNavigate, useParams } from "@solidjs/router";
import { Role } from "../models/Role";
import { createStore } from "solid-js/store";
import { ArrayUtils } from "../utils/ArrayUtils";

class RoleFields {
  name: string = "";

  allowSubdomains: boolean = false;
  allowWildcardCertificates: boolean = false;
  allowLocalhost: boolean = false;
  allowAnyName: boolean = false;
  enforceHostnames: boolean = false;
}

const EditRole: Component = () => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const [role, setRole] = createSignal<Role>();

  const [fields, setFields] = createStore<RoleFields>(new RoleFields());
  const [allowedDomains, setAllowedDomains] = createStore<string[]>([]);
  const [newDomain, setNewDomain] = createSignal("");

  const [editMode, setEditMode] = createSignal(true);

  const readRole = (role: Role) => {
    setFields("name", role.name);
    setAllowedDomains(role.allowedDomains);

    setFields("allowSubdomains", role.allowSubdomains);
    setFields("allowWildcardCertificates", role.allowWildcardCertificates);
    setFields("allowLocalhost", role.allowLocalhost);
    setFields("allowAnyName", role.allowAnyName);
    setFields("enforceHostnames", role.enforceHostnames);
  };

  const fillRole = (role: Role) => {
    role.name = fields.name;
    role.allowedDomains = allowedDomains;

    role.allowSubdomains = fields.allowSubdomains;
    role.allowWildcardCertificates = fields.allowWildcardCertificates;
    role.allowLocalhost = fields.allowLocalhost;
    role.allowAnyName = fields.allowAnyName;
    role.enforceHostnames = fields.allowLocalhost;
  };

  onMount(async () => {
    if (location.pathname.startsWith("/roles/create")) {
      setEditMode(false);

      setFields("allowLocalhost", true);
      setFields("enforceHostnames", true);
      return;
    }

    let roleService = new RoleService();
    let role = await roleService.getRole(params.name);

    setRole(role);
    readRole(role);
  });

  const createRole = async () => {
    let roleService = new RoleService();
    let newRole = new Role();

    fillRole(newRole);

    try {
      await roleService.createRole(newRole);
      navigate("/roles/details/" + newRole.name);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const saveChanges = async () => {
    let roleService = new RoleService();
    let updatedRole = new Role();

    fillRole(updatedRole);
    updatedRole.name = role()!.name;

    try {
      await roleService.createRole(updatedRole);
      navigate("/roles/details/" + updatedRole.name);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const addAllowedDomain = () => {
    let domain = newDomain().trim();
    if (domain == "") {
      return;
    }

    setAllowedDomains([...allowedDomains, domain]);
    setNewDomain("");
  };

  const removeAllowedDomain = (index: number) => {
    let t = ArrayUtils.removeIndex(allowedDomains, index);
    setAllowedDomains(t);
  };

  return (
    <div>
      <NavigationBar />
      <div class="p-8">
        <h2>{editMode() ? "Edit role" : "Create role"}</h2>

        <div>
          <div class="mt-4">
            <h3>Role name</h3>
            <input
              readOnly={editMode()}
              class="input"
              type="text"
              onInput={(e) => setFields("name", e.target.value)}
              value={fields.name}
            />
          </div>

          <div class="mt-4">
            <h3>Allowed domains</h3>

            <div>
              <For each={allowedDomains}>
                {(item, index) => (
                  <div class="mt-2">
                    <input
                      class="input"
                      type="text"
                      value={item}
                      onInput={(e) => {
                        allowedDomains[index()] = e.target.value;
                      }}
                    />
                    <button
                      on:click={() => removeAllowedDomain(index())}
                      class="btn ml-2"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </For>

              <div class="mt-2">
                <input
                  class="input"
                  type="text"
                  onInput={(e) => setNewDomain(e.target.value)}
                  value={newDomain()}
                />
                <button on:click={() => addAllowedDomain()} class="btn ml-2">
                  Add
                </button>
              </div>
            </div>
          </div>

          <div>
            <div class="mt-4">
              <input
                checked={fields.allowSubdomains}
                onInput={(e) => setFields("allowSubdomains", e.target.checked)}
                class="checkbox"
                type="checkbox"
              />
              <label class="ml-2 font-bold">Allow subdomains</label>
            </div>

            <div class="mt-4">
              <input
                checked={fields.allowWildcardCertificates}
                onInput={(e) =>
                  setFields("allowWildcardCertificates", e.target.checked)
                }
                class="checkbox"
                type="checkbox"
              />
              <label class="ml-2 font-bold">Allow wildcard certificates</label>
            </div>

            <div class="mt-4">
              <input
                checked={fields.allowLocalhost}
                onInput={(e) => setFields("allowLocalhost", e.target.checked)}
                class="checkbox"
                type="checkbox"
              />
              <label class="ml-2 font-bold">Allow localhost</label>
            </div>

            <div class="mt-4">
              <input
                checked={fields.allowAnyName}
                onInput={(e) => setFields("allowAnyName", e.target.checked)}
                class="checkbox"
                type="checkbox"
              />
              <label class="ml-2 font-bold">Allow any name</label>
            </div>

            <div class="mt-4">
              <input
                checked={fields.enforceHostnames}
                onInput={(e) => setFields("enforceHostnames", e.target.checked)}
                class="checkbox"
                type="checkbox"
              />
              <label class="ml-2 font-bold">Enforce hostnames</label>
            </div>
          </div>
        </div>

        <div class="mt-8">
          <Show when={editMode()}>
            <button on:click={() => saveChanges()} class="btn">
              Save changes
            </button>
          </Show>

          <Show when={!editMode()}>
            <button on:click={() => createRole()} class="btn ml-4">
              Create role
            </button>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default EditRole;
