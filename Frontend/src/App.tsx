import { RouterProvider } from "react-router"
import { router } from "./app.routes.tsx"
import { AuthProvider } from "./features/auth/auth.context.tsx"
import { InterviewProvider } from "./features/interview/interview.context.tsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <Toaster position="top-right"
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App
