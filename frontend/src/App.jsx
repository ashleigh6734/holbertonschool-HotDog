import { useState } from "react";
import reactLogo from "./assets/paw.jpg";
import viteLogo from "./assets/paw.jpg";
import "./App.css";
// import Register from "./pages/Register";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;


// Avatar test code
// import Avatar from "../src/components/avatar/Avatar"

// export default function App() {
//   const mockUser = {
//     name: "Veronica",
//     avatarUrl: null
//   };

//   return (
//     <div style={{ padding: 50 }}>
//       <h1>Avatar Test</h1>

//       <Avatar user={mockUser} />
//     </div>
//   );
// }