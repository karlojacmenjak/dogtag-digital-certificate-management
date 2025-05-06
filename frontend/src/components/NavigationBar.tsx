import { A, useNavigate } from "@solidjs/router";
import { AuthService } from "../services/AuthService";

export function NavigationBar() {
  const navigate = useNavigate();

  const logout = () => {
    let authService = new AuthService();
    authService.logout();
    navigate("/");
  };

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
        <button on:click={() => logout()} class="btn btn-ghost text-xl">
          Log out
        </button>
      </div>
    </div>
  );
}
