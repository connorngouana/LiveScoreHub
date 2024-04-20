import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../userContext/ChatProvider";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../../config/ChatLogic";

const ScrollableChat = ({ messages }) => {
  const { user, token } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div
            style={{
              display: "flex",
              alignItems: user._id === m.sender._id ? "flex-end" : "flex-start", // Align user messages right and sender messages left
              justifyContent: user._id === m.sender._id ? "flex-end" : "flex-start", // Align user messages right and sender messages left
              marginBottom: "10px", // Add some spacing between messages
            }}
            key={m._id}
          >
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <span>
                  <Avatar
                    ml={1} // Adjust margin left for sender messages
                    mr={1} // Adjust margin right for user messages
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.picture}
                  />
                </span>
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                color: m.sender._id === user._id ? "#000000" : "#000000", // Set text color to black for sender messages
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
