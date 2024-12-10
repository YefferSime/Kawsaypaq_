import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { get_admin_order, admin_order_status_update, messageClear } from '../../store/Reducers/OrderReducer';

const OrderDetails = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();

    const { order, errorMessage, successMessage } = useSelector(state => state.order);

    useEffect(() => {
        dispatch(get_admin_order(orderId));
    }, [orderId, dispatch]);

    const [status, setStatus] = useState('');
    useEffect(() => {
        setStatus(order?.delivery_status);
    }, [order]);

    const status_update = (e) => {
        dispatch(admin_order_status_update({ orderId, info: { status: e.target.value } }));
        setStatus(e.target.value);
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);

    // Mapeo de estados en inglés a español con colores
    const statusMap = {

        paid: <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Pagado</span>,
        unpaid: <span className="bg-red-100 text-red-800 px-2 py-1 rounded">No pagado</span>,
    };

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full p-6 bg-[#ffffff] rounded-md shadow-md'>
                {/* Header */}
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-2xl font-bold text-[#000000]'>Detalles del Pedido</h2>
                    <select 
                        onChange={status_update} 
                        value={status} 
                        className='px-4 py-2 bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6] focus:outline-none'
                    >
                        <option value="pending">Pendiente</option>
                        <option value="processing">En proceso</option>
                        <option value="warehouse">En almacén</option>
                        <option value="placed">Listo para envío</option>
                        <option value="cancelled">Entregado</option>
                    </select>
                </div>

                {/* Order Info */}
                <div className='mb-6'>
                    <div className='flex justify-between items-center'>
                        <h2 className='text-lg font-medium text-[#000000]'>Pedido #{order?._id}</h2>
                        <span className='text-sm text-gray-500'>{order?.date}</span>
                    </div>
                </div>

                {/* Shipping Info */}
                <div className='bg-gray-50 p-4 rounded-md mb-6'>
                    <h3 className='font-semibold text-lg text-[#000000] mb-2'>Información de Envío</h3>
                    <p className='text-sm text-[#000000]'>
                        <span className='font-medium'>Nombre:</span> {order.shippingInfo?.name}
                    </p>
                    <p className='text-sm text-[#000000]'>
                        <span className='font-medium'>Dirección:</span> {order.shippingInfo?.address}, {order.shippingInfo?.province}, {order.shippingInfo?.city}, {order.shippingInfo?.area}
                    </p>
                </div>

                {/* Payment Info */}
                <div className='bg-gray-50 p-4 rounded-md mb-6'>
                    <h3 className='font-semibold text-lg text-[#000000] mb-2'>Información de Pago</h3>
                    <p className='text-sm text-[#000000] flex items-center'>
                        <span className='font-medium mr-2'>Estado del Pago:</span> {statusMap[order.payment_status]}
                    </p>
                    <p className='text-sm text-[#000000]'>
                        <span className='font-medium'>Precio Total:</span> S/{order.price}
                    </p>
                </div>

                {/* Products Info */}
                <div className='bg-gray-50 p-4 rounded-md'>
                    <h3 className='font-semibold text-lg text-[#000000] mb-4'>Productos</h3>
                    <div className='space-y-4'>
                        {order.products && order.products.map((product, index) => (
                            <div key={index} className='flex items-center gap-4 bg-gray-100 p-3 rounded-md'>
                                <img 
                                    className='w-[60px] h-[60px] object-cover rounded-md' 
                                    src={product.images[0]} 
                                    alt={product.name} 
                                />
                                <div>
                                    <h4 className='text-md font-medium text-[#000000]'>{product.name}</h4>
                                    <p className='text-sm text-gray-600'>
                                        <span className='font-medium'>Marca:</span> {product.brand}
                                    </p>
                                    <p className='text-sm text-gray-600'>
                                        <span className='font-medium'>Cantidad:</span> {product.quantity}
                                    </p>
                                    <p className='text-sm text-gray-600'>
                                        <span className='font-medium'>Precio:</span> ${product.price - Math.floor((product.price * product.discount) / 100)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
