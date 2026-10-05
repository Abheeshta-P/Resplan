import { RouterProvider } from "react-router"
import { router } from "./app.routes.tsx"
import { AuthProvider } from "./features/auth/auth.context.tsx"

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
