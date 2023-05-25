type Callback<M extends Deezqo.Events.MessageWithResponse> = (
  response: Deezqo.Utils.WithResposne<M>["response"]
) => void;

export function useMessage<M extends Deezqo.Events.MessageType>(type: M) {
  return (
    msg: Deezqo.Utils.MessageFromMeta<typeof type>["value"],
    cb: Callback<Deezqo.Utils.MessageFromMeta<typeof type>>
  ) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type, msg }, cb);
    });
  };
}
