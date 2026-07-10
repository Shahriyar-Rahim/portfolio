import { RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";
import { router } from "./routes/router";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#161d19",
            color: "#edefec",
            border: "1px solid #232b27",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "13px",
          },
        }}
      />
    </>
  );
}

export default App;