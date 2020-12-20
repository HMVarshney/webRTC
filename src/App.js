import React, { useEffect, useState } from 'react';
import Video from './components/Video';
import io from 'socket.io-client';
import * as CONSTANTS from './constants';


function App() {

  const [socket, setSocket] = useState(undefined);

  useEffect(() => {
    setSocket(io(CONSTANTS.BACKEND_URL));
  }, []);

  return (
    <div>
      <p>Hey</p>
      {socket &&
        <Video socket={socket} />
      }
    </div>
  );
};

export default App;