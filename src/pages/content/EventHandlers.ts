import { MessageType } from "@src/helpers/enums";
import { cssPath } from "@src/helpers/selectors";
import { SelectionEvents } from "@pages/content/events/Selection";

export const EventHandlers = {
  addComment,
  registerDefaults,
};

function registerDefaults() {
  SelectionEvents.init();
}

function addComment(event: MouseEvent): void {
  const elementNode = event.target as HTMLElement;
  const content = prompt("leave your comment here");

  const item: Deezqo.Data.Item = {
    content,
    url: {
      href: window.location.href,
      host: window.location.host,
      path: window.location.pathname,
      search: window.location.search,
    },
    placement: {
      x: event.clientX,
      y: event.clientY,
      sx: window.scrollX,
      sy: window.scrollY,
      selector: cssPath(elementNode, true),
    },
  };

  localStorage.setItem(item.placement.selector, JSON.stringify(item));

  chrome.runtime.sendMessage<Omit<Deezqo.Events.EndCommentMessage, "response">>(
    {
      value: true,
      type: MessageType.END_COMMENT,
    }
  );

  document.removeEventListener("click", addComment);
}
