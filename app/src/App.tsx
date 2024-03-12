import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Admin } from "./Admin";
import "./AppStyles.css";
import { ContextProvider } from "./Context";
import Home from "./components/Home";

export default function App() {
  return (
    <BrowserRouter>
      <>
        <Routes>
          <Route path="/" Component={Home}></Route>
        </Routes>
      </>
    </BrowserRouter>
  );
}
