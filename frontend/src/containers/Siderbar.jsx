import React, { useEffect, useState } from "react";
import sms from "../assets/sms.png";
import statut from "../assets/statut.png";
import ami from "../assets/ami.png";
import para from "../assets/para.png";
import logo from "../assets/logochat.png";
import groupe from "../assets/groupe.png";
import "../styles/topbar.css";
import { useFriendRequests } from "../pages/FriendRequestContext";
import { useStatus } from "../pages/StatusContext";
import { Link, useLocation } from "react-router-dom";
const Siderbar = () => {
  const [name, setname] = useState("name1");
  const location = useLocation();
  const { pendingCount, numbersms } = useFriendRequests();
  const { hasUnseenStatus } = useStatus();

  useEffect(() => {
    if (location.pathname === "/message") setname("name1");
    if (location.pathname === "/statuts") setname("name2");
    if (location.pathname === "/ami") setname("name3");
    if (location.pathname === "/groupe") setname("name4");
    if (location.pathname === "/para") setname("name5");
  }, [location.pathname]);

  return (
    <div className="SiderbarMain">
      <div className="SiderbarUp">
        <div
          onClick={() => setname("name1")}
          className={`SiderbarTop ${name === "name1" ? "active" : ""}`}
        >
          <Link to="/message">
            <div className="SiderbarTopOption">
              <img src={sms} alt="" />
              <p>Messages</p>

              <div className="SiderbarTopOptionNumber">
                <span className={numbersms > 0 ? "dot-green" : "dot-white"}>
                  {numbersms}
                </span>
              </div>
            </div>
            <p id="texthover">Messages</p>
          </Link>
        </div>

        <div
          onClick={() => setname("name2")}
          className={`SiderbarTop ${name === "name2" ? "active" : ""}`}
        >
          <Link to="/statuts">
            <div className="SiderbarTopOption">
              <img src={statut} alt="" />
              <p>Statuts</p>
              <div className="SiderbarTopOptionNumbers">
                <span
                  className={hasUnseenStatus ? "dot-green" : "dot-white"}
                ></span>
              </div>
            </div>
            <p id="texthover">Statuts</p>
          </Link>
        </div>

        <div
          onClick={() => setname("name3")}
          className={`SiderbarTop ${name === "name3" ? "active" : ""}`}
        >
          <Link to="/ami">
            <div className="SiderbarTopOption">
              <img src={ami} alt="" />
              <p>Ami(e)s</p>
              <div className="SiderbarTopOptionNumbers">
                <span
                  className={pendingCount > 0 ? "dot-green" : "dot-white"}
                ></span>
              </div>
            </div>
            <p id="texthover">Ami(e)s</p>
          </Link>
        </div>
      </div>
      <div className="SiderbarDown">
        <div
          onClick={() => setname("name5")}
          className={`SiderbarTop ${name === "name5" ? "active" : ""}`}
        >
          <Link to="/para">
            <div className="SiderbarTopOption">
              <img src={para} alt="" />
              <p>Paramètres</p>
            </div>
            <p id="texthover">Paramètres</p>
          </Link>
        </div>

        <div className="logo">
          <img src={logo} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Siderbar;
