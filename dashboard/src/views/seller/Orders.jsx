import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import Search from '../components/Search';
import { useSelector, useDispatch } from 'react-redux';
import { get_seller_orders } from '../../store/Reducers/OrderReducer';

const Orders = () => {
    const dispatch = useDispatch();
    const { totalOrder, myOrders } = useSelector((state) => state.order);
    const { userInfo } = useSelector((state) => state.auth);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [parPage, setParPage] = useState(5);

    const statusMap = {
        pending: 'Pendiente',
        paid: 'Pagado',
        unpaid: 'No pagado',
        processing: 'En proceso',
        warehouse: 'En almacén',
        placed: 'Listo para envío',
        cancelled: 'Cancelado',
    };

    useEffect(() => {
        dispatch(
            get_seller_orders({
                parPage: parseInt(parPage),
                page: parseInt(currentPage),
                searchValue,
                sellerId: userInfo._id,
            })
        );
    }, [parPage, currentPage, searchValue, dispatch, userInfo._id]);

    return (
        <div className="px-2 lg:px-7 pt-5 bg-[#006400] min-h-screen">
            <div className="w-full p-4 bg-[#FFFFFF] rounded-md">
                <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue} />
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left text-[#000000]">
                        <thead className="text-sm text-[#000000] uppercase border-b border-slate-700">
                            <tr>
                                <th scope="col" className="py-3 px-4">ID Orden</th>
                                <th scope="col" className="py-3 px-4">Precio</th>
                                <th scope="col" className="py-3 px-4">Estado de Pago</th>
                                <th scope="col" className="py-3 px-4">Estado de Orden</th>
                                <th scope="col" className="py-3 px-4">Fecha</th>
                                <th scope="col" className="py-3 px-4">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myOrders.map((d, i) => (
                                <tr key={i}>
                                    <td scope="row" className="py-3 px-4 font-medium whitespace-nowrap">#{d._id}</td>
                                    <td scope="row" className="py-3 px-4 font-medium whitespace-nowrap">S/{d.price}</td>
                                    <td scope="row" className="py-3 px-4 font-medium whitespace-nowrap">
                                        <span>{statusMap[d.payment_status] || d.payment_status}</span>
                                    </td>
                                    <td scope="row" className="py-3 px-4 font-medium whitespace-nowrap">
                                        <span>{statusMap[d.delivery_status] || d.delivery_status}</span>
                                    </td>
                                    <td scope="row" className="py-3 px-4 font-medium whitespace-nowrap">{d.date}</td>
                                    <td scope="row" className="py-3 px-4 font-medium whitespace-nowrap">
                                        <Link
                                            to={`/seller/dashboard/order/details/${d._id}`}
                                            className="p-[6px] w-[30px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50 flex justify-center items-center"
                                        >
                                            <FaEye />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {totalOrder > parPage && (
                    <div className="w-full flex justify-end mt-4 bottom-4 right-4">
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={totalOrder}
                            parPage={parPage}
                            showItem={3}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
