import "./App.css"
import { FcGoogle } from "react-icons/fc"
import getGoogleUrl from "./utils/getGoogleUrl"

function App() {
  return (
    <div className="App">
      <a href={getGoogleUrl()}>
        <FcGoogle /> Continuer avec Google
      </a>
    </div>
  )
}

export default App
