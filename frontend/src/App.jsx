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
import Notification from "./containers/Notification";
import ProtectedRouteUser from "../../../simsburger/frontend/src/pages/ProtectedRouteUser";
import { AuthProviderUser } from "./pages/AuthContextUser";

function App() {
  const [choicebk, setchoicebk] = useState(null);
  const [adduser, setadduser] = useState([]);
  //click et envoyer sms
  const [clickuser, setclickuser] = useState(null);
  return (
    <>
      <BrowserRouter>
        <AuthProviderUser>
          <Routes>
            {/* routes publique */}
            <Route path="/" element={<Connexion />} />
            <Route path="inscription" element={<Inscription />} />
            <Route path="forgetpassword" element={<Forgetpassword />} />
            {/* routes privee */}
            <Route
              path="/*"
              element={
                <ProtectedRouteUser>
                  <div className="generalMain">
                    <div className="siderbarMain">
                      <Siderbar />
                    </div>
                    <div className="principalMain">
                      <Routes>
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
                            <Ami
                              setadduser={setadduser}
                              setclickuser={setclickuser}
                            />
                          }
                        />
                      </Routes>
                    </div>
                  </div>
                </ProtectedRouteUser>
              }
            />
          </Routes>
          <Notification />
        </AuthProviderUser>
      </BrowserRouter>
    </>
  );
}

export default App;
