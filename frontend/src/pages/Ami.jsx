import React, { use, useEffect, useState } from "react";
import img from "../assets/ami.png";
import img1 from "../assets/send.png";
import "../styles/ami.css";
import Button from "../containers/Button.jsx";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../pages/AuthContextUser.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import { useFriendRequests } from "./FriendRequestContext.jsx";

import { useMemo } from "react";

const Ami = ({ setadduser, setclickuser }) => {
  const [textsearch, settextsearch] = useState("");
  const [textsearching, settextsearching] = useState("");
  const [users, setusers] = useState([]); // amis
  const [usering, setusering] = useState([]); // demandes reçues
  const [newusers, setnewusers] = useState([]); // utilisateurs sauf moi
  const [selectUser, setselectUser] = useState(null); // user sélectionné
  const [showprofile, setshowprofile] = useState(null); // profil affiché de l'ami(e)
  const [sentRequests, setSentRequests] = useState([]); // demandes envoyées
  const [open, setOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [allUsers, setAllUsers] = useState([]); // tous les users
  const [friends, setfriends] = useState([]); //copie des amis pour le filtre
  const [showoptionuserAway, setshowoptionuserAway] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true); // état de chargement des utilisateurs
  const [friendshipDate, setFriendshipDate] = useState(null);
  const [lastExchanges, setLastExchanges] = useState({});
  const [openMedia, setOpenMedia] = useState(false);
  const [mediaList, setMediaList] = useState([]);
  const { setPendingCount } = useFriendRequests();
  const { user } = useAuth();
  const navigate = useNavigate();

  //mettre à jour le compteur ami dans la siderbar
  useEffect(() => {
    setPendingCount(usering.length);
  }, [usering]);

  // Préparer la liste des utilisateurs à afficher avec leur statut d'amitié(vous êtes amis, demande envoyée, demande reçue)
  const displayUsers = useMemo(() => {
    const friendIds = new Set(users.map((u) => u.id)); //on recupère les ids des amis
    const sentToIds = new Set(sentRequests.map((r) => r.receiverId)); //ids des demandes envoyées
    const receivedFromIds = new Set(usering.map((r) => r.id)); //ids des demandes reçues

    return allUsers.map((u) => ({
      ...u,
      //on vérifie si c'est un ami
      isFriend: friendIds.has(u.id),
      //on vérifie si on a envoyé une demande d'ami à cet utilisateur
      hasSentRequest: sentToIds.has(u.id),
      //on vérifie si on a reçu une demande d'ami de cet utilisateur
      hasReceivedRequest: receivedFromIds.has(u.id),
    }));
  }, [allUsers, users, sentRequests, usering]);

  const handleOpenMedia = async () => {
    //charger les médias échangés avec cet ami(e)
    try {
      const res = await axios.get(
        `http://localhost:5000/message/medias/${showprofile.id}`,
        { withCredentials: true }
      );
      setMediaList(res.data); //je stocke la liste des médias
      setOpenMedia(true);
    } catch {
      toast.error("Erreur chargement médias");
    }
  };

  useEffect(() => {
    if (!user?.iduser) return; //si l'user n'est pas connecté

    const s = io("http://localhost:5000", { withCredentials: true });
    s.emit("join_user_room", user.iduser); //rejoindre la room de l'user
    //reception d'une nouvelle demande d'ami
    s.on("friend_request_received", (data) => {
      setusering((prev) => {
        //si la demande est deja dans la liste ,on ne duplique pas
        if (prev.some((r) => r.requestId === data.requestId)) return prev;
        toast.info(`Nouvelle demande d'amitié de ${data.sender.name}`);
        return [
          {
            requestId: data.requestId,
            id: data.sender.id,
            name: data.sender.name,
            image: data.sender.image || img,
          },
          ...prev,
        ];
      });
    });
    s.on("friends_updated", async () => {
      try {
        const [friendsRes, receivedRes, sentRes, usersRes] = await Promise.all([
          axios.get("http://localhost:5000/friends", { withCredentials: true }),
          axios.get("http://localhost:5000/friends/requests/received", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/friends/requests/sent", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/user", { withCredentials: true }),
        ]);

        // amis
        const friends = friendsRes.data.map((f) => ({
          id: f.friend.iduser,
          name: f.friend.username,
          image: f.friend.userphoto || img,
        }));
        setusers(friends);
        setfriends(friends);
        setadduser(friends);
        // demande reçue
        setusering(
          receivedRes.data.map((r) => ({
            requestId: r.id,
            id: r.requester.iduser,
            name: r.requester.username,
            image: r.requester.userphoto || img,
          }))
        );
        // demande envoyée
        setSentRequests(
          sentRes.data.map((r) => ({
            requestId: r.id,
            receiverId: r.addressee.iduser,
            receiverName: r.addressee.username,
          }))
        );

        // tous les users
        const allUsers = usersRes.data
          .filter((u) => u.iduser !== user.iduser) //on exclut moi-même
          .map((u) => ({
            id: u.iduser,
            name: u.username,
            image: u.userphoto || img,
          }));

        setAllUsers(allUsers);
        setnewusers(allUsers);
      } catch (e) {
        console.error("friends_updated sync error", e);
      }
    });
    // annulation
    s.on("friend_request_cancelled", ({ requestId }) => {
      setusering((prev) => prev.filter((r) => r.requestId !== requestId));
    });
    //réponse à une demande d'ami (acceptée ou refusée)
    s.on("friend_request_responded", ({ requestId, status, user }) => {
      //supprimer la demande envoyée de la liste
      setSentRequests((prev) =>
        prev.filter((req) => req.requestId !== requestId)
      );
      //si accepté, ajouter dans la liste des amis
      if (status === "accepter" && user) {
        const newFriend = {
          id: user.id,
          name: user.name,
          image: user.image || img,
        };

        setusers((prev) =>
          prev.some((u) => u.id === newFriend.id) ? prev : [...prev, newFriend]
        );

        setadduser((prev) =>
          prev.some((u) => u.id === newFriend.id) ? prev : [...prev, newFriend]
        );
      }
    });
    //suppression
    s.on("friendship_removed", ({ friendId }) => {
      setusers((prev) => prev.filter((u) => u.id !== friendId));
      setadduser((prev) => prev.filter((u) => u.id !== friendId));
    });

    return () => {
      s.off();
      s.disconnect();
    };
  }, [user?.iduser]);

  //chargement des données initiales
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        setLoadingUsers(true);

        const [friendsRes, receivedRes, sentRes, usersRes] = await Promise.all([
          axios.get("http://localhost:5000/friends", { withCredentials: true }),
          axios.get("http://localhost:5000/friends/requests/received", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/friends/requests/sent", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/user", { withCredentials: true }),
        ]);

        //tous les users
        const allUsers = usersRes.data
          .filter((u) => u.iduser !== user.iduser)
          .map((u) => ({
            id: u.iduser,
            name: u.username,
            image: u.userphoto || img,
          }));

        setAllUsers(allUsers);
        setnewusers(allUsers);

        // amis
        const friends = friendsRes.data.map((f) => ({
          id: f.friend.iduser,
          name: f.friend.username,
          image: f.friend.userphoto || img,
        }));
        setusers(friends);
        setfriends(friends);
        setadduser(friends);

        //demandes
        setusering(
          receivedRes.data.map((r) => ({
            requestId: r.id,
            id: r.requester.iduser,
            name: r.requester.username,
            image: r.requester.userphoto || img,
          }))
        );

        setSentRequests(
          sentRes.data.map((r) => ({
            requestId: r.id,
            receiverId: r.addressee.iduser,
          }))
        );
      } catch (err) {
        console.error("erreur de chargement de données", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    loadData();
  }, [user]);

  // envoyer une demande d'ami
  const sendFriendRequest = (id) => {
    axios
      .post(
        "http://localhost:5000/friends/request",
        { addresseeId: id },
        { withCredentials: true }
      )
      .then((res) => {
        // Stocker l'objet complet avec requestId
        setSentRequests((prev) => [
          ...prev,
          {
            requestId: res.data.id,
            receiverId: id,
            ...res.data,
          },
        ]);
        toast.success("Demande envoyée !");
      })
      .catch((error) => {
        console.error(error);
        toast.error(error?.response?.data?.message);
      });
  };

  const handlecancel = (receiverId) => {
    // Trouver la demande correspondante
    const request = sentRequests.find((req) => req.receiverId === receiverId);
    if (!request) {
      toast.error("Demande non trouvée");
      return;
    }
    axios
      .delete(`http://localhost:5000/friends/request/${request.requestId}`, {
        withCredentials: true,
      })
      .then(() => {
        // Supprimer de tous les états
        setSentRequests((prev) =>
          prev.filter((req) => req.requestId !== request.requestId)
        );
        toast.info("Demande annulée");
      })
      .catch(console.error);
  };

  const respondRequest = (requestId, status, p) => {
    axios
      .put(
        `http://localhost:5000/friends/request/${requestId}`,
        { status },
        { withCredentials: true }
      )
      .then(() => {
        // Retirer la demande en attente
        setusering((prev) => prev.filter((r) => r.requestId !== requestId));

        // Si accepté, ajouter dans users
        if (status === "accepter") {
          setusers((prev) => [...prev, p]);
          setadduser((prev) => [...prev, p]);
        }
      })
      .catch(console.error);
  };

  const handleChangeFilter = (e) => {
    const v = e.target.value;
    settextsearch(v);
    setusers(
      v
        ? friends.filter((u) => u.name.toLowerCase().includes(v.toLowerCase()))
        : friends
    );
  };

  const handleChangeFiltering = (e) => {
    settextsearching(e.target.value);
  };
  const filteredDisplayUsers = useMemo(() => {
    const q = textsearching.trim().toLowerCase();
    if (!q) return displayUsers;
    return displayUsers.filter((u) => u.name.toLowerCase().includes(q));
  }, [displayUsers, textsearching]);

  const handlesendsms = (id) => {
    setclickuser(id);
    navigate("/message");
  };
  useEffect(() => {
    if (!showprofile?.id) return;

    const fetchFriendshipDate = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/friends/since/${showprofile.id}`,
          { withCredentials: true }
        );

        setFriendshipDate(res.data.formattedDate);
      } catch (error) {
        console.error("Erreur date amitié", error);
        setFriendshipDate(null);
      }
    };

    fetchFriendshipDate();
  }, [showprofile?.id]);
  useEffect(() => {
    if (!friends.length) return;

    const loadLastExchanges = async () => {
      const results = {};

      for (const friend of friends) {
        try {
          const res = await axios.get(
            `http://localhost:5000/message/last-exchange/${friend.id}`,
            { withCredentials: true }
          );

          results[friend.id] = res.data.formattedDate;
        } catch (err) {
          results[friend.id] = null;
        }
      }

      setLastExchanges(results);
    };

    loadLastExchanges();
  }, [friends]);
  const handledeleteuser = async (friendId) => {
    try {
      await axios.delete(`http://localhost:5000/friends/${friendId}`, {
        withCredentials: true,
      });

      setusers((prev) => prev.filter((u) => u.id !== friendId));
      setfriends((prev) => prev.filter((u) => u.id !== friendId));
      setadduser((prev) => prev.filter((u) => u.id !== friendId));
      setshowprofile(null);
      setOpen(false);

      toast.success("Ami supprimé");
    } catch {
      toast.error("Erreur suppression ami");
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="MessageMain">
      <div className="MessageUser">
        <p id="Titlesms">MES AMI(E)S</p>
        <div className="filterUser">
          <input
            type="search"
            value={textsearch}
            placeholder="taper le nom de votre ami(e)..."
            onChange={handleChangeFilter}
          />
        </div>
        <div className="UserMain">
          {users.length ? (
            users.map((p) => (
              <div
                key={p.id}
                className={`userSelect ${selectUser === p.id ? "active" : ""}`}
                onClick={() => {
                  setselectUser(p.id);
                  setshowprofile(p);
                }}
              >
                <img src={p.image} alt="" />
                <p>{p.name}</p>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>vous n'avez aucun ami(e)</p>
          )}
        </div>
      </div>

      <div className="MessageWritting">
        {showprofile ? (
          <div className="UserAwayDescription">
            <div className="MessageWrittingHeaders">
              <div className="UserAwayDescriptionHeader">
                <div className="ImageSmsHeader">
                  <img src={showprofile.image} alt="" />
                  <span></span>
                </div>
                <div className="UserAwayDescriptionHeaderName">
                  <p>{showprofile.name}</p>
                  <div className="SiderbarTops">
                    <div className="SiderbarTopOption">
                      <img
                        src={img1}
                        alt=""
                        onClick={() => handlesendsms(showprofile.id)}
                      />
                    </div>
                    <p id="texthovers">Envoyer un message</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => setshowoptionuserAway(!showoptionuserAway)}
                className="retourbtn"
              >
                {showoptionuserAway ? "replier" : "deplier"}
              </Button>
            </div>
            {showoptionuserAway && showprofile && (
              <div className="optionSentence">
                <p>
                  vous êtes ami(e)s avec {showprofile.name} depuis :
                  {friendshipDate
                    ? new Date(
                        `${friendshipDate.year}-${friendshipDate.month}-${friendshipDate.day}`
                      ).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "chargement..."}
                </p>
                <p>
                  dernier échange :{" "}
                  {lastExchanges?.[showprofile.id] ? (
                    <>
                      {new Date(
                        `${lastExchanges[showprofile.id].year}-${
                          lastExchanges[showprofile.id].month
                        }-${lastExchanges[showprofile.id].day}`
                      ).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      à{" "}
                      {String(lastExchanges[showprofile.id].hours).padStart(
                        2,
                        "0"
                      )}
                      :
                      {String(lastExchanges[showprofile.id].minutes).padStart(
                        2,
                        "0"
                      )}
                      :
                      {String(lastExchanges[showprofile.id].seconds).padStart(
                        2,
                        "0"
                      )}
                    </>
                  ) : (
                    "aucun échange"
                  )}
                </p>

                <p onClick={handleOpenMedia} style={{ cursor: "pointer" }}>
                  liste des médias échangés avec {showprofile.name}
                </p>

                <p onClick={() => setOpen(true)}>
                  supprimer {showprofile.name} de votre liste d'ami(e)s
                </p>
              </div>
            )}
          </div>
        ) : (
          <p id="searchAmity">allons à la recherche d'amitié 🌟</p>
        )}

        <div className="Amity">
          {usering.length > 0 && (
            <div className="AmityReceive">
              <p id="headerReceive">Demandes d'amitié en attente</p>
              {usering.map((p) => (
                <div key={p.id} className="userSelects">
                  <div className="AmityReceiveUser">
                    <img src={p.image || img} alt="" />
                    <p>{p.name}</p>
                  </div>
                  <p>vous avez reçu une demande d'amitié</p>
                  <div className="AmityReceiveButton">
                    <Button
                      className="acceptbtn"
                      onClick={() => respondRequest(p.requestId, "accepter", p)}
                    >
                      valider
                    </Button>
                    <Button
                      className="rejectbtn"
                      onClick={() => respondRequest(p.requestId, "refuser", p)}
                    >
                      refuser
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="Amitysend">
            <p id="headerReceive">allons y rechercher des ami(e)s</p>
            <div className="filterUser">
              <input
                type="search"
                value={textsearching}
                name=""
                id=""
                placeholder="taper le nom d'une personne ..."
                onChange={handleChangeFiltering}
                style={{ height: "100px", width: "50%" }}
              />
            </div>
            {/* ===== LISTE DES UTILISATEURS ===== */}
            <div className="UserMain">
              {loadingUsers ? (
                <p style={{ textAlign: "center" }}>
                  Chargement des utilisateurs...
                </p>
              ) : filteredDisplayUsers.length === 0 ? (
                <p style={{ textAlign: "center" }}>Aucun utilisateur trouvé</p>
              ) : null}

              {filteredDisplayUsers.map((p) => (
                <div className="userSelects" key={p.id}>
                  <div className="AmityReceiveUser">
                    <img src={p.image} alt="" />
                    <p>{p.name}</p>
                  </div>

                  <div className="">
                    {/*CAS : DÉJÀ AMIS*/}
                    {p.isFriend && (
                      <>
                        <div className="AmityReceiveButton">
                          <Button className="retourbtn">
                            vous êtes ami(e)s
                          </Button>
                        </div>
                      </>
                    )}

                    {/*CAS : DEMANDE ENVOYÉE*/}
                    {p.hasSentRequest && !p.isFriend && (
                      <>
                        <p
                          style={{ textAlign: "center", paddingBottom: "10px" }}
                        >
                          demande envoyée
                        </p>
                        <div className="AmityReceiveButton">
                          <Button className="retourbtn" disabled>
                            en attente de validation ...
                          </Button>
                          <Button
                            className="rejectbtn"
                            onClick={() => handlecancel(p.id)}
                          >
                            annuler demande d'amitié
                          </Button>
                        </div>
                      </>
                    )}

                    {/*CAS : DEMANDE REÇUE*/}
                    {p.hasReceivedRequest && !p.isFriend && (
                      <p className="receiveStatus">
                        vous avez reçu une demande
                      </p>
                    )}

                    {/* CAS : ÉTAT INITIAL*/}
                    {!p.isFriend &&
                      !p.hasSentRequest &&
                      !p.hasReceivedRequest && (
                        <div className="AmityReceiveButton">
                          <Button
                            className="acceptbtn"
                            onClick={() => sendFriendRequest(p.id)}
                          >
                            envoyer demande d'amitié
                          </Button>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {open && showprofile && (
        <Dialog open={open} onClose={handleClose} className="customdialog">
          <DialogContent>
            <DialogContentText className="dialogtext">
              <p>voulez vous vraiment supprimer votre ami(e)s</p>
            </DialogContentText>
          </DialogContent>
          <DialogContent>
            <DialogContentText className="dialogtext">
              <img src={showprofile.image} alt="" />
              <p>{showprofile.name}</p>
            </DialogContentText>
          </DialogContent>
          <DialogActions className="optionbtn">
            <Button onClick={handleClose} className="retourbtn">
              Retour
            </Button>
            <Button
              autoFocus
              className="rejectbtn"
              onClick={() => handledeleteuser(showprofile.id)}
            >
              confirmer
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Dialog open={openMedia} onClose={() => setOpenMedia(false)}>
        <DialogContent>
          {mediaList.length === 0 ? (
            <p>Aucun média échangé</p>
          ) : (
            mediaList.map((m) => (
              <div key={m.id} style={{ marginBottom: "15px" }}>
                {/* IMAGE */}
                {m.fileType.startsWith("image/") && (
                  <img
                    src={`http://localhost:5000${m.fileUrl}`}
                    style={{ width: "100%", borderRadius: "10px" }}
                  />
                )}

                {/* VIDEO */}
                {m.fileType.startsWith("video/") && (
                  <video
                    controls
                    style={{ width: "100%", borderRadius: "10px" }}
                  >
                    <source
                      src={`http://localhost:5000${m.fileUrl}`}
                      type={m.fileType}
                    />
                    Votre navigateur ne supporte pas la vidéo.
                  </video>
                )}

                {/* AUDIO */}
                {m.fileType.startsWith("audio/") && (
                  <audio controls style={{ width: "100%" }}>
                    <source
                      src={`http://localhost:5000${m.fileUrl}`}
                      type={m.fileType}
                    />
                    Votre navigateur ne supporte pas l’audio.
                  </audio>
                )}

                {/* PDF */}
                {m.fileType === "application/pdf" && (
                  <iframe
                    src={`http://localhost:5000${m.fileUrl}`}
                    frameborder="0"
                    width="100%"
                    height="300px"
                  >
                    {m.fileName}
                  </iframe>
                )}

                {/* AUTRES FICHIERS */}
                {!m.fileType.startsWith("image/") &&
                  !m.fileType.startsWith("video/") &&
                  !m.fileType.startsWith("audio/") &&
                  m.fileType !== "application/pdf" && (
                    <iframe
                      src={`http://localhost:5000${m.fileUrl}`}
                      frameborder="0"
                    >
                      {m.fileName}
                    </iframe>
                  )}
              </div>
            ))
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Ami;
