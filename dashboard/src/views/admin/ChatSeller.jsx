import React, { useEffect, useState, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { FaList } from "react-icons/fa";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get_sellers, send_message_seller_admin, messageClear, get_admin_message, updateSellerMessage } from "../../store/Reducers/chatReducer";
import { BsEmojiSmile } from "react-icons/bs";
import toast from "react-hot-toast";
import { socket } from "../../utils/utils";

const DEFAULT_IMAGE = "https://res.cloudinary.com/dpj4vsqbo/image/upload/v1733721452/categorys/lyihaamrmu79acd9ei1c.png";

const ChatSeller = () => {
  const scrollRef = useRef();
  const { sellerId } = useParams();
  const dispatch = useDispatch();
  const { sellers, activeSellers, seller_admin_message, currentSeller, successMessage } = useSelector((state) => state.chat);
  const { userInfo } = useSelector((state) => state.auth);
  const [show, setShow] = useState(false);
  const [receivedMessage, setReceivedMessage] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    dispatch(get_sellers());
  }, [dispatch]);

  const send = (e) => {
    e.preventDefault();
    dispatch(
      send_message_seller_admin({
        senderId: "",
        receverId: sellerId,
        message: text,
        senderName: "Myshop support",
      })
    );
    setText("");
  };

  useEffect(() => {
    if (sellerId) {
      dispatch(get_admin_message(sellerId));
    }
  }, [sellerId, dispatch]);

  useEffect(() => {
    if (successMessage) {
      socket.emit("send_message_admin_to_seller", seller_admin_message[seller_admin_message.length - 1]);
      dispatch(messageClear());
    }
  }, [successMessage, seller_admin_message, dispatch]);

  useEffect(() => {
    socket.on("received_seller_message", (msg) => {
      setReceivedMessage(msg);
    });
  }, []);

  useEffect(() => {
    if (receivedMessage) {
      if (receivedMessage.senderId === sellerId && receivedMessage.receverId === "") {
        dispatch(updateSellerMessage(receivedMessage));
      } else {
        toast.success(receivedMessage.senderName + " sent a message");
      }
    }
  }, [receivedMessage, dispatch, sellerId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [seller_admin_message]);

  return (
    <div className="px-2 lg:px-7 py-5">
      <div className="w-full bg-[#FFFFFF] px-4 py-4 rounded-md h-[calc(100vh-140px)]">
        <div className="flex w-full h-full relative">
          {/* Seller List */}
          <div className={`w-[280px] h-full absolute z-10 ${show ? "-left-[16px]" : "-left-[336px]"} md:left-0 md:relative transition-all`}>
            <div className="w-full h-[calc(100vh-177px)] bg-[#252b3b] md:bg-transparent overflow-y-auto">
              <div className="flex text-xl justify-between items-center p-4 md:p-0 md:px-3 md:pb-3 text-black">
                <h2>Vendedores</h2>
                <span onClick={() => setShow(!show)} className="block cursor-pointer md:hidden">
                  <IoMdClose />
                </span>
              </div>
              {sellers.map((s, i) => (
                <Link
                  key={i}
                  to={`/admin/dashboard/chat-sellers/${s._id}`}
                  className={`h-[60px] flex justify-start gap-2 items-center text-black px-2 rounded-sm py-2 cursor-pointer ${sellerId === s._id ? "bg-[#6EE15E]" : ""}`}
                >
                  <div className="relative">
                    <img
                      className="w-[38px] h-[38px] border-white border-2 rounded-full object-cover"
                      src={s.image || DEFAULT_IMAGE}
                      alt={s.name}
                      onError={(e) => (e.target.src = DEFAULT_IMAGE)}
                    />
                    {activeSellers.some((a) => a.sellerId === s._id) && <div className="w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0"></div>}
                  </div>
                  <div className="flex justify-center items-start flex-col w-full">
                    <div className="flex justify-between items-center w-full">
                      <h2 className="text-base font-semibold">{s.name}</h2>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          {/* Chat Window */}
          <div className="w-full md:w-[calc(100%-200px)] md:pl-4">
            <div className="flex justify-between items-center">
              {sellerId && (
                <div className="flex justify-start items-center gap-3">
                  <div className="relative">
                    <img
                      className="w-[42px] h-[42px] border-green-500 border-2 rounded-full object-cover"
                      src={currentSeller?.image || DEFAULT_IMAGE}
                      alt={currentSeller?.name}
                      onError={(e) => (e.target.src = DEFAULT_IMAGE)}
                    />
                    <div className="w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0"></div>
                  </div>
                  <span className="text-black">{currentSeller?.name}</span>
                </div>
              )}
              <div onClick={() => setShow(!show)} className="w-[35px] flex md:hidden h-[35px] rounded-sm bg-blue-500 shadow-lg hover:shadow-blue-500/50 justify-center cursor-pointer items-center text-white">
                <span>
                  <FaList />
                </span>
              </div>
            </div>
            <div className="py-4">
              <div className="bg-[#84e08c] h-[calc(100vh-290px)] rounded-md p-3 overflow-y-auto">
                {sellerId ? (
                  seller_admin_message.map((m, i) => {
                    const isSender = m.senderId === sellerId;
                    return (
                      <div ref={scrollRef} className={`w-full flex ${isSender ? "justify-start" : "justify-end"} items-center`} key={i}>
                        <div className={`flex gap-2 md:px-3 py-2 max-w-full lg:max-w-[85%] ${isSender ? "flex-row" : "flex-row-reverse"}`}>
                          <img
                            className="w-[38px] h-[38px] border-2 border-white rounded-full object-cover"
                            src={isSender ? currentSeller?.image || DEFAULT_IMAGE : userInfo?.image || DEFAULT_IMAGE}
                            alt=""
                            onError={(e) => (e.target.src = DEFAULT_IMAGE)}
                          />
                          <div className={`flex justify-center items-start flex-col w-full ${isSender ? "bg-orange-500" : "bg-[#6EE15E]"} shadow-lg text-white py-1 px-2 rounded-sm`}>
                            <span>{m.message}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full h-full flex justify-center items-center flex-col gap-2 text-white">
                    <span>
                      <BsEmojiSmile />
                    </span>
                    <span>Selecciona un vendedor...</span>
                  </div>
                )}
              </div>
            </div>
            <form onSubmit={send} className="flex gap-3">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                readOnly={!sellerId}
                className="w-full flex justify-between px-2 border border-slate-700 items-center py-[5px] focus:border-blue-500 rounded-md outline-none bg-transparent text-[#000000]"
                type="text"
                placeholder="Escribe un mensaje"
              />
              <button disabled={!sellerId} className="shadow-lg bg-green-500 hover:shadow-green-500/50 text-semibold w-[75px] h-[35px] rounded-md text-white flex justify-center items-center">
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSeller;
