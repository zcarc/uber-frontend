import React from "react";
import Header from "../../Components/Header";
import styled from "../../typed-components";
import { getChat, userProfile } from "src/types/api";
import Message from "src/Components/Message";

const Container = styled.div``;

interface IProps {
  data?: getChat;
  userData?: userProfile;
  loading: boolean;
}

const ChatPresenter: React.SFC<IProps> = ({
  loading,
  data: { GetChat: { chat = null } = {} } = {},
  userData: { GetMyProfile: { user = null } = {} } = {},
}) => (
  <Container>
    <Header title={"Chat"} />
    {!loading && chat && user && (
      <>
        {chat.messages &&
          chat.messages.map((message) => {
            if (message) {
              return (
                <Message
                  key={message.id}
                  text={message.text}
                  mine={user.id === message.userId}
                />
              );
            }
            return null;
          })}
      </>
    )}
  </Container>
);

export default ChatPresenter;
