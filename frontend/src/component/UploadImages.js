import React from 'react';

const UploadImages = ({ isOpen, onClose, sale }) => {
    return (
        <div className={`modal ${isOpen ? 'block' : 'hidden'} fixed inset-0 bg-gray-500 bg-opacity-75 z-50 overflow-y-auto`}>
            <div className="modal-content bg-white mx-auto mt-20 p-8 rounded shadow-lg w-1/2">
                <div className="modal-header">
                    <h2 className="text-xl font-bold">Upload Images for Invoice: {sale.invoiceno}</h2>
                    <button className="modal-close" onClick={onClose}>X</button>
                </div>
                <div className="modal-body">
                    {/* Your upload images form can go here */}
                    {/* Example: <input type="file" /> */}
                </div>
            </div>
        </div>
    );
};

export default UploadImages;
