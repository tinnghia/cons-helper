import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Admin } from "./Admin";
import "./AppStyles.css";
import { ContextProvider } from "./Context";
import Home from "./Home";

export default function App() {
  return (
    <BrowserRouter>

      <>
        <div className="header">
          <div className="header-left">
            <span className="headerText">STEEL BAR UTILITY</span>
          </div>
          <div className="header-right">
            <span className="greeting">Hi Nghia</span>
            <a  href="/signin">Log out</a>
          </div>
        </div>
        <Routes>
          <Route path="/" Component={Home}></Route>
        </Routes>
      </>
    </BrowserRouter>
  );
}
