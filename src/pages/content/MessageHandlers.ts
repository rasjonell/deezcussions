import { MessageType } from "@src/helpers/enums";
import { EventHandlers } from "@pages/content/EventHandlers";

type ResponseCallback<T extends Deezqo.Events.MessageType> = (
  response: Deezqo.Utils.WithResposne<
    Deezqo.Utils.MessageFromMeta<T>
  >["response"]
) => void;

export const MessageHandlers = {
  init,
};

function init() {
  chrome.runtime.onMessage.addListener(
    (msg: Deezqo.Events.Message, _sender, sendResponse) => {
      if (msg.type === MessageType.INIT_COMMENT) {
        initCommentHandler(sendResponse);
      }
    }
  );
}

function initCommentHandler(
  sendResponse: ResponseCallback<Deezqo.Events.MessageType.INIT_COMMENT>
) {
  document.addEventListener("click", EventHandlers.addComment);

  sendResponse({
    success: true,
  });
}
