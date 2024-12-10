import React, { useEffect, useState } from 'react';
import { BsImages } from 'react-icons/bs';
import { FaEdit } from 'react-icons/fa';
import { PropagateLoader, FadeLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { overrideStyle } from '../../utils/utils';
import { profile_image_upload, messageClear, profile_info_add } from '../../store/Reducers/authReducer';
import { create_stripe_connect_account } from '../../store/Reducers/sellerReducer';

const Profile = () => {
    const [state, setState] = useState({
        division: '',
        district: '',
        shopName: '',
        sub_district: ''
    });
    const [isEditing, setIsEditing] = useState(false); // Estado para el modo de edición
    const dispatch = useDispatch();
    const { userInfo, loader, successMessage } = useSelector(state => state.auth);

    const add_image = (e) => {
        if (e.target.files.length > 0) {
            const formData = new FormData();
            formData.append('image', e.target.files[0]);
            dispatch(profile_image_upload(formData));
        }
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
    }, [successMessage, dispatch]);

    const handleEditClick = () => {
        setIsEditing(true);
        // Inicializa el estado con la información actual de la tienda si existe
        setState({
            shopName: userInfo.shopInfo?.shopName || '',
            division: userInfo.shopInfo?.division || '',
            district: userInfo.shopInfo?.district || '',
            sub_district: userInfo.shopInfo?.sub_district || ''
        });
    };

    const add = (e) => {
        e.preventDefault();
        dispatch(profile_info_add(state));
        setIsEditing(false); // Salir del modo de edición después de guardar
    };

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className='px-2 lg:px-7 py-5 bg-[#006400]'>
            <div className='w-full flex flex-wrap'>
                <div className='w-full md:w-6/12'>
                    <div className='w-full p-4 bg-[#FFFFFF] rounded-md text-[#d0d2d6]'>
                        <div className='flex justify-center items-center py-3'>
                            {userInfo?.image ? (
                                <label htmlFor="img" className='h-[210px] w-[300px] relative p-3 cursor-pointer overflow-hidden'>
                                    <img className='w-full h-full' src={userInfo.image} alt="" />
                                    {loader && (
                                        <div className='bg-slate-600 absolute left-0 top-0 w-full h-full opacity-70 flex justify-center items-center z-20'>
                                            <span>
                                                <FadeLoader />
                                            </span>
                                        </div>
                                    )}
                                </label>
                            ) : (
                                <label className='flex justify-center items-center flex-col h-[210px] w-[300px] cursor-pointer border border-dashed hover:border-indigo-500 border-[#d0d2d6] relative' htmlFor="img">
                                    <span><BsImages /></span>
                                    <span>Select Image</span>
                                    {loader && (
                                        <div className='bg-slate-500 absolute left-0 top-0 w-full h-full opacity-70 flex justify-center items-center z-20'>
                                            <span>
                                                <FadeLoader />
                                            </span>
                                        </div>
                                    )}
                                </label>
                            )}
                            <input onChange={add_image} type="file" className='hidden' id='img' />
                        </div>
                        <div className='px-0 md:px-5 py-2'>
                            <div className='flex justify-between text-sm flex-col gap-2 p-4 bg-green-800 rounded-md relative'>
                                <div className='flex gap-2'>
                                    <span>Nombre : </span>
                                    <span>{userInfo.name}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <span>Correo : </span>
                                    <span>{userInfo.email}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <span>Rol : </span>
                                    <span>{userInfo.role}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <span>Estado : </span>
                                    <span>{userInfo.status}</span>
                                </div>
                            </div>
                        </div>
                        <div className='px-0 md:px-5 py-2'>
                            {isEditing ? (
                                <form onSubmit={add}>
                                    <div className='flex flex-col w-full gap-1 mb-3 text-[#000000]'>
                                        <label htmlFor="Shop">Tienda</label>
                                        <input value={state.shopName} onChange={inputHandle} className='px-4 py-2 focus:border-[#84E08C] outline-none bg-[#d0d2d6] border border-slate-700 rounded-md text-[#000000]' type="text" placeholder='Nombre de la Tienda' name='shopName' id='Shop' />
                                    </div>
                                    <div className='flex flex-col w-full gap-1 text-[#000000]' >
                                        <label htmlFor="div">Distrito</label>
                                        <input value={state.division} onChange={inputHandle} className='px-4 py-2 focus:border-[#84E08C] outline-none bg-[#d0d2d6] border border-slate-700 rounded-md text-[#000000]' type="text" placeholder='Distrito' name='division' id='div' />
                                    </div>
                                    <div className='flex flex-col w-full gap-1 mb-3 text-[#000000]'>
                                        <label htmlFor="district">Barrio</label>
                                        <input value={state.district} onChange={inputHandle} className='px-4 py-2 focus:border-[#84E08C] outline-none bg-[#d0d2d6] border border-slate-700 rounded-md text-[#000000]' type="text" placeholder='Barrio' name='district' id='district' />
                                    </div>
                                    <div className='flex flex-col w-full gap-1 mb-3 text-[#000000]'>
                                        <label htmlFor="sub">Calle</label>
                                        <input value={state.sub_district} onChange={inputHandle} className='px-4 py-2 focus:border-[#84E08C] outline-none bg-[#d0d2d6] border border-slate-700 rounded-md text-[#000000]' type="text" placeholder='Calle' name='sub_district' id='sub' />
                                    </div>
                                    <button disabled={loader} className='bg-blue-500 w-[190px] hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3'>
                                        {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Guardar'}
                                    </button>
                                </form>
                            ) : (
                                <div className='flex justify-between text-sm flex-col gap-2 p-4 bg-green-800 rounded-md relative'>
                                    <span onClick={handleEditClick} className='p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50 absolute right-2 top-2 cursor-pointer'><FaEdit /></span>
                                    <div className='flex gap-2'>
                                        <span>Tienda : </span>
                                        <span>{userInfo.shopInfo?.shopName}</span>
                                    </div>
                                    <div className='flex gap-2'>
                                        <span>Distrito : </span>
                                        <span>{userInfo.shopInfo?.division}</span>
                                    </div>
                                    <div className='flex gap-2'>
                                        <span>Barrio : </span>
                                        <span>{userInfo.shopInfo?.district}</span>
                                    </div>
                                    <div className='flex gap-2'>
                                        <span>Calle : </span>
                                        <span>{userInfo.shopInfo?.sub_district}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='w-full md:w-6/12'>
                    <div className='w-full pl-0 md:pl-7 mt-6 md:mt-0'>
                        <div className='bg-[#ffffff] rounded-md text-[#000000] p-4'>
                            <h1 className='text-[#000000] text-lg mb-3 font-semibold'>Cambiar Contraseña</h1>
                            <form>
                                <div className='flex flex-col w-full gap-1 mb-3'>
                                    <label htmlFor="email">Correo</label>
                                    <input className='px-4 py-2 focus:border-[#84E08C] outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' type="email" placeholder='Tu correo' name='email' id='email' />
                                </div>
                                <div className='flex flex-col w-full gap-1'>
                                    <label htmlFor="o_password">Antigua Contraseña</label>
                                    <input className='px-4 py-2 focus:border-[#84E08C] outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' type="password" placeholder='Tu antigua contraseña' name='old_password' id='o_password' />
                                </div>
                                <div className='flex flex-col w-full gap-1'>
                                    <label htmlFor="n_password">Nueva Contraseña</label>
                                    <input className='px-4 py-2 focus:border-[#84E08C] outline-none bg-[#dce6f8] border border-slate-700 rounded-md text-[#070c16]' type="password" placeholder='Tu nueva contraseña' name='new_password' id='n_password' />
                                </div>
                                <button className='bg-green-500 hover:shadow-green-500/50 hover:shadow-lg text-white rounded-md px-7 py-2 mt-5'>Actualizar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
