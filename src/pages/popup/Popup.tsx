import { useEffect, useState } from "react";

import { MessageType } from "@src/helpers/enums";

import { useMessage } from "@pages/popup/hooks/useMessage";
import { useMessageReceiver } from "@pages/popup/contexts/MessageReceiver";

const Popup = () => {
  const { endComment } = useMessageReceiver();
  const [isClicked, setIsClicked] = useState(false);
  const initMessage = useMessage(MessageType.INIT_COMMENT);

  useEffect(() => {
    if (endComment) {
      setIsClicked(false);
    }
  }, [endComment, setIsClicked]);

  const handleCommentClick = () => {
    initMessage(null, (resposne) => {
      setIsClicked(resposne.success);
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={handleCommentClick}>🧵</button>
        {isClicked ? (
          <p>Click somewhere on the page to leave a comment</p>
        ) : (
          <p>Click on the button to leave a comment</p>
        )}
      </header>
    </div>
  );
};

export default Popup;
