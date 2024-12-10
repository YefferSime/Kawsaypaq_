import React, { useState, useEffect } from 'react';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { GiKnightBanner } from 'react-icons/gi';
import { useSelector, useDispatch } from 'react-redux';
import Pagination from '../Pagination';
import Search from '../components/Search';
import { get_products, messageClear, delete_product } from '../../store/Reducers/productReducer';
import toast, { Toaster } from 'react-hot-toast';

const Products = () => {
    const dispatch = useDispatch();
    const { products, totalProduct, successMessage, errorMessage } = useSelector(state => state.product);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [parPage, setParPage] = useState(5);

    const baseURL = "http://localhost:5000";

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        };
        dispatch(get_products(obj));
    }, [searchValue, currentPage, parPage, dispatch]);

    const handleDelete = (productId) => {
        // Confirmar eliminación
        toast((t) => (
            <span>
                ¿Estás seguro de que deseas eliminar este producto?
                <button
                    onClick={() => {
                        dispatch(delete_product(productId)).then(() => {
                            dispatch(get_products({
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

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);

    return (
        <div className='px-2 lg:px-7 pt-5 bg-[#006400] min-h-screen'>
            <Toaster position="top-right" reverseOrder={false} />
            <div className='w-full p-4 bg-[#FFFFFF] rounded-md'>
                <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue} />
                <div className='relative overflow-x-auto mt-5'>
                    <table className='w-full text-sm text-left text-[#000000]'>
                        <thead className='text-sm text-[#000000] uppercase border-b border-slate-700'>
                            <tr>
                                <th scope='col' className='py-3 px-4'>N°</th>
                                <th scope='col' className='py-3 px-4'>Imagen</th>
                                <th scope='col' className='py-3 px-4'>Nombre</th>
                                <th scope='col' className='py-3 px-4'>Categoria</th>
                                <th scope='col' className='py-3 px-4'>Brand</th>
                                <th scope='col' className='py-3 px-4'>Precio</th>
                                <th scope='col' className='py-3 px-4'>Descuento</th>
                                <th scope='col' className='py-3 px-4'>Kilos</th>
                                <th scope='col' className='py-3 px-4'>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                products.map((d, i) => <tr key={i}>
                                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{i + 1}</td>
                                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                        <img className='w-[45px] h-[45px]' src={`${d.images[0]}`} alt="" />
                                    </td>
                                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                        <span>{d?.name?.slice(0, 16)}...</span>
                                    </td>
                                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                        <span>{d.category}</span>
                                    </td>
                                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                        <span>{d.brand}</span>
                                    </td>
                                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                        <span>S/{d.price}</span>
                                    </td>
                                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                        {
                                            d.discount === 0 ? <span>no discount</span> : <span>${d.discount}%</span>
                                        }
                                    </td>
                                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                        <span>{d.stock}</span>
                                    </td>
                                    <td scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                                        <div className='flex justify-start items-center gap-4'>
                                            <Link to={`/seller/dashboard/edit-product/${d._id}`} className='p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50'><FaEdit /></Link>
                                            <Link className='p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50'><FaEye /></Link>
                                            <button onClick={() => handleDelete(d._id)} className='p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50'><FaTrash /></button>
                                            <Link to={`/seller/dashboard/add-banner/${d._id}`} className='p-[6px] bg-cyan-500 rounded hover:shadow-lg hover:shadow-cyan-500/50'><GiKnightBanner /></Link>
                                        </div>
                                    </td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
                {
                    totalProduct <= parPage ? "" : <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={totalProduct}
                            parPage={parPage}
                            showItem={4}
                        />
                    </div>
                }
            </div>
        </div>
    );
}

export default Products;
