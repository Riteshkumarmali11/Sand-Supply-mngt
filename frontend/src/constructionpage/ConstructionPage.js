// src/pages/ConstructionPage.js
import React from 'react';
import './Construction.css';
import Navbar from '../component/Navbar';

const ConstructionPage = () => {

    return (
        <>
        <Navbar/>
            <div className="construction-page">
                <h1 style={{ textAlign: 'center', fontSize: '35px', fontFamily: 'cursive', fontStyle: 'italic', marginBottom: '1rem', marginTop:'10rem' }}><strong>Under Construction</strong></h1>
                <img src="dummy_image.jpg" alt="Responsive" className="vert-move rounded mx-auto d-block main" />
            </div>
        </>
    );
};

export default ConstructionPage;
