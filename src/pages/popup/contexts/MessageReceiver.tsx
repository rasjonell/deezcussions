import { MessageType } from "@src/helpers/enums";
import { createContext, useContext, useEffect, useState } from "react";

type MessageReceiverContext = {
  endComment: Deezqo.Events.EndCommentMessage["value"] | null;

  resetReceiver: () => void;
};

const MessageReceiver = createContext<MessageReceiverContext>({
  endComment: null,
  resetReceiver: () => {},
});

export const MessageReceiverProvider = ({
  children,
}: React.PropsWithChildren) => {
  const [endComment, setEndComment] = useState<
    Deezqo.Events.EndCommentMessage["value"] | null
  >(null);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg: Deezqo.Events.Message) => {
      if (msg.type === MessageType.END_COMMENT) {
        setEndComment(msg.value);
      }
    });
  }, [setEndComment]);

  const resetReceiver = () => {
    setEndComment(null);
  };

  return (
    <MessageReceiver.Provider
      value={{
        endComment,
        resetReceiver,
      }}
    >
      {children}
    </MessageReceiver.Provider>
  );
};

export const useMessageReceiver = () => useContext(MessageReceiver);
