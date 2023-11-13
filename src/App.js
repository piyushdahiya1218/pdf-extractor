import logo from "./logo.svg";
import "./App.css";
import Home from "./components/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        {/* <Route path="/newpdf" element={<NewPDF/>} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
