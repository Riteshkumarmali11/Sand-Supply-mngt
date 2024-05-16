import React, { useState } from 'react';
import Navbar from '../../component/Navbar';
import Layout from '../../component/Layout';
import SalesAvailable from './SalesAvailable';
import SalesnonAvailable from './SalesnonAvailable';

const SalesQuotation = () => {
    const [selectedOption, setSelectedOption] = useState('available');

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    return (
        <>
            <Navbar />
            <Layout>
                <div style={{ display: 'flex', flexDirection: 'row', fontWeight: 'bold', fontSize: '25px', color:'black' }}>
                    <button className='btn btn-primary'
                       
                        onClick={() => handleOptionChange('available')}
                    >
                        Builder Available
                    </button>
                    <button className='ml-6'
                        style={{ backgroundColor: selectedOption === 'nonavailable' ? 'lightblue':'ActiveBorder' }}
                        onClick={() => handleOptionChange('nonavailable')}
                    >
                        Builder Non-Available
                    </button>
                </div>
                {selectedOption === 'available' ? <SalesAvailable /> : <SalesnonAvailable />}
            </Layout>
        </>
    );
};

export default SalesQuotation;
