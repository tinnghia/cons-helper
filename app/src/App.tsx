import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./AppStyles.css";
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
