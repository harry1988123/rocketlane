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
  const createData = () => {
    let temp = [];
    for (let i = 1; i <= 30; i++)
      temp.push({ i, emoji: "", icon: "", emotions: "" });
    return temp;
  };
  const [localSelectedEmoji, setLocalSelectedEmoji] = useState(createData());
  const [count, setCount] = useState();
  const [current, setCurrent] = useState();
  const { Meta } = Card;

  const fetchOrder = (ApiEndPoint) => {
    axios.get(ApiEndPoint).then((data) => {
      setOrders(data.data);
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

  const settingEmojiCount = data => {
    for (let i = 1; i <= 30; i++){
      const temp = data.filter((e) => e["user_id"] === i);
      console.log(temp);
      for(let j=0;j<temp.length;j++){
        
      }
    }
  }

  const fetchUserContentReaction = (ApiEndPoint) => {
    axios.get(ApiEndPoint).then((data) => {
      setUserContentReactions(data.data);
      settingEmojiCount(data.data);
    });
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
    const newArr = [...localSelectedEmoji];
    if (icons.length > 0) {
      if (localSelectedEmoji.length == 0) {
        newArr[id].emoji = temp.length > 0 ? temp[0]["emoji"] : "";
        newArr[id].icon = icons[0]["img"];
        newArr[id].emotions = emotions;
      } else if (newArr[id].emotions === emotions) {
        newArr[id].emoji = temp.length > 0 ? temp[0]["emoji"] : "";
        newArr[id].icon = "";
        newArr[id].emotions = "";
      } else {
        newArr[id].emoji = temp.length > 0 ? temp[0]["emoji"] : "";
        newArr[id].icon = icons[0]["img"];
        newArr[id].emotions = emotions;
      }
    }
    setLocalSelectedEmoji(newArr);
  };

  const onSelect = (id, e) => {
    setLocalEmoji(id, getEmojiId(e), e);
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
                <div
                  style={{
                    display: "flex",
                    padding: "2rem",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
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
                            .map((emj) => (
                              <span id={emj["id"]}>{emj["emoji"]}</span>
                            ))
                        ) : (
                          <div id={d["id"]}>Loading emoji</div>
                        )
                      )
                  ) : (
                    <div>Loading emoji</div>
                  )}
                  {localSelectedEmoji.length > 0 &&
                  localSelectedEmoji[d["id"]]["icon"] != "" ? (
                    <>
                      <img
                        style={{ width: "35px" }}
                        src={localSelectedEmoji[d["id"]]["icon"]}
                        id={d["id"]}
                      />
                    </>
                  ) : (
                    <div id={d["id"]}></div>
                  )}
                  {current === d["id"] ? (
                    <div
                      style={{
                        zindex: "1",
                        position: "absolute",
                        top: "-2rem",
                      }}
                    >
                      <FacebookSelector
                        style={{
                          zindex: "1",
                          position: "absolute",
                          top: "15rem",
                        }}
                        onSelect={(e) => onSelect(d["id"], e, e.img)}
                        id={d["id"]}
                      />
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <span>
                    <img
                      src={add}
                      style={{ width: "25px", paddingRight: "5px" }}
                      onClick={(e) => enableEmojiSelector(d["id"], e)}
                    />
                  </span>
                </div>
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
