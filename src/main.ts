import { GameApp } from "./app/GameApp";
import "./style.css";

const root = document.querySelector<HTMLElement>("#app");
if (!root) {
  throw new Error("Missing #app");
}

new GameApp(root).start();
