import { Saper, Controls } from '../components'
import { SaperContextProvider } from './context'

const App = () => (
  <SaperContextProvider>
    <Controls />
    <Saper />
  </SaperContextProvider>
)

export default App
