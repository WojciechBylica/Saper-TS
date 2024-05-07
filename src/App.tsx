import "./App.css";
import { Saper } from "./components";
import { SaperContextProvider } from "./saperContext";
import { Controls } from "./components";

function App() {
  return (
    <SaperContextProvider>
      <Controls />
      <Saper />
    </SaperContextProvider>
  );
}

export default App;
