import { StrictMode } from "react";
import {createRoot} from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("react-root");

if(!rootElement) throw new Error("react app not configured correctly");

const root = createRoot(rootElement);

root.render(
    <StrictMode>
        <App/>
    </StrictMode>
)