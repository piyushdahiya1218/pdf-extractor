import logo from "./logo.svg";
import "./App.css";
import Home from "./components/Home";

function App() {
  return (
    <div>
      {/* <div className="fixed top-0 z-50 bg-gray-200 w-full">
       <Header/>
      </div> */}
      <div className="mt-4">
        <Home />
      </div>
    </div>
  );
}

export default App;
