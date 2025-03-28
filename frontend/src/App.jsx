import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Admin from "./Admin";
import ShowData from "./ShowData";
import Practise from "./Practise";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Admin/>} />
          <Route path="/showData" element={<ShowData/>} />
        </Routes>
      </Router>
      {/* <Practise/> */}
    </div>
  );
}

export default App;
