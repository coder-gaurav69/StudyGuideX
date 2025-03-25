import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Admin from "./Admin";
import ShowData from "./ShowData";
import Loader from "./loader";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Admin/>} />
          <Route path="/showData" element={<ShowData/>} />
        </Routes>
      </Router>
      {/* <Loader/> */}
    </div>
  );
}

export default App;
