import "./App.css";
import { Toast } from "./components/toast/Toast";
import { AppLayout } from "./pages/AppLayout";

function App() {
  return (
    <>
      <AppLayout />
      {/* <DesktopLayout /> */}
      {/* <MobileLayout /> */}
      <Toast />
    </>
  );
}

export default App;
