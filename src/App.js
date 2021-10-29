import React, { useEffect, useState } from "react";
import "./App.css";
import ApiEndPoint from "./ApiEndPoint";
import axios from "axios";
import { Card } from "antd";
import "antd/dist/antd.css";
import { FacebookSelector } from "react-reactions";
import add from "./app/add.png";

function App() { 
  const [users, setUsers] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [userContentReactions, setUserContentReactions] = useState([]);
  const createData = () => {
    let temp = [];
    for (let i = 1; i <= 30; i++)
      temp.push({ i, emoji: "", icon: "", emotions: "" });
    return temp;
  }; 
  const [count, setCount] = useState();
  const [current, setCurrent] = useState();
  const { Meta } = Card;

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

  const settingEmojiCount = (data) => {
    let arr = [];
    for (let i = 1; i <= 30; i++) {
      const temp = data.filter((e) => e["user_id"] === i);
      let rec = { id: i, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      for (let j = 0; j < temp.length; j++) rec["" + temp[j]["reaction_id"]]++;
      arr.push(rec);
    }
    setCount(arr);
  };

  const fetchUserContentReaction = (ApiEndPoint) => {
    axios.get(ApiEndPoint).then((data) => {
      setUserContentReactions(data.data);
      settingEmojiCount(data.data);
    });
  };

  useEffect(() => { 
    fetchUser(ApiEndPoint + "users");
    fetchReaction(ApiEndPoint + "reactions");
    fetchUserContentReaction(ApiEndPoint + "user_content_reactions");
  }, []);

  const getEmojiId = (x) => {
    if (x === "like") return 1;
    else if (x === "love") return 0;
    else if (x === "haha") return 2;
    else if (x === "wow") return 3;
    else if (x === "sad") return 4;
    else if (x === "angry") return 5;
  }; 

  const setLocalEmoji = (id, reaction_id, emotions) => { 
    const newReaction = [...count];
    newReaction.filter((d) => d["id"] === id)[0][reaction_id] == 1
      ? (newReaction.filter((d) => d["id"] === id)[0][reaction_id] = 0)
      : (newReaction.filter((d) => d["id"] === id)[0][reaction_id] = 1);
    setCount(newReaction); 
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

  const onSelectUpdate = (id, e) => {
    axios
      .post(ApiEndPoint + "user_content_reactions", {
        user_id: id,
        reaction_id: getEmojiId(e),
        content_id: 1,
      })
      .then(
        (res) => {
          console.log(res.data);
          setLocalEmoji(id, getEmojiId(e), e);
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
                <div className="emoji_section"
                >
                  {reactions ? (
                    reactions.map((emj) => (
                      <div id={emj["id"]}>
                        {count.length > 0
                          ? count
                              .filter((x) => x["id"] === d["id"])
                              .map((em) =>
                                em[emj["id"]] != 0 ? (
                                  <div className="emoji" key={emj["id"]}>
                                    {emj["emoji"]} . {em[emj["id"]]}{" "}
                                  </div>
                                ) : (
                                  <div></div>
                                )
                              )
                          : ""}
                      </div>
                    ))
                  ) : (
                    <div id={d["id"]}>Loading emoji</div>
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
                        className="fb"
                        onSelect={(e) => onSelectUpdate(d["id"], e, e.img)}
                        id={d["id"]}
                      />
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <span>
                    <img
                      src={add} className="emoji_selector"
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
