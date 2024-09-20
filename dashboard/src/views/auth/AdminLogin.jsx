import React, { useEffect, useState } from 'react'
import { PropagateLoader } from 'react-spinners'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { admin_login, messageClear } from '../../store/Reducers/authReducer'

const AdminLogin = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loader, errorMessage, successMessage } = useSelector(state => state.auth)
    const [state, setState] = useState({
        email: '',
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
        dispatch(admin_login(state))
    }

    const overrideStyle = {
        display: 'flex',
        margin: '0 auto',
        height: '24px',
        justifyContent: 'center',
        alignItems: "center"
    }

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
            navigate('/')
        }
    }, [errorMessage, successMessage])

    return (
        <div className='min-w-screen min-h-screen bg-gray-100 flex justify-center items-center'>
            <div className='w-[350px] text-black p-4'>
                <div className='bg-white shadow-lg p-6 rounded-lg'>
                    <div className='h-[70px] flex justify-center items-center mb-4'>
                        <div className='w-[180px] h-[50px]'>
                            <img className='w-full h-full' src="http://localhost:3000/images/logo.png" alt="Logo" />
                        </div>
                    </div>
                    <form onSubmit={submit}>
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
                        <div className='flex flex-col w-full gap-2 mb-6'>
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
                        <button 
                            disabled={loader ? true : false} 
                            className='bg-green-600 w-full hover:bg-green-700 text-white rounded-md px-4 py-2 mb-3 transition-all duration-300 ease-in-out'>
                            {
                                loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Iniciar Sesión'
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin
