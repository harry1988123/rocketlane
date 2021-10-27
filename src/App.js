import React, { useEffect, useState } from "react";
import "./App.css";
import ApiEndPoint from "./ApiEndPoint";
import axios from "axios";
import { Card } from "antd";
import "antd/dist/antd.css";
import { FacebookSelector, FacebookSelectorEmoji } from "react-reactions";
import {} from "react-facebook-emoji";
import add from "./app/add.png";

function App() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [userContentReactions, setUserContentReactions] = useState([]);
  const [localSelectedEmoji, setLocalSelectedEmoji] = useState([]);
  const [oneTime, setOneTime] = useState(0);
  const [current, setCurrent] = useState();
  const { Meta } = Card;

  const fetchOrder = (ApiEndPoint) => {
    axios.get(ApiEndPoint).then((data) => {
      setOrders(data.data);
      console.log(orders);
    });
  };

  const fetchUser = (ApiEndPoint) => {
    axios.get(ApiEndPoint).then((data) => {
      setUsers(data.data);
    });
  };

  const fetchReaction = (ApiEndPoint) => {
    axios.get(ApiEndPoint).then((data) => {
      setReactions(data.data);
    });
  };

  const fetchUserContentReaction = (ApiEndPoint) => {
    axios.get(ApiEndPoint).then((data) => {
      setUserContentReactions(data.data);
    });
  };

  const createData = () => {
    setOneTime(1);
    let temp = [];
    for (let i = 1; i <= users.length; i++) temp.push({ id: i, emoji: "", icons: "", emotions: "" });
    setLocalSelectedEmoji(temp);
  }; 
  useEffect(() => {
    fetchOrder(ApiEndPoint + "orders");
    fetchUser(ApiEndPoint + "users");
    fetchReaction(ApiEndPoint + "reactions");
    fetchUserContentReaction(ApiEndPoint + "user_content_reactions");
  }, []);

  const getEmojiId = (x) => {
    if (x === "like") return 1;
    else if (x === "love") return 2;
    else if (x === "haha") return 3;
    else if (x === "wow") return 4;
    else if (x === "sad") return 5;
    else if (x === "angry") return 6;
  };

  const images = [
    { id: "like", img: "http://i.imgur.com/LwCYmcM.gif" },
    { id: "love", img: "http://i.imgur.com/k5jMsaH.gif" },
    { id: "haha", img: "http://i.imgur.com/f93vCxM.gif" },
    { id: "yay", img: "http://i.imgur.com/a44ke8c.gif" },
    { id: "wow", img: "http://i.imgur.com/9xTkN93.gif" },
    { id: "sad", img: "http://i.imgur.com/tFOrN5d.gif" },
    { id: "angry", img: "http://i.imgur.com/1MgcQg0.gif" },
  ];

  const setLocalEmoji = (id, reaction_id, emotions) => {
    const icons = images.filter((d) => d["id"] === emotions);
    const temp = reactions.filter((d) => d["id"] === reaction_id);
    if (icons.length > 0) {
      if (localSelectedEmoji.length == 0) {
        setLocalSelectedEmoji([
          {
            id: id,
            emoji: temp.length > 0 ? temp[0]["emoji"] : "",
            icon: icons[0]["img"],
            emotions,
          },
        ]);
      } else if (localSelectedEmoji[0].emotions === emotions) {
        setLocalSelectedEmoji([
          {
            id: id,
            emoji: temp.length > 0 ? temp[0]["emoji"] : "",
            icon: "",
            emotions: "",
          },
        ]);
      } else {
        setLocalSelectedEmoji([
          {
            id: id,
            emoji: temp.length > 0 ? temp[0]["emoji"] : "",
            icon: icons[0]["img"],
            emotions,
          },
        ]);
      }
    }
  };

  const onSelect = (id, e) => {
    setLocalEmoji(id, getEmojiId(e), e);
    if (oneTime) createData();
    axios
      .post(ApiEndPoint + "user_content_reactions", {
        user_id: id,
        reaction_id: getEmojiId(e),
        content_id: 1,
      })
      .then(
        (res) => {
          console.log(res.data);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  const enableEmojiSelector = (id, e) => {
    id == current ? setCurrent(0) : setCurrent(id);
  };

  return (
    <div className="App">
      {users ? (
        users.map(function (d) {
          return (
            <>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={<img alt="RocketLane FE task" src={d["avatar"]} />}
              >
                <Meta
                  title={d["first_name"] + " " + d["last_name"]}
                  description={d["email"]}
                  email={d["email"]}
                  id={d["id"]}
                />
                {current === d["id"] ? (
                  <FacebookSelector
                    onSelect={(e) => onSelect(d["id"], e, e.img)}
                    id={d["id"]}
                  />
                ) : (
                  <div></div>
                )}

                <div style={{ marginTop: "16px" }}>
                  <img
                    src={add}
                    style={{ width: "25px", paddingRight: "5px" }}
                    onClick={(e) => enableEmojiSelector(d["id"], e)}
                  />
                  <br />
                  <span>From Api</span>
                </div>

                {userContentReactions ? (
                  userContentReactions
                    .filter((emoji) => emoji["user_id"] === d["id"])
                    .map((dbSelectedEmoji) =>
                      reactions ? (
                        reactions
                          .filter(
                            (rec) =>
                              rec["id"] === dbSelectedEmoji["reaction_id"]
                          )
                          .map((emj) => <h3 id={emj["id"]}>{emj["emoji"]}</h3>)
                      ) : (
                        <div id={d["id"]}>Loading emoji</div>
                      )
                    )
                ) : (
                  <div>Loading emoji</div>
                )}
                <hr />
                <span>Selected local</span>
                <hr />
                {localSelectedEmoji.length > 0 ? (
                  localSelectedEmoji
                    .filter((x) => x["id"] === d["id"])
                    .map((emoji) => (
                      <>
                        <span id={d["id"]}>{emoji["emotions"]} &nbsp;</span>
                        <img style={{ width: "35px" }} src={emoji["icon"]} id={d["id"]} />
                      </>
                    ))
                ) : (
                  <div id={d["id"]}>Not selected</div>
                )}
              </Card>
            </>
          );
        })
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default App;
