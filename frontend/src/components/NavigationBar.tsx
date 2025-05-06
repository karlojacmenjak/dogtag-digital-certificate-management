import { A } from "@solidjs/router";

export function NavigationBar() {
  return (
    <div class="navbar bg-base-100 shadow-sm">
      <div class="navbar-start">
        <button class="btn btn-ghost text-xl">
          <A href="/roles"> Roles </A>
        </button>

        <button class="btn btn-ghost text-xl ml-4">
          <A href="/certificates"> Certificates </A>
        </button>
      </div>

      <div class="navbar-end">
        <button class="btn btn-ghost text-xl">Log out</button>
      </div>
    </div>
  );
}
