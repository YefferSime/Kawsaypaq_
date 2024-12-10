import React from 'react'

const Search = ({ setParPage, setSearchValue, searchValue }) => {
    return (
        <div className='flex justify-between items-center '>
            <select onChange={(e) => setParPage(parseInt(e.target.value))} className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#2E7D32] border  rounded-md text-[#ffffff]'>
                <option value="5">5</option>
                <option value="15">15</option>
                <option value="25">25</option>
            </select>
            <input onChange={(e) => setSearchValue(e.target.value)} value={searchValue} className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#2E7D32] border rounded-md text-[#ffffff]' type="text" placeholder='Buscar...' />
        </div>
    )
}

export default Search