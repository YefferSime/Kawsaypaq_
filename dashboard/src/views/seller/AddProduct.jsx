import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BsImages } from 'react-icons/bs'
import { IoCloseSharp } from 'react-icons/io5'
import { useSelector, useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { PropagateLoader } from 'react-spinners'
import { overrideStyle } from '../../utils/utils'
import { get_category } from '../../store/Reducers/categoryReducer'
import { add_product, messageClear } from '../../store/Reducers/productReducer'
const AddProduct = () => {
    const dispatch = useDispatch()
    const userInfo = useSelector(state => state.auth.userInfo);
    console.log(userInfo.ShopName)
    const { categorys } = useSelector(state => state.category)
    const { successMessage, errorMessage, loader } = useSelector(state => state.product)
    
    useEffect(() => {
        dispatch(get_category({
            searchValue: '',
            parPage: '',
            page: ""
        }))
    }, [])
    const [state, setState] = useState({
        name: "",
        description: '',
        discount: '',
        price: "",
        brand: "",
        stock: ""
    })
    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const [cateShow, setCateShow] = useState(false)
    const [category, setCategory] = useState('')
    const [allCategory, setAllCategory] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const categorySearch = (e) => {
        const value = e.target.value
        setSearchValue(value)
        if (value) {
            let srcValue = allCategory.filter(c => c.name.toLowerCase().indexOf(value.toLowerCase()) > -1)
            setAllCategory(srcValue)
        } else {
            setAllCategory(categorys)
        }
    }
    const [images, setImages] = useState([])
    const [imageShow, setImageShow] = useState([])
    const inmageHandle = (e) => {
        const files = e.target.files
        const length = files.length;

        if (length > 0) {
            setImages([...images, ...files])
            let imageUrl = []

            for (let i = 0; i < length; i++) {
                imageUrl.push({ url: URL.createObjectURL(files[i]) })
            }
            setImageShow([...imageShow, ...imageUrl])
        }
    }

    const changeImage = (img, index) => {
        if (img) {
            let tempUrl = imageShow
            let tempImages = images

            tempImages[index] = img
            tempUrl[index] = { url: URL.createObjectURL(img) }
            setImageShow([...tempUrl])
            setImages([...tempImages])
        }
    }

    const removeImage = (i) => {
        const filterImage = images.filter((img, index) => index !== i)
        const filterImageUrl = imageShow.filter((img, index) => index !== i)
        setImages(filterImage)
        setImageShow(filterImageUrl)
    }

    useEffect(() => {
        setAllCategory(categorys)
    }, [categorys])
   
    const add = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('name', state.name)
        formData.append('description', state.description)
        formData.append('price', state.price)
        formData.append('stock', state.stock)
        formData.append('category', category)
        formData.append('discount', state.discount)
        formData.append('shopName', userInfo.shopInfo?.shopName || 'defaultShopName');
        formData.append('brand', state.brand)
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i])
        }
        dispatch(add_product(formData))
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
                name: "",
                description: '',
                discount: '',
                price: "",
                brand: "",
                stock: ""
            })
            setImageShow([])
            setImages([])
            setCategory('')

        }
    }, [successMessage, errorMessage])

    return (
        <div className='px-2 lg:px-7 pt-5 bg-[#006400]'>
            <div className='w-full p-4  bg-[#FFFFFF] rounded-md'>
                <div className='flex justify-between items-center pb-4'>
                    <h1 className='text-[#000000] text-xl font-semibold'>Añadir Producto</h1>
                    <Link className='bg-green-500 hover:shadow-green-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2 my-2 ' to='/seller/dashboard/products'>Productos</Link>
                </div>
                <div>
                    <form onSubmit={add}>
                        <div className='flex flex-col mb-3 md:flex-row gap-4 w-full text-[#000000]'>
                            <div className='flex flex-col w-full gap-1'>
                                <label htmlFor="name">Nombre del Producto:</label>
                                <input className='px-4 py-2 focus:border-green-500 outline-none bg-[#FFFFFF] border border-slate-700 rounded-md text-[#000000]' onChange={inputHandle} value={state.name} type="text" placeholder='Nombre del Producto' name='name' id='name' />
                            </div>
                            <div className='flex flex-col w-full gap-1'>
                                <label htmlFor="brand">Presentación:</label>
                                <input className='px-4 py-2 focus:border-green-500 outline-none bg-[#FFFFFF] border border-slate-700 rounded-md text-[#000000]' onChange={inputHandle} value={state.brand} type="text" placeholder='Presentación del Producto' name='brand' id='brand' />
                            </div>
                        </div>
                        <div className='flex flex-col mb-3 md:flex-row gap-4 w-full text-[#000000]'>
                            <div className='flex flex-col w-full gap-1 relative'>
                                <label htmlFor="category">Categoria</label>
                                <input readOnly onClick={() => setCateShow(!cateShow)} className='px-4 py-2 focus:border-green-800 outline-none bg-[#FFFFFFF] border border-slate-700 rounded-md text-[#d0d2d6]' onChange={inputHandle} value={category} type="text" placeholder='--Selecciona una categoria--' id='category' />
                                <div className={`absolute top-[101%] bg-green-800 w-full transition-all ${cateShow ? 'scale-100' : 'scale-0'}`}>
                                    <div className='w-full px-4 py-2 fixed'>
                                        <input value={searchValue} onChange={categorySearch} className='px-3 py-1 w-full focus:border-green-500 outline-none bg-transparent border border-slate-700 rounded-md text-[#d0d5df] overflow-hidden' type="text" placeholder='Buscar' />
                                    </div>
                                    <div className='pt-14'></div>
                                    <div className='flex justify-start items-start flex-col h-[200px] overflow-x-scroll'>
                                        {
                                            allCategory.map((c, i) => <span className={`px-4 py-2 hover:bg-green-400 text-[#d0d2d6] hover:text-black hover:shadow-lg w-full cursor-pointer ${category === c.name && 'bg-indigo-500'}`} onClick={() => {
                                                setCateShow(false)
                                                setCategory(c.name)
                                                setSearchValue('')
                                                setAllCategory(categorys)
                                            }}>{c.name}</span>)
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col w-full gap-1'>
                                <label htmlFor="stock">Cantidad en Kilos</label>
                                <input className='px-4 py-2 focus:border-green-500 outline-none bg-[#FFFFFF] border border-slate-700 rounded-md text-[#000000]' onChange={inputHandle} value={state.stock} type="number" min='0' placeholder='Kilos' name='stock' id='stock' />
                            </div>
                        </div>

                        <div className='flex flex-col mb-3 md:flex-row gap-4 w-full text-[#000000]'>
                            <div className='flex flex-col w-full gap-1'>
                                <label htmlFor="price">Precio</label>
                                <input className='px-4 py-2 focus:border-green-500 outline-none bg-[#FFFFFF] border border-slate-700 rounded-md text-[#000000]' onChange={inputHandle} value={state.price} type="number" placeholder='Precio del producto' name='price' id='price' />
                            </div>
                            <div className='flex flex-col w-full gap-1'>
                                <label htmlFor="discount">Descuento</label>
                                <input min='0' className='px-4 py-2 focus:border-green-500 outline-none bg-[#FFFFFF] border border-slate-700 rounded-md text-[#d0d2d6]' onChange={inputHandle} value={state.discount} type="number" placeholder='Descuento del producto' name='discount' id='discount' />
                            </div>
                        </div>
                        <div className='flex flex-col w-full gap-1 text-[#000000] mb-5'>
                            <label htmlFor="description">Descripción</label>
                            <textarea rows={4} className='px-4 py-2 focus:border-green-500 outline-none bg-[#FFFFFF] border border-slate-700 rounded-md text-[#000000]' onChange={inputHandle} value={state.description} placeholder='Asigna una descripción' name='description' id='description'></textarea>
                        </div>
                        <div className='grid lg:grid-cols-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 sm:gap-4 md:gap-4 xs:gap-4 gap-3 w-full text-[#d0d2d6] mb-4'>
                            {
                                imageShow.map((img, i) => <div className='h-[180px] relative'>
                                    <label htmlFor={i}>
                                        <img className='w-full h-full rounded-sm' src={img.url} alt="" />
                                    </label>
                                    <input onChange={(e) => changeImage(e.target.files[0], i)} type="file" id={i} className='hidden' />
                                    <span onClick={() => removeImage(i)} className='p-2 z-10 cursor-pointer bg-slate-700 hover:shadow-lg hover:shadow-slate-400/50 text-white absolute top-1 right-1 rounded-full'><IoCloseSharp /></span>
                                </div>
                                )
                            }
                            <label className='flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed border-black hover:border-green-500 w-full text-[#000000]' htmlFor="image">
                                <span><BsImages /></span>
                                <span>Selecciona una imagen</span>
                            </label>
                            <input multiple onChange={inmageHandle} className='hidden' type="file" id='image' />
                        </div>
                        <div className='flex'>
                        <button disabled={loader ? true : false} className='bg-green-500 w-[190px] hover:shadow-green-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3'>
                                {
                                    loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Añadir Producto'
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddProduct