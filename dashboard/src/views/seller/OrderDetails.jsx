import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { messageClear, get_seller_order, seller_order_status_update } from '../../store/Reducers/OrderReducer';

const OrderDetails = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const { order, errorMessage, successMessage } = useSelector(state => state.order);

    useEffect(() => {
        dispatch(get_seller_order(orderId));
    }, [orderId, dispatch]);

    const [status, setStatus] = useState('');
    useEffect(() => {
        if (order) {
            setStatus(order.delivery_status);
        }
    }, [order]);

    const status_update = (e) => {
        const newStatus = e.target.value;
        dispatch(seller_order_status_update({ orderId, info: { status: newStatus } }));
        setStatus(newStatus);
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

    const statusMap = {
        pending: <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pendiente</span>,
        processing: <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">En proceso</span>,
        warehouse: <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">En almacén</span>,
        placed: <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">Listo para envío</span>,
        cancelled: <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Cancelado</span>,
        delivered: <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Entregado</span>,
        paid: <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Pagado</span>,
        unpaid: <span className="bg-red-100 text-red-800 px-2 py-1 rounded">No pagado</span>,
    };

    if (!order) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="max-w-lg bg-white p-6 shadow-md rounded-md text-center">
                    <h2 className="text-2xl font-semibold text-gray-700">Orden no encontrada</h2>
                    <p className="text-gray-500 mt-2">La orden solicitada no está disponible.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 lg:px-8 py-6 bg-green-1000 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
                {/* Encabezado */}
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h2 className="text-xl font-semibold text-gray-700">Detalles de la Orden #{order._id}</h2>
                    <select
                        onChange={status_update}
                        value={status}
                        className="px-4 py-2 bg-green-700 text-white rounded-md focus:outline-none"
                    >
                        <option value="pending">Pendiente</option>
                        <option value="processing">En proceso</option>
                        <option value="warehouse">En almacén</option>
                        <option value="cancelled">Cancelado</option>
                        <option value="delivered">Entregado</option>
                    </select>
                </div>

                {/* Información de Envío */}
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <h3 className="font-semibold text-lg text-gray-700">Información de Envío</h3>
                    <p className="text-gray-600 mt-2">
                        <span className="font-medium">Nombre:</span> {order.shippingInfo?.name}
                    </p>
                    <p className="text-gray-600">
                        <span className="font-medium">Dirección:</span> {order.shippingInfo?.address}, {order.shippingInfo?.province}, {order.shippingInfo?.city}, {order.shippingInfo?.area}
                    </p>
                    <p className="text-gray-600">
                        <span className="font-medium">Teléfono:</span> {order.shippingInfo?.phone}
                    </p>
                    <p className="text-gray-600">
                        <span className="font-medium">Correo:</span> {order.shippingInfo?.post}
                    </p>
                </div>

                {/* Información de Pago */}
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <h3 className="font-semibold text-lg text-gray-700">Información de Pago</h3>
                    <p className="text-gray-600 mt-2">
                        <span className="font-medium">Estado del Pago:</span> {statusMap[order.payment_status]}
                    </p>
                    <p className="text-gray-600">
                        <span className="font-medium">Precio Total:</span> S/{order.price}
                    </p>
                </div>

                {/* Productos */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-semibold text-lg text-gray-700 mb-4">Productos</h3>
                    <div className="space-y-4">
                        {order.products?.map((product, index) => (
                            <div key={index} className="flex items-center gap-4 bg-white p-4 rounded-md shadow-sm">
                                <img
                                    src={product.images?.[0]}
                                    alt={product.name}
                                    className="w-20 h-20 object-cover rounded-md border"
                                />
                                <div>
                                    <h4 className="text-md font-semibold text-gray-800">{product.name}</h4>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Marca:</span> {product.brand}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Cantidad:</span> {product.quantity}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Precio Unitario:</span> ${product.price}
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
