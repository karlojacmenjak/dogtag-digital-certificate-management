import type { Component } from "solid-js";
import { Password } from "../components/password";
import { Username } from "../components/username";

const App: Component = () => {
  return (
    <div class="flex flex-row min-h-screen justify-center items-center">
      <div class="card card-border bg-base-100 w-96 shadow-sm">
        <figure>
          <img
            src="https://images.unsplash.com/photo-1454117096348-e4abbeba002c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Card Image"
          />
        </figure>
        <div class="card-body bg-neutral-600">
          <h2 class="card-title">Certificate Authority</h2>
          <p>
            Welcome to Certificate Authority management platform! To begin
            working with the platform, please login.
          </p>
          <div class="card-actions justify-evenly">
            <Username />
          </div>
          <div class="card-actions justify-evenly">
            <Password />
          </div>
          <div class="card-actions justify-end p-8">
            <button class="btn btn-primary">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
