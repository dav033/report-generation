import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FirstVisit from "./FirstVisit.jsx";
import RestorationVisit from "./RestorationVisit.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstVisit />} />
        <Route path="/restoration-visit" element={<RestorationVisit />} />
      </Routes>
    </Router>
  );
}

export default App;
