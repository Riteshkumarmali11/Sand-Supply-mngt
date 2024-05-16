import React, { useEffect, useState } from 'react'

const SalesmanWorkspace = () => {

  const username=localStorage.getItem('username');

    const customStyles = {
        height: '90%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundSize: 'cover',
    };

    return (
        <div className="container mt-28 h-screen p-4 md:p-8 w-full max-w-screen-100 bg-wheet-500 shadow-md" style={customStyles}>
            <div><h1 style={{ fontSize: '30px' }}>Welcome <span style={{ color: 'gray', fontWeight: 'bold' }}>{username}</span></h1></div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "30px" }} className='mt-40 mb-40'>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "30px" }}>

                    <div>
                        <img src='/logo1.jpg' alt='' style={{ height: '6rem', width: '8rem' }} />
                    </div>
                    <div >
                        <div >
                            <strong style={{ color: 'white', fontSize: '40px', fontFamily: 'cursive' }}>Cane Management System </strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SalesmanWorkspace;
