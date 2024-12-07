import React from 'react';

const Deactive = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm text-center">
                <h2 className="text-2xl font-bold mb-4">Usted está desactivado</h2>
                <p className="text-gray-700">Acerquese a la municipalidad para ser activado o envie un mensaje al Administrador.</p>
            </div>
        </div>
    );
}

export default Deactive;


