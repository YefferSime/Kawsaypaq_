import React, { useEffect } from 'react'
import { BsCurrencyDollar } from 'react-icons/bs'
import { RiProductHuntLine } from 'react-icons/ri'
import { FaUsers } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import Chart from 'react-apexcharts'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import seller from '../../assets/seller.png'

import { get_admin_dashboard_index_data } from '../../store/Reducers/dashboardIndexReducer'

const AdminDashboard = () => {

    const { userInfo } = useSelector(state => state.auth)
    const {
        totalSale,
        totalOrder,
        totalProduct,
        totalSeller,
        recentOrders,
        recentMessage
    } = useSelector(state => state.dashboardIndex)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(get_admin_dashboard_index_data())
    }, [])

    const state = {
        series: [
            {
                name: "Ordenes",
                data: [34, 65, 34, 65, 34, 34, 34, 56, 23, 67, 23, 45]
            },
            {
                name: "Ingresos",
                data: [34, 32, 45, 32, 34, 34, 43, 56, 65, 67, 45, 78]
            },
            {
                name: "Vendedores",
                data: [78, 32, 34, 54, 65, 34, 54, 21, 54, 43, 45, 43]
            }
        ],
        options: {
            colors: ['#FF5733', '#33FF57', '#3357FF'], // Colores variados
            plotOptions: {
                radius: 30
            },
            chart: {
                background: 'transparent',
                foreColor: '#000000'
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                curve: ['smooth', 'straight', 'stepline'],
                lineCap: 'butt',
                colors: '#f0f0f0',
                width: .5,
                dashArray: 0
            },
            xaxis: {
                categories: ['Ene', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
            },
            legend: {
                position: 'top'
            },
            responsive: [
                {
                    breakpoint: 565,
                    yaxis: {
                        categories: ['Ene', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
                    },
                    options: {
                        plotOptions: {
                            bar: {
                                horizontal: true
                            }
                        },
                        chart: {
                            height: '550px'
                        }
                    }
                }
            ]
        }
    }


    return (
        <div className='px-2 md:px-7 py-5'>
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7'>
                <div className='flex justify-between items-center p-5 bg-[#FFFFFF] rounded-md gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#000000]'>
                        <h2 className='text-3xl font-bold'>S/{totalSale}</h2>
                        <span className='text-md font-medium'>Ventas Totales</span>
                    </div>
                    <div className='w-[46px] h-[47px] rounded-full bg-[#2E7D32] flex justify-center items-center text-xl'>
                        <BsCurrencyDollar className='text-white shadow-lg' />
                    </div>
                </div>
                <div className='flex justify-between items-center p-5 bg-[#FFFFFF] rounded-md gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#000000]'>
                        <h2 className='text-3xl font-bold'>{totalProduct}</h2>
                        <span className='text-md font-medium'>Productos</span>
                    </div>
                    <div className='w-[46px] h-[47px] rounded-full bg-[#66BB6A] flex justify-center items-center text-xl'>
                        <RiProductHuntLine className='text-white shadow-lg' />
                    </div>
                </div>
                <div className='flex justify-between items-center p-5 bg-[#FFFFFF] rounded-md gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#000000]'>
                        <h2 className='text-3xl font-bold'>{totalSeller}</h2>
                        <span className='text-md font-medium'>Vendedores</span>
                    </div>
                    <div className='w-[46px] h-[47px] rounded-full bg-[#00CFE8] flex justify-center items-center text-xl'>
                        <FaUsers className='text-white shadow-lg' />
                    </div>
                </div>
                <div className='flex justify-between items-center p-5 bg-[#FFFFFF] rounded-md gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#000000]'>
                        <h2 className='text-3xl font-bold'>{totalOrder}</h2>
                        <span className='text-md font-medium'>Ordenes</span>
                    </div>
                    <div className='w-[46px] h-[47px] rounded-full bg-[#7367F0] flex justify-center items-center text-xl'>
                        <AiOutlineShoppingCart className='text-white shadow-lg' />
                    </div>
                </div>
            </div>

            <div className='w-full flex flex-wrap mt-7'>
                <div className='w-full lg:w-7/12 lg:pr-3'>
                    <div className='w-full bg-[#FFFFFF] p-4 rounded-md'>
                        <Chart options={state.options} series={state.series} type='bar' height={350} />
                    </div>
                </div>
                <div className='w-full lg:w-5/12 lg:pl-4 mt-6 lg:mt-0'>
                    <div className='w-full bg-[#FFFFFF] p-4 rounded-md text-[#E0E0E0]'>
                        <div className='flex justify-between items-center'>
                            <h2 className='font-semibold text-lg text-[#000000] pb-3'>Mensaje de vendedor más reciente</h2>
                            <Link className='font-semibold text-sm text-[#66BB6A]'>Ver todo</Link>
                        </div>
                        <div className='flex flex-col gap-2 pt-6 text-[#E0E0E0]'>
                            <ol className='relative border-1 border-[#1B5E20] ml-4'>
                                {recentMessage.map((m, i) => (
                                    <li key={i} className='mb-3 ml-6'>
                                        <div className='flex absolute -left-5 shadow-lg justify-center items-center w-10 h-10 p-[6px] bg-[#2E7D32] rounded-full z-10'>
                                            <img className='w-full rounded-full h-full shadow-lg' src={m.senderId === userInfo._id ? userInfo.image : seller} alt="" />
                                        </div>
                                        <div className='p-3 bg-[#A5D6A7] rounded-lg border border-[#1B5E20] shadow-sm'>
                                            <div className='flex justify-between items-center mb-2'>
                                                <Link className='text-md font-normal text-[#1B5E20]'>{m.senderName}</Link>
                                                <time className='mb-1 text-sm font-normal text-[#4CAF50]'>{moment(m.createdAt).startOf('hour').fromNow()}</time>
                                            </div>
                                            <div className='p-2 text-xs font-normal bg-[#81C784] text-[#1B5E20] rounded-lg border border-[#1B5E20]'>
                                                {m.message}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>


                    </div>
                </div>
            </div>

            <div className='w-full p-4 bg-[#FFFFFF] rounded-md mt-6'>
                <div className='flex justify-between items-center'>
                    <h2 className='font-semibold text-lg text-[#000000] pb-3'>Ordenes recientes</h2>
                    <Link className='font-semibold text-sm text-[#66BB6A]'>Ver todo</Link>
                </div>
                <div className='relative overflow-x-auto'>
                    <table className='w-full text-sm text-left text-[#000000]'>
                        <thead className='text-sm text-[#000000] uppercase border-b border-slate-700'>
                            <tr>
                                <th scope='col' className='px-4 py-3'>N°</th>
                                <th scope='col' className='px-4 py-3'>Tienda</th>
                                <th scope='col' className='px-4 py-3'>Vendedor</th>
                                <th scope='col' className='px-4 py-3'>Total</th>
                                <th scope='col' className='px-4 py-3'>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order, index) => (
                                <tr key={index} className="border-b border-slate-600">
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">{order.shopName || 'N/A'}</td>
                                    <td className="px-4 py-2">{order.shippingInfo?.name || 'N/A'}</td>
                                    <td className="px-4 py-2">S/{order.price}</td>
                                    <td className="px-4 py-2">{moment(order.date).format('DD/MM/YYYY')}</td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
