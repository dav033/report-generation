import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FirstVisit from "./FirstVisit.jsx";
import RestorationVisit from "./RestorationVisit.jsx";
import FinalRestorationReport from "./RestorationFinal.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstVisit />} />
        <Route path="/restoration-visit" element={<RestorationVisit />} />
        <Route path="/restoration-final" element={<FinalRestorationReport />} />
      </Routes>
    </Router>
  );
}

export default App;
