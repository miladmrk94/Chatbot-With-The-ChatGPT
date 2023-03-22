import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react"


const API_KEY = "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"

function App() {
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      message: "سلام 🖐 - چطور میتونم کمکت کنم ؟",
      sender: "هوش مصنوعی 🤖"
    }
  ])

  const handlerSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "کاربر",
      direction: "outgoing"
    }

    const newMessages = [...messages, newMessage]

    setMessages(newMessages)
    setTyping(true)
    await prosesMessageGTP(newMessages)
  }

  async function prosesMessageGTP(chatMessages) {
    let apiMessage = chatMessages.map((messageObject) => {
      let role = ""
      if (messageObject.sender === "هوش مصنوعی 🤖") {
        role = "assistant"
      } else {
        role = "user"
      }
      return { role: role, content: messageObject.message }
    })

    const systemMessage = {
      role: "system",
      content: "ای بابا 😣"
    }

    const apiReqBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessage

      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiReqBody)
    }).then((data) => {
      return data.json()
    }).then((data) => {
      console.log(data)
      console.log(data.choices[0].message.content)
      setMessages([
        ...chatMessages, {
          message: data.choices[0].message.content,
          sender: "هوش مصنوعی 🤖"
        }
      ])
      setTyping(false)
    })

  }
  return (
    <div className="App">
      <div style={{ position: "relative", height: "600px", width: "450px" }}>

        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior='smooth'
              typingIndicator={typing ? <TypingIndicator content="در حال تایپ" /> : null}>
              {messages.map((message, i) => {
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder='نوشتن پیام...' onSend={handlerSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App
