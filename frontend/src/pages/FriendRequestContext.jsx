import { createContext, useContext, useState, useEffect } from "react";
import { getSocket } from "./AuthContextUser.jsx";
import { useAuth } from "./AuthContextUser.jsx";

const FriendRequestContext = createContext();

export const useFriendRequests = () => useContext(FriendRequestContext);

export const FriendRequestProvider = ({ children }) => {
  const [pendingCount, setPendingCount] = useState(0);
  const [numbersms, setnumbersms] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.iduser) return;

    const interval = setInterval(() => {
      const socket = getSocket();
      if (!socket) return;

      // Se marquer soi-même online
      setOnlineUsers((prev) => ({
        ...prev,
        [user.iduser]: true,
      }));

      // Écoute des connexions
      socket.on("user_online", (userId) => {
        setOnlineUsers((prev) => ({ ...prev, [userId]: true }));
      });

      // Écoute des déconnexions
      socket.on("user_offline", (userId) => {
        setOnlineUsers((prev) => ({ ...prev, [userId]: false }));
      });

      // Demander l’état initial (important)
      socket.emit("get_online_users");

      socket.on("online_users", (users) => {
        const map = {};
        users.forEach((id) => (map[id] = true));
        setOnlineUsers(map);
      });

      clearInterval(interval);
    }, 200);

    return () => clearInterval(interval);
  }, [user?.iduser]);

  return (
    <FriendRequestContext.Provider
      value={{
        pendingCount,
        setPendingCount,
        numbersms,
        setnumbersms,
        onlineUsers,
      }}
    >
      {children}
    </FriendRequestContext.Provider>
  );
};
