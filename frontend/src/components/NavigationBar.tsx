import { A } from "@solidjs/router";

export function NavigationBar() {
  return (
    <div class="navbar bg-base-100 shadow-sm">
      <A href="/roles" class="btn btn-ghost text-xl">
        Roles
      </A>
    </div>
  );
}
