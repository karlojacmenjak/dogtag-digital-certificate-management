import type { Component } from "solid-js";
import { Username } from "./components/username";

const App: Component = () => {
  return (
    <div class="flex flex-row min-h-screen justify-center items-center">
      <div class="card card-border bg-base-100 w-96 shadow-sm">
        <figure>
          <img
            src="https://images.unsplash.com/photo-1454117096348-e4abbeba002c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Shoes"
          />
        </figure>
        <div class="card-body bg-neutral-600">
          <h2 class="card-title">Card Title</h2>
          <p>
            A card component has a figure, a body part, and inside body there
            are title and actions parts
          </p>
          <div class="card-actions">
            <Username />
          </div>
          <div class="card-actions">
            <Username />
          </div>
          <div class="card-actions justify-end">
            <button class="btn btn-primary">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
