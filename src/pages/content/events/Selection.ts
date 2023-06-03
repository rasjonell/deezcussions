import { cssPath } from "@src/helpers/selectors";

export const SelectionEvents = {
  init,
  handleSelectionChange,
};

let currentNode: HTMLElement | null = null;

function init() {
  document.addEventListener("selectionchange", handleSelectionChange);
}

function handleSelectionChange() {
  const selection = document.getSelection();
  const surroundingElement = selection.anchorNode?.parentElement;

  if (!(selection.toString().trim() && surroundingElement)) {
    return removeTooltip();
  }

  const selector = cssPath(surroundingElement);
  const boundingRect = selection.getRangeAt(0).getBoundingClientRect();
  const placement = {
    x: boundingRect.x,
    y: boundingRect.y,
    sx: window.scrollX,
    sy: window.scrollY,
  };

  console.log("selector:", selector);
  console.log("placement", placement);
  createTooltip(boundingRect);
}

function createTooltip(rect: DOMRect) {
  removeTooltip();

  currentNode = document.createElement("div");
  currentNode.classList.add("tooltip");
  currentNode.setAttribute(
    "style",
    `
    position: fixed;
    border: 2px solid black;
    background-color: transparent;

    width: ${rect.width}px;
    height: ${rect.height}px;
    top: ${rect.top - rect.height / 2}px;
    left: ${rect.left - rect.width / 2}px;
    `.trim()
  );

  document.body.appendChild(currentNode);
}

function removeTooltip(): void {
  if (currentNode) {
    currentNode.parentNode.removeChild(currentNode);
    currentNode = null;
  }
}
