import React, { Component } from "react";
export default class MessageList extends Component {
  dateConverter(val) {
    return new Date(val).toTimeString().substring(0, 5);
  }

  render() {
    const styles = {
      container: {
        overflowY: "auto",
        height: 150,
        flex: 1
      },
      ul: {
        listStyle: "none"
      },
      li: {
        marginTop: 13,
        marginBottom: 13
      },
      senderUsername: {
        fontWeight: "bold"
      },
      message: { fontSize: 15 }
    };
    return (
      <div
        style={{
          ...this.props.style,
          ...styles.container
        }}
      >
        <ul style={styles.ul}>
          {this.props.messages.map((message, index) => (
            <li key={index} style={styles.li}>
              <div>
                {this.dateConverter(message.createdAt)}
                {" - "}
                <span style={styles.senderUsername}>
                  {message.senderId} said:
                </span>{" "}
              </div>
              <p style={styles.message}>{message.parts[0].payload.content}</p>
            </li>
          ))}
          {this.scrollToBottom}
        </ul>
      </div>
    );
  }
}
