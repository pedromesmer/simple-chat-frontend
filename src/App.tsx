/* eslint-disable react/button-has-type */
// eslint-disable-next-line import/no-extraneous-dependencies
import { DefaultEventsMap } from '@socket.io/component-emitter';
import React, { useCallback, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface IMessage {
  user: string;
  message: string;
}

const App: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([] as IMessage[]);
  const [socket, setSocket] =
    useState<Socket<DefaultEventsMap, DefaultEventsMap>>();

  useEffect(() => {
    if (!socket) {
      setSocket(
        io('http://localhost:3333', {
          query: {
            room: 'sala',
          },
        }),
      );
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('message', (res: IMessage) => {
        setMessages([...messages, res]);
      });
    }
  }, [messages, socket]);

  const handleChange = useCallback(event => {
    setMessage(event.target.value);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!socket) return;
    socket.emit('message', message);
    setMessage('');
  }, [message, socket]);

  const onKeyDown = useCallback(
    event => {
      if (event.key === 'Enter') {
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  return (
    <>
      <h1>{socket && socket.id}</h1>
      <br />
      <input
        type="text"
        id="message"
        name="message"
        placeholder="Digite uma mensagem..."
        onChange={handleChange}
        onSubmit={handleSendMessage}
        onKeyDown={onKeyDown}
        value={message}
      />{' '}
      <button onClick={handleSendMessage}>Enviar</button>
      <br />
      <div style={{ margin: 10 }}>
        {messages.map((m, i) => (
          <div key={i.valueOf()} style={{ display: 'block' }}>
            <p style={{ display: 'inline' }}>{m.user}: </p>
            <p style={{ display: 'inline' }}>{m.message}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default App;
