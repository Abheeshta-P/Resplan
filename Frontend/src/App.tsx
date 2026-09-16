import { RouterProvider } from "react-router"
import { router } from "./app.routes.tsx"

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
