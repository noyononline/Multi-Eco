import React, { useEffect, useRef, useState } from "react";
import { AiOutlineMessage, AiOutlinePlus } from "react-icons/ai";
import { GrEmoji } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import {
  add_customer_friend,
  messageClear,
  send_message_to_seller,
  updateMessage,
} from "../../store/reducers/chatReducer";
import toast from "react-hot-toast";

const socket = io("http://localhost:5000");

const Chat = () => {
  const dispatch = useDispatch();
  const { sellerId } = useParams();
  const messagesEndRef = useRef();
  const [text, setText] = useState("");
  const [activeSeller, setActiveSeller] = useState([]);
  const [receverMessage, setReceverMessage] = useState("");
  const { userInfo } = useSelector((state) => state.auth);
  const { fd_message, currentFd, my_friends, successMessage } = useSelector(
    (state) => state.chat
  );
  useEffect(() => {
    socket.emit("add_user", userInfo.id, userInfo);
  }, [userInfo, dispatch]);

  useEffect(() => {
    dispatch(
      add_customer_friend({
        sellerId: sellerId || "",
        userId: userInfo.id,
      })
    );
  }, [sellerId, dispatch, userInfo]);

  const send = () => {
    if (text) {
      dispatch(
        send_message_to_seller({
          userId: userInfo.id,
          text,
          sellerId,
          name: userInfo.name,
        })
      );
      setText("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [fd_message]);

  useEffect(() => {
    socket.on("seller_message", (msg) => {
      setReceverMessage(msg);
    });
    socket.on("activeSeller", (sellers) => {
      setActiveSeller(sellers);
    });
  }, []);

  useEffect(() => {
    if (successMessage) {
      socket.emit("send_customer_message", fd_message[fd_message.length - 1]);
      dispatch(messageClear());
    }
  }, [successMessage, dispatch, fd_message]);

  useEffect(() => {
    if (receverMessage) {
      if (
        sellerId === receverMessage.senderId &&
        userInfo.id === receverMessage.receverId
      ) {
        dispatch(updateMessage(receverMessage));
      } else {
        toast.success(receverMessage.senderName + " send a message");
        dispatch(messageClear());
      }
    }
  }, [receverMessage, dispatch, sellerId, userInfo]);

  return (
    <div className="bg-white p-3 rounded-md">
      <div className="w-full flex">
        <div className="w-[230px]">
          <div className="flex justify-center gap-3 items-center text-slate-600 text-xl h-[50px]">
            <span>
              <AiOutlineMessage />
            </span>
            <span>Message</span>
          </div>
          <div className="w-full flex flex-col text-slate-600 py-4 h-[400px] pr-3">
            {my_friends?.map((friend, i) => (
              <Link
                to={`/dashboard/chat/${friend.fdId}`}
                key={friend.fdId} // Use `fdId` instead of `i`
                className="flex gap-2 justify-start items-center pl-2 py-[5px]"
              >
                <div className="w-[40px] h-[40px] rounded-full relative">
                  {activeSeller.some((c) => c.sellerId === friend.fdId) && (
                    <div className="w-[10px] h-[10px] rounded-full bg-green-600 absolute right-0 bottom-0"></div>
                  )}
                  <img
                    className="rounded-full w-full h-full"
                    src={friend.image}
                    alt={friend.name}
                  />
                </div>
                <span>{friend.name}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="w-[calc(100%-230px)]">
          {currentFd ? (
            <div className="w-full h-full">
              <div className="flex justify-start gap-3 items-center text-slate-600 text-xl h-[50px]">
                <div className="w-[40px] h-[40px] rounded-full relative">
                  {activeSeller.some((c) => c.sellerId === currentFd.fdId) && (
                    <div className="w-[10px] h-[10px] rounded-full bg-green-600 absolute right-0 bottom-0"></div>
                  )}
                  <img
                    className="rounded-full w-full h-full"
                    src={currentFd.image}
                    alt={currentFd.name}
                  />
                </div>
                <span>{currentFd.name}</span>
              </div>
              <div className="h-[400px] w-full bg-slate-100 p-3 rounded-md">
                <div className="w-full h-full overflow-y-auto flex flex-col gap-3">
                  {fd_message?.map((m) => {
                    const key = `${m.receverId}-${m.timestamp}`; // Assuming you have a timestamp or another unique identifier
                    if (currentFd?.fdId !== m.receverId) {
                      return (
                        <div
                          className="w-full flex gap-2 justify-start items-center text-[14px]"
                          key={key}
                          ref={messagesEndRef}
                        >
                          <img
                            className="w-[40px] h-[40px] rounded-full"
                            src={currentFd.image}
                            alt={currentFd.name}
                          />
                          <div className="p-2 bg-purple-500 text-white rounded-md">
                            <span>{m.message}</span>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          className="w-full flex gap-2 justify-end items-center text-[14px]"
                          key={key}
                          ref={messagesEndRef}
                        >
                          <div className="p-2 bg-purple-500 text-white rounded-md">
                            <span>{m.message}</span>
                          </div>
                          <img
                            className="w-[40px] h-[40px]"
                            src="http://localhost:3000/images/user.png" // User image placeholder
                            alt=""
                          />
                        </div>
                      );
                    }
                  })}
                </div>
              </div>

              <div className="flex p-2 justify-between items-center w-full">
                <div className="w-[40px] h-[40px] border p-2 justify-center items-center flex rounded-full">
                  <label className="cursor-pointer" htmlFor="file">
                    <AiOutlinePlus />
                  </label>
                  <input type="file" name="" className="hidden" id="file" />
                </div>
                <div className="border h-[40px] p-0 ml-2 w-[calc(100%-90px)] rounded-full relative">
                  <input
                    type="text"
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                    name=""
                    id=""
                    placeholder="input message"
                    className="w-full rounded-full h-full outline-none p-3"
                  />
                  <div className="text-2xl right-1 top-2 absolute cursor-auto">
                    <span>
                      <GrEmoji />
                    </span>
                  </div>
                </div>
                <div className="w-[40px] p-2 justify-center items-center rounded-full">
                  <div onClick={send} className="text-2xl cursor-pointer">
                    <IoSend />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center text-xl font-bold text-slate-600">
              <span>Select seller</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
