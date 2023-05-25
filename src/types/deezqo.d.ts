declare namespace Deezqo {
  declare namespace Data {
    type Item = {
      content: string;
      url: {
        href: string;
        host: string;
        path: string;
        search: string;
      };
      placement: {
        x: number;
        y: number;
        sx: number;
        sy: number;
        selector: string;
      };
    };
  }

  declare namespace Events {
    enum MessageType {
      END_COMMENT,
      INIT_COMMENT,
    }

    type InitCommentResponse = {
      success: boolean;
    };

    type InitCommentMessage = {
      type: MessageType.INIT_COMMENT;
      resposne: InitCommentResponse;

      value: null;
    };

    type EndCommentResponse = {
      success: boolean;
    };

    type EndCommentMessage = {
      type: MessageType.END_COMMENT;
      response: EndCommentResponse;

      value: boolean;
    };

    type MessageWithResponse = InitCommentMessage | EndCommentMessage;

    type Message =
      | Utils.OmitResponse<InitCommentMessage>
      | Utils.OmitResponse<EndCommentMessage>;

    type MessageMeta = {
      type: MessageType;
    };
  }

  declare namespace Utils {
    type OmitResponse<M extends Events.MessageWithResponse> = Omit<
      M,
      "resposne"
    >;

    type WithResposne<M extends Events.Message> = M & {
      response: M["type"] extends Events.MessageType.INIT_COMMENT
        ? Events.InitCommentResponse
        : M["type"] extends Events.MessageType.END_COMMENT
        ? Events.EndCommentResponse
        : never;
    };

    type MessageFromMeta<M extends Events.MessageType> =
      M extends Events.MessageType.INIT_COMMENT
        ? Events.InitCommentMessage
        : M extends Events.MessageType.END_COMMENT
        ? Events.EndCommentMessage
        : never;
  }
}
