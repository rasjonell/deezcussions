import { cssPath } from "@src/helpers/selectors";

document.addEventListener("click", clickHandler);

function clickHandler(event: MouseEvent): void {
  const elementNode = event.target as HTMLElement;
  const content = prompt("leave your comment here");

  const item: Deez.Item = {
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
}

function init() {
  const items = new Array(localStorage.length)
    .fill(null)
    .map((_, i) =>
      JSON.parse(localStorage.getItem(localStorage.key(i)))
    ) as Deez.Item[];

  for (const item of items) {
    const element = document.querySelector(item.placement.selector);

    if (!element) {
      continue;
    }

    element.setAttribute("title", item.content);
    element.setAttribute("style", "background: red;");
  }
}

init();
