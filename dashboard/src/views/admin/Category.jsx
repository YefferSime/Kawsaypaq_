import React, { useEffect, useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { PropagateLoader } from 'react-spinners'
import { overrideStyle } from '../../utils/utils'
import { GrClose } from 'react-icons/gr'
import { Link } from 'react-router-dom'
import Pagination from '../Pagination'
import { BsImage } from 'react-icons/bs'
import toast from 'react-hot-toast'
import { useSelector, useDispatch } from 'react-redux'
import Search from '../components/Search'
import { categoryAdd, messageClear, get_category, delete_category } from '../../store/Reducers/categoryReducer'
const Category = () => {
    const dispatch = useDispatch()
    const { loader, successMessage, errorMessage, categorys } = useSelector(state => state.category)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(5)
    const [show, setShow] = useState(false)
    const [imageShow, setImage] = useState('')
    const [state, setState] = useState({
        name: '',
        image: ''
    })

    const handleDelete = (categoryId) => {
        toast((t) => (
            <span>
                ¿Estás seguro de que deseas eliminar esta categoría?
                <button
                    onClick={() => {
                        dispatch(delete_category(categoryId)).then(() => {
                            dispatch(get_category({
                                parPage: parseInt(parPage),
                                page: parseInt(currentPage),
                                searchValue
                            }));
                        });
                        toast.dismiss(t.id);
                    }}
                    className='ml-2 bg-green-500 text-white px-2 py-1 rounded'
                >
                    Sí
                </button>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className='ml-2 bg-red-500 text-white px-2 py-1 rounded'
                >
                    No
                </button>
            </span>
        ), {
            duration: 4000
        });
    };

    const imageHandle = (e) => {
        let files = e.target.files
        if (files.length > 0) {
            setImage(URL.createObjectURL(files[0]))
            setState({
                ...state,
                image: files[0]
            })
        }
    }
    const add_category = (e) => {
        e.preventDefault()
        dispatch(categoryAdd(state))
    }

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
            setState({
                name: '',
                image: ''
            })
            setImage('')
        }
    }, [successMessage, errorMessage])

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        }
        dispatch(get_category(obj))
    }, [searchValue, currentPage, parPage])
    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='flex lg:hidden justify-between items-center mb-5 p-4 bg-[#1C1C1C] rounded-md'>
                <h1 className='text-[#d0d2d6] font-semibold text-lg'>Categorias</h1>
                <button onClick={() => setShow(true)} className='bg-indigo-500 shadow-lg hover:shadow-indigo-500/50 px-4 py-2 cursor-pointer text-white rounded-sm text-sm'>Add</button>
            </div>
            <div className='flex flex-wrap w-full'>
                <div className='w-full lg:w-7/12'>
                    <div className='w-full p-4  bg-[#FFFFFF] rounded-md'>
                        <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue} />
                        <div className='relative overflow-x-auto'>
                            <table className='w-full text-sm text-left text-[#000000]'>
                                <thead className='text-sm text-[#000000] uppercase border-b border-slate-700'>
                                    <tr>
                                        <th scope='col' className='py-3 px-4'>N°</th>
                                        <th scope='col' className='py-3 px-4'>Imagen</th>
                                        <th scope='col' className='py-3 px-4'>Nombre</th>
                                        <th scope='col' className='py-3 px-4'>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        categorys.map((d, i) => <tr key={i}>
                                            <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{i + 1}</td>
                                            <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                                <img className='w-[45px] h-[45px]' src={d.image} alt="" />
                                            </td>
                                            <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                                <span>{d.name}</span>
                                            </td>
                                            <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                                <div className='flex justify-start items-center gap-4'>
                                                    <Link className='p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50'><FaEdit /></Link>
                                                    <button onClick={() => handleDelete(d._id)} className='p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50'>
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>)
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
                            <Pagination
                                pageNumber={currentPage}
                                setPageNumber={setCurrentPage}
                                totalItem={50}
                                parPage={parPage}
                                showItem={4}
                            />
                        </div>
                    </div>
                </div>
                <div className={`w-[320px] lg:w-5/12 translate-x-100 lg:relative lg:right-0 fixed ${show ? 'right-0' : '-right-[340px]'} z-[9999] top-0 transition-all duration-500`}>
                    <div className='w-full pl-5'>
                        <div className='bg-[#FFFFFF] h-screen lg:h-auto px-3 py-2 lg:rounded-md text-[#000000]'>
                            <div className='flex justify-between items-center mb-4'>
                                <h1 className='text-[#000000] font-semibold text-xl'>Agregar Categoria</h1>
                                <div onClick={() => setShow(false)} className='block lg:hidden cursor-pointer'><GrClose className='text-[#d0d2d6]' /></div>
                            </div>
                            <form onSubmit={add_category}>
                                <div className='flex flex-col w-full gap-1 mb-3'>
                                    <label htmlFor="name">Nombre de la Categoria</label>
                                    <input value={state.name} onChange={(e) => setState({ ...state, name: e.target.value })} className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#ffffff] border border-slate-700 rounded-md text-[#000000]' type="text" id='name' name='category_name' placeholder='Nombre de la categoria' required />
                                </div>
                                <div>

                                    <label className='flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed border-black hover:border-indigo-500 w-full text-[#000000]' htmlFor="image">
                                        {
                                            imageShow ? <img className='w-full h-full' src={imageShow} /> : <>
                                                <span><BsImage /></span>
                                                <span>Seleecionar Imagen</span>
                                            </>
                                        }

                                    </label>
                                </div>
                                <input onChange={imageHandle} className='hidden' type="file" name='image' id='image' required />
                                <div className='mt-4'>
                                    <button disabled={loader ? true : false} className='bg-green-500 w-full hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3'>
                                        {
                                            loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Agregar Categoria'
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Category