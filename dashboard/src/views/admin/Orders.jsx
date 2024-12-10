import React, { useState, useEffect } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { useSelector, useDispatch } from 'react-redux';
import { get_admin_orders } from '../../store/Reducers/OrderReducer';

const Orders = () => {
    const dispatch = useDispatch();
    const { totalOrder, myOrders } = useSelector(state => state.order);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [parPage, setParPage] = useState(5);
    const [show, setShow] = useState('');

    // Mapeo de estados en inglés a español
    const statusMap = {
        pending: 'Pendiente',
        paid: 'Pagado',
        unpaid: 'No pagado',
        processing: 'En proceso',
        warehouse: 'En almacén',
        placed: 'Listo para envío',
        cancelled: 'Entregado',
    };

    useEffect(() => {
        dispatch(get_admin_orders({
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue,
        }));
    }, [parPage, currentPage, searchValue, dispatch]);

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full p-4 bg-[#FFFFFF] rounded-md'>
                <div className='flex justify-between items-center'>
                    <select 
                        onChange={(e) => setParPage(parseInt(e.target.value))} 
                        className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#000000] border border-slate-700 rounded-md text-[#d0d2d6]'
                    >
                        <option value="5">5</option>
                        <option value="15">15</option>
                        <option value="25">25</option>
                    </select>
                    <input 
                        className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#000000] border border-slate-700 rounded-md text-[#000000]' 
                        type="text" 
                        placeholder='Buscar...' 
                        onChange={(e) => setSearchValue(e.target.value)} 
                    />
                </div>
                <div className='relative mt-5 overflow-x-auto'>
                    <div className='w-full text-sm text-left text-[#000000]'>
                        <div className='text-sm text-[#000000] uppercase border-b border-slate-700'>
                            <div className='flex justify-between items-start'>
                                <div className='py-3 w-[25%]'>ID de la Orden</div>
                                <div className='py-3 w-[13%]'>Precio</div>
                                <div className='py-3 w-[18%]'>Estado del Pago</div>
                                <div className='py-3 w-[18%]'>Estado de la Orden</div>
                                <div className='py-3 w-[18%]'>Acción</div>
                                <div className='py-3 w-[8%]'>
                                    <MdKeyboardArrowDown />
                                </div>
                            </div>
                        </div>
                        {
                            myOrders.map((o, i) => (
                                <div key={i} className='text-[#000000]'>
                                    <div className='flex justify-between items-start border-b border-slate-700'>
                                        <div className='py-4 w-[25%] font-medium whitespace-nowrap'>{o._id}</div>
                                        <div className='py-4 w-[13%]'>S/{o.price}</div>
                                        <div className='py-4 w-[18%]'>{statusMap[o.payment_status]}</div>
                                        <div className='py-4 w-[18%]'>{statusMap[o.delivery_status]}</div>
                                        <div className='py-4 w-[18%]'>
                                            <Link to={`/admin/dashboard/order/details/${o._id}`}>Ver</Link>
                                        </div>
                                        <div onClick={() => setShow(o._id)} className='py-4 cursor-pointer w-[8%]'>
                                            <MdKeyboardArrowDown />
                                        </div>
                                    </div>
                                    <div className={show === o._id ? 'block border-b border-slate-700 bg-slate-800' : 'hidden'}>
                                        {
                                            o.suborder.map((so, i) => (
                                                <div key={i} className='flex justify-start items-start border-b border-slate-700'>
                                                    <div className='py-4 w-[25%] font-medium whitespace-nowrap pl-3'>{so._id}</div>
                                                    <div className='py-4 w-[13%]'>S/{so.price}</div>
                                                    <div className='py-4 w-[18%]'>{statusMap[so.payment_status]}</div>
                                                    <div className='py-4 w-[18%]'>{statusMap[so.delivery_status]}</div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                {
                    totalOrder <= parPage ? "" : (
                        <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
                            <Pagination
                                pageNumber={currentPage}
                                setPageNumber={setCurrentPage}
                                totalItem={totalOrder}
                                parPage={parPage}
                                showItem={4}
                            />
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Orders;
