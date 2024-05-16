import React, { useState } from 'react';
import Layout from '../../component/Layout';
import BuilderAvailable from './BuilderAvailable';
import BuildernonAvailable from './BuildernonAvailable';
import SalesmanNavbar1 from '../../component/SalesmanNavbar1';

const SalesQuotation1 = () => {
    const [selectedOption, setSelectedOption] = useState('available');

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    return (
        <>
            <SalesmanNavbar1 />
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
                {selectedOption === 'available' ? <BuilderAvailable /> : <BuildernonAvailable />}
            </Layout>
        </>
    );
};

export default SalesQuotation1;
