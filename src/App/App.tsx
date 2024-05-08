import { Saper, Controls } from "../components";
import { SaperContextProvider } from "../App";

const App = () => (
  <SaperContextProvider>
    <Controls />
    <Saper />
  </SaperContextProvider>
);

export default App;
