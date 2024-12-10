import React, { useEffect, useRef, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FaList } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_customers, messageClear, get_customer_message, send_message, updateMessage } from '../../store/Reducers/chatReducer';
import { socket } from '../../utils/utils';
import { BsEmojiSmile } from 'react-icons/bs';

const SellerToCustomer = () => {
    const scrollRef = useRef();
    const { userInfo } = useSelector((state) => state.auth);
    const { customers, currentCustomer, messages, successMessage, activeCustomer } = useSelector((state) => state.chat);
    const [receverMessage, setReceverMessage] = useState('');
    const dispatch = useDispatch();
    const [text, setText] = useState('');
    const { customerId } = useParams();

    const [show, setShow] = useState(false);

    const defaultImage = 'https://res.cloudinary.com/dpj4vsqbo/image/upload/v1733721452/categorys/lyihaamrmu79acd9ei1c.png';

    const getSenderImage = (isCustomerMessage, customerImage) => {
        return isCustomerMessage
            ? customerImage || defaultImage // Imagen del cliente o default
            : userInfo?.image || defaultImage; // Imagen del vendedor o default
    };

    useEffect(() => {
        dispatch(get_customers(userInfo._id));
    }, [dispatch, userInfo]);

    useEffect(() => {
        if (customerId) {
            dispatch(get_customer_message(customerId));
        }
    }, [customerId, dispatch]);

    const send = (e) => {
        e.preventDefault();
        dispatch(
            send_message({
                senderId: userInfo._id,
                receverId: customerId,
                text,
                name: userInfo?.shopInfo?.shopName,
            })
        );
        setText('');
    };

    useEffect(() => {
        if (successMessage) {
            socket.emit('send_seller_message', messages[messages.length - 1]);
            dispatch(messageClear());
        }
    }, [successMessage, dispatch, messages]);

    useEffect(() => {
        socket.on('customer_message', (msg) => {
            setReceverMessage(msg);
        });
    }, []);

    useEffect(() => {
        if (receverMessage) {
            if (customerId === receverMessage.senderId && userInfo._id === receverMessage.receverId) {
                dispatch(updateMessage(receverMessage));
            } else {
                toast.success(`${receverMessage.senderName} te ha enviado un mensaje`);
                dispatch(messageClear());
            }
        }
    }, [receverMessage, customerId, userInfo, dispatch]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="px-2 lg:px-7 pt-5 bg-[#006400] min-h-screen">
            <div className="w-full bg-[#FFFFFF] px-4 py-4 rounded-md h-[calc(100vh-140px)]">
                <div className="flex w-full h-full relative">
                    {/* Lista de clientes */}
                    <div className={`w-[280px] h-full absolute z-10 ${show ? '-left-[16px]' : '-left-[336px]'} md:left-0 md:relative transition-all`}>
                        <div className="w-full h-[calc(100vh-177px)] bg-[#006400] md:bg-transparent overflow-y-auto">
                            <div className="flex text-xl justify-between items-center p-4 md:p-0 md:px-3 md:pb-3 text-black">
                                <h2>Clientes</h2>
                                <span onClick={() => setShow(!show)} className="block cursor-pointer md:hidden">
                                    <IoMdClose />
                                </span>
                            </div>
                            {customers.map((c, i) => (
                                <Link
                                    key={i}
                                    to={`/seller/dashboard/chat-customer/${c.fdId}`}
                                    className={`h-[60px] flex justify-start gap-2 items-center text-black px-2 py-2 cursor-pointer ${
                                        customerId === c.fdId ? 'bg-[#6EE15E] border rounded-lg' : ''
                                    }`}
                                >
                                    <div className="relative">
                                        <img
                                            className="w-[38px] h-[38px] border-white border-2 max-w-[38px] p-[2px] rounded-full"
                                            src={c.image || defaultImage}
                                            alt="Cliente"
                                        />
                                        {activeCustomer.some((a) => a.customerId === c.fdId) && (
                                            <div className="w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0"></div>
                                        )}
                                    </div>
                                    <div className="flex justify-center items-start flex-col w-full">
                                        <h2 className="text-base font-semibold">{c.name}</h2>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                    {/* Chat principal */}
                    <div className="w-full md:w-[calc(100%-200px)] md:pl-4">
                        <div className="flex justify-between items-center">
                            {customerId && (
                                <div className="flex justify-start items-center gap-3">
                                    <div className="relative">
                                        <img
                                            className="w-[42px] h-[42px] border-green-500 border-2 max-w-[42px] p-[2px] rounded-full"
                                            src={userInfo?.shopInfo?.image || defaultImage}
                                            alt="Vendedor"
                                        />
                                        {activeCustomer.some((a) => a.customerId === currentCustomer._id) && (
                                            <div className="w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0"></div>
                                        )}
                                    </div>
                                    <h2 className="text-base text-black font-semibold">{currentCustomer.name}</h2>
                                </div>
                            )}
                            <div
                                onClick={() => setShow(!show)}
                                className="w-[35px] flex md:hidden h-[35px] rounded-sm bg-blue-500 shadow-lg hover:shadow-blue-500/50 justify-center cursor-pointer items-center text-white"
                            >
                                <span>
                                    <FaList />
                                </span>
                            </div>
                        </div>
                        <div className="py-4">
                            <div className="bg-[#84E08C] h-[calc(100vh-290px)] rounded-md p-3 overflow-y-auto">
                                {customerId ? (
                                    messages.map((m, i) => {
                                        const isCustomerMessage = m.senderId === customerId;
                                        const senderImage = getSenderImage(isCustomerMessage, currentCustomer?.image);
                                        return (
                                            <div
                                                key={i}
                                                ref={scrollRef}
                                                className={`w-full flex ${isCustomerMessage ? 'justify-start' : 'justify-end'} items-center`}
                                            >
                                                {isCustomerMessage && (
                                                    <div className="flex justify-start items-start gap-2 md:px-3 py-2 max-w-full lg:max-w-[85%]">
                                                        <img
                                                            className="w-[38px] h-[38px] border-2 border-white rounded-full max-w-[38px] p-[3px]"
                                                            src={senderImage}
                                                            alt="Cliente"
                                                        />
                                                        <div className="flex justify-center items-start flex-col w-full bg-orange-500 shadow-lg shadow-orange-500/50 text-white py-1 px-2 rounded-sm">
                                                            <span>{m.message}</span>
                                                        </div>
                                                    </div>
                                                )}
                                                {!isCustomerMessage && (
                                                    <div className="flex justify-end items-start gap-2 md:px-3 py-2 max-w-full lg:max-w-[85%]">
                                                        <div className="flex justify-center items-start flex-col w-full bg-blue-500 shadow-lg shadow-blue-500/50 text-white py-1 px-2 rounded-sm">
                                                            <span>{m.message}</span>
                                                        </div>
                                                        <img
                                                            className="w-[38px] h-[38px] border-2 border-white rounded-full max-w-[38px] p-[3px]"
                                                            src={senderImage}
                                                            alt="Vendedor"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="w-full h-full flex justify-center items-center flex-col gap-2 text-white">
                                        <span>
                                            <BsEmojiSmile />
                                        </span>
                                        <span>Selecciona un cliente...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <form onSubmit={send} className="flex gap-3">
                            <input
                                readOnly={!customerId}
                                onChange={(e) => setText(e.target.value)}
                                value={text}
                                className="w-full flex justify-between px-2 border border-slate-700 items-center py-[5px] focus:border-blue-500 rounded-md outline-none bg-transparent text-[#000000]"
                                type="text"
                                placeholder="Escribe un mensaje"
                            />
                            <button
                                disabled={!customerId}
                                className="shadow-lg bg-[#6EE15E] hover:shadow-[#6EE15E]/50 text-semibold w-[75px] h-[35px] rounded-md text-black flex justify-center items-center"
                            >
                                Enviar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerToCustomer;
