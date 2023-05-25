import { createRoot } from "react-dom/client";

import Popup from "@pages/popup/Popup";

import refreshOnUpdate from "virtual:reload-on-update-in-view";

import "@pages/popup/index.css";
import { MessageReceiverProvider } from "./contexts/MessageReceiver";

refreshOnUpdate("pages/popup");

function init() {
  const appContainer = document.querySelector("#app-container");

  if (!appContainer) {
    throw new Error("Can not find #app-container");
  }

  createRoot(appContainer).render(
    <MessageReceiverProvider>
      <Popup />
    </MessageReceiverProvider>
  );
}

init();
