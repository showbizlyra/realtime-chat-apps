import React, { Component } from "react";
import { ChatManager, TokenProvider } from "@pusher/chatkit-client";
import MessageList from "./components/MessageList";
import SendMessageForm from "./components/SendMessageForm";
import TypingIndicator from "./components/TypingIndicator";
import WhosOnlineList from "./components/WhosOnlineList";

export default class ChatScreen extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      currentRoom: {},
      currentUser: {},
      userWhoAreTyping: []
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.sendTypingEvent = this.sendTypingEvent.bind(this);
  }

  componentDidMount() {
    const chatManager = new ChatManager({
      instanceLocator: "v1:us1:be883a3d-9227-450e-b386-e28cdb560205",
      userId: this.props.currentUsername,
      tokenProvider: new TokenProvider({
        url: "http://localhost:3001/authenticate"
      })
    });

    chatManager
      .connect()
      .then(currentUser => {
        this.setState({ currentUser });
        return currentUser.subscribeToRoomMultipart({
          roomId: "31198735",
          messageLimit: 10,
          hooks: {
            onMessage: res => {
              this.setState({
                messages: [res, ...this.state.messages]
              });
            },
            onUserStartedTyping: user => {
              this.setState({
                userWhoAreTyping: [...this.state.userWhoAreTyping, user.name]
              });
            },
            onUserStoppedTyping: user => {
              this.setState({
                userWhoAreTyping: this.state.userWhoAreTyping.filter(
                  username => username !== user.name
                )
              });
            },
            onPresenceChanged: () => this.forceUpdate(),
            onUserJoined: () => this.forceUpdate()
          }
        });
      })
      .then(currentRoom => {
        this.setState({ currentRoom });
      })
      .catch(err => {
        console.log("Error on connection", err);
      });
  }

  sendMessage(text) {
    this.state.currentUser.sendMessage({
      roomId: this.state.currentRoom.id,
      text
    });
  }

  sendTypingEvent() {
    this.state.currentUser
      .isTypingIn({ roomId: this.state.currentRoom.id })
      .catch(error => console.error("error", error));
  }

  render() {
    const styles = {
      container: {
        height: "100vh",
        display: "flex",
        flexDirection: "column"
      },
      chatContainer: {
        display: "flex",
        flex: 1
      },
      whosOnlineListContainer: {
        width: "300px",
        flex: "none",
        padding: 20,
        backgroundColor: "#2c303b",
        color: "white"
      },
      chatListContainer: {
        padding: 20,
        width: "85%",
        display: "flex",
        flexDirection: "column"
      }
    };
    return (
      <div style={styles.container}>
        <header style={styles.header} />
        <div style={styles.chatContainer}>
          <aside style={styles.whosOnlineListContainer}>
            <h2>Who's online</h2>
            <WhosOnlineList
              currentUser={this.state.currentUser}
              users={this.state.currentRoom.users}
            />
          </aside>
          <section style={styles.chatListContainer}>
            <SendMessageForm
              onSubmit={this.sendMessage}
              onChange={this.sendTypingEvent}
            />
            <MessageList
              messages={this.state.messages}
              style={styles.chatList}
            />
            <TypingIndicator usersWhoAreTyping={this.state.userWhoAreTyping} />
          </section>
        </div>
      </div>
    );
  }
}
