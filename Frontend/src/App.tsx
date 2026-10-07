import { RouterProvider } from "react-router"
import { router } from "./app.routes.tsx"
import { AuthProvider } from "./features/auth/auth.context.tsx"
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right"
        toastOptions={{
            style: {
                background: "#333",
                color: "#fff",
            },
        }}
      />
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
