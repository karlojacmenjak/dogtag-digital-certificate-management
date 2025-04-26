import { A } from "@solidjs/router";

export function NavigationBar() {
  return (
    <div class="navbar bg-base-100 shadow-sm">
      <A href="/roles" class="btn btn-ghost text-xl">
        Roles
      </A>
      <A href="/certificates" class="btn btn-ghost text-xl ml-4">
        Certificates
      </A>
    </div>
  );
}
