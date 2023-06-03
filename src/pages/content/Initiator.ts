import { EventHandlers } from "@pages/content/EventHandlers";
import { MessageHandlers } from "@pages/content/MessageHandlers";

MessageHandlers.init();
EventHandlers.registerDefaults();

const items = new Array(localStorage.length)
  .fill(null)
  .map((_, i) => {
    try {
      return JSON.parse(localStorage.getItem(localStorage.key(i)));
    } catch {
      return false;
    }
  })
  .filter(Boolean) as Deezqo.Data.Item[];

for (const item of items) {
  const element = document.querySelector(item.placement.selector);

  if (!element) {
    continue;
  }

  element.setAttribute("title", item.content);
  element.setAttribute("style", "background: red;");
}
