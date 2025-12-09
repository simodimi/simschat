import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Siderbar from "./containers/Siderbar";
import Message from "./pages/Message";
import Statuts from "./pages/Statuts";
import Para from "./pages/Para";
import Ami from "./pages/Ami";
import Groupe from "./pages/Groupe";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="generalMain">
          <div className="siderbarMain">
            <Siderbar />
          </div>
          <div className="principalMain">
            <Routes>
              <Route path="/message" element={<Message />} />
              <Route path="/statuts" element={<Statuts />} />
              <Route path="/para" element={<Para />} />
              <Route path="/ami" element={<Ami />} />
              <Route path="/groupe" element={<Groupe />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
