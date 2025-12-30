import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Siderbar from "./containers/Siderbar";
import Message from "./pages/Message";
import Statuts from "./pages/Statuts";
import Para from "./pages/Para";
import Ami from "./pages/Ami";

import { useState } from "react";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import Forgetpassword from "./pages/Forgetpassword";

function App() {
  const [choicebk, setchoicebk] = useState(null);
  const [adduser, setadduser] = useState([]);
  //click et envoyer sms
  const [clickuser, setclickuser] = useState(null);
  return (
    <>
      <BrowserRouter>
        <div className="generalMain">
          <div className="siderbarMain">
            <Siderbar />
          </div>
          <div className="principalMain">
            <Routes>
              <Route path="/" element={<Connexion />} />
              <Route
                path="/message"
                element={
                  <Message
                    choicebk={choicebk}
                    adduser={adduser}
                    clickuser={clickuser}
                  />
                }
              />
              <Route path="/statuts" element={<Statuts />} />
              <Route
                path="/para"
                element={<Para setchoicebk={setchoicebk} />}
              />
              <Route
                path="/ami"
                element={
                  <Ami setadduser={setadduser} setclickuser={setclickuser} />
                }
              />
              <Route path="inscription" element={<Inscription />} />
              <Route path="forgetpassword" element={<Forgetpassword />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
