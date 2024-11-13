import React, { forwardRef, useEffect, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import toast from 'react-hot-toast';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { get_active_sellers } from '../../store/Reducers/sellerReducer';
import { get_payment_request, confirm_payment_request, messageClear } from '../../store/Reducers/PaymentReducer';

function handleOnWheel({ deltaY }) {
  console.log('handleOnWheel', deltaY);
}

const outerElementType = forwardRef((props, ref) => (
  <div ref={ref} onWheel={handleOnWheel} {...props} />
));

const PaymentRequest = () => {
  const dispatch = useDispatch();
  const { sellers } = useSelector(state => state.seller);
  const { successMessage, errorMessage, loader, pendingWithdrows } = useSelector(state => state.payment);

  useEffect(() => {
    dispatch(get_payment_request());
    dispatch(get_active_sellers({ parPage: 100, page: 1, searchValue: '' })); // Obtener todos los sellers activos
  }, [dispatch]);

  // Crear un mapeo de sellerId a nombre
  const sellerMap = sellers.reduce((map, seller) => {
    map[seller._id] = seller.name;
    return map;
  }, {});

  const [paymentId, setPaymentId] = useState('');
  const confirm_request = (id) => {
    setPaymentId(id);
    dispatch(confirm_payment_request(id));
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
  }, [errorMessage, successMessage, dispatch]);

  const Row = ({ index, style }) => {
    const payment = pendingWithdrows[index];
    const sellerName = sellerMap[payment?.sellerId] || 'N/A'; // Obtiene el nombre del vendedor desde el mapeo

    return (
      <div style={style} className='flex text-sm'>
        <div className='w-[20%] p-2 whitespace-nowrap'>{index + 1}</div>
        <div className='w-[20%] p-2 whitespace-nowrap'>{sellerName}</div> {/* Muestra el nombre del vendedor */}
        <div className='w-[20%] p-2 whitespace-nowrap'>S/{payment?.amount}</div>
        <div className='w-[20%] p-2 whitespace-nowrap'>
          <span className='py-[1px] px-[5px] bg-slate-700 text-blue-500 rounded-md text-xs'>{payment?.status}</span>
        </div>
        <div className='w-[20%] p-2 whitespace-nowrap'>{moment(payment?.createdAt).format('LL')}</div>
        <div className='w-[20%] p-2 whitespace-nowrap'>
          <button disabled={loader} onClick={() => confirm_request(payment._id)} className='bg-indigo-500 shadow-lg hover:shadow-indigo-500/50 px-3 py-[2px] cursor-pointer text-white rounded-sm text-sm'>
            {(loader && paymentId === payment._id) ? 'Cargando..' : 'Confirmado'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className='px-2 lg:px-7 pt-5'>
      <div className='w-full p-4 bg-[#FFFFFF] rounded-md text-[#000000]'>
        <h2 className='text-xl font-medium pb-5'>Solicitud de Retiro</h2>
        <div className='w-full'>
          <div className='w-full overflow-x-auto'>
            <div className='flex bg-[#1C1C1] uppercase text-xs min-w-[340px]'>
              <div className='w-[20%] p-2'>N°</div>
              <div className='w-[20%] p-2'>Nombre</div> {/* Cambiado a "Nombre" */}
              <div className='w-[20%] p-2'>Monto</div>
              <div className='w-[20%] p-2'>Estado</div>
              <div className='w-[20%] p-2'>Fecha</div>
              <div className='w-[20%] p-2'>Acción</div>
            </div>
            {pendingWithdrows.length > 0 ? (
              <List
                style={{ minWidth: '340px', overflowX: 'hidden' }}
                className='List'
                height={350}
                itemCount={pendingWithdrows.length}
                itemSize={35}
                outerElementType={outerElementType}
              >
                {Row}
              </List>
            ) : (
              <p>No hay solicitudes de retiro disponibles.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentRequest;
