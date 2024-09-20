import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AiOutlineGooglePlus, AiOutlineGithub } from 'react-icons/ai'
import { FiFacebook } from 'react-icons/fi'
import { CiTwitter } from 'react-icons/ci'
import { PropagateLoader } from 'react-spinners'
import { useDispatch, useSelector } from 'react-redux'
import { messageClear, seller_register } from '../../store/Reducers/authReducer'

const Register = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loader, errorMessage, successMessage } = useSelector(state => state.auth)
    const [state, setState] = useState({
        name: '',
        email: "",
        password: ''
    })

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const submit = (e) => {
        e.preventDefault()
        dispatch(seller_register(state))
    }

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
            navigate('/')
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
    }, [successMessage, errorMessage])

    return (
        <div className='min-w-screen min-h-screen bg-gray-100 flex justify-center items-center'>
            <div className='w-[350px] text-black p-4'>
                <div className='bg-white shadow-lg p-6 rounded-lg'>
                    <div className='h-[70px] flex justify-center items-center mb-4'>
                        <div className='w-[180px] h-[50px]'>
                            <img className='w-full h-full' src="http://localhost:3000/images/logo.png" alt="Logo" />
                        </div>
                    </div>
                    <h2 className='text-2xl mb-3 text-green-600 font-semibold'>¡Unete a Kawsaypaq!</h2>
                    <p className='text-sm mb-5 text-gray-600'>Regístrate y sé parte de nosotros</p>
                    <form onSubmit={submit}>
                        <div className='flex flex-col w-full gap-2 mb-4'>
                            <label htmlFor="name" className='text-sm font-medium'>Nombre</label>
                            <input 
                                onChange={inputHandle} 
                                value={state.name} 
                                className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent' 
                                type="text" 
                                name='name' 
                                placeholder='Tu nombre' 
                                id='name' 
                                required 
                            />
                        </div>
                        <div className='flex flex-col w-full gap-2 mb-4'>
                            <label htmlFor="email" className='text-sm font-medium'>Correo</label>
                            <input 
                                onChange={inputHandle} 
                                value={state.email} 
                                className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent' 
                                type="email" 
                                name='email' 
                                placeholder='Tu correo' 
                                id='email' 
                                required 
                            />
                        </div>
                        <div className='flex flex-col w-full gap-2 mb-4'>
                            <label htmlFor="password" className='text-sm font-medium'>Contraseña</label>
                            <input 
                                onChange={inputHandle} 
                                value={state.password} 
                                className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent' 
                                type="password" 
                                name='password' 
                                placeholder='Tu contraseña' 
                                id='password' 
                                required 
                            />
                        </div>
                        <div className='flex items-center w-full gap-3 mb-4'>
                            <input 
                                className='w-4 h-4 text-green-600 bg-gray-100 rounded border-gray-300 focus:ring-green-500' 
                                type="checkbox" 
                                name='checkbox' 
                                id='checkbox' 
                                required 
                            />
                            <label htmlFor="checkbox" className='text-sm'>Estoy de acuerdo con las políticas de privacidad</label>
                        </div>
                        <button 
                            disabled={loader ? true : false} 
                            className='bg-green-600 w-full hover:bg-green-700 text-white rounded-md px-4 py-2 mb-4'>
                            { loader ? <PropagateLoader color='#fff' cssOverride={{ display: 'flex', margin: '0 auto', height: '24px', justifyContent: 'center', alignItems: "center" }} /> : 'Registrarse' }
                        </button>
                        <div className='flex items-center mb-4 gap-3 justify-center'>
                            <p>¿Ya tienes una cuenta? <Link className='text-green-600' to='/login'>¡Inicia sesión!</Link></p>
                        </div>
                        <div className='w-full flex justify-center items-center mb-4'>
                            <div className='w-[45%] bg-gray-300 h-[1px]'></div>
                            <div className='w-[10%] flex justify-center items-center'>
                                <span className='pb-1'>O</span>
                            </div>
                            <div className='w-[45%] bg-gray-300 h-[1px]'></div>
                        </div>
                        <div className='flex justify-center items-center gap-4'>
                            <div className='w-[35px] h-[35px] flex rounded-md bg-orange-700 shadow-lg hover:shadow-orange-700/50 justify-center cursor-pointer items-center'>
                                <AiOutlineGooglePlus />
                            </div>
                            <div className='w-[35px] h-[35px] flex rounded-md bg-indigo-700 shadow-lg hover:shadow-indigo-700/50 justify-center cursor-pointer items-center'>
                                <FiFacebook />
                            </div>
                            <div className='w-[35px] h-[35px] flex rounded-md bg-cyan-700 shadow-lg hover:shadow-cyan-700/50 justify-center cursor-pointer items-center'>
                                <CiTwitter />
                            </div>
                            <div className='w-[35px] h-[35px] flex rounded-md bg-purple-700 shadow-lg hover:shadow-purple-700/50 justify-center cursor-pointer items-center'>
                                <AiOutlineGithub />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register
