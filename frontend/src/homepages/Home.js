import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
    const [sales, setSales] = useState([]);
    const [product, setProduct1] = useState([]);
    const [error, setError] = useState(null);
    const [totalSalesCount, setTotalSalesCount] = useState(0);
    const [typeofsandCounts, setTypeofsandCounts] = useState(0);

    useEffect(() => {
        fetchSales();
        fetchProduct();
    }, []);

    useEffect(() => {
        // Calculate total sales count based on the number of rows
        const total = sales.length;
        setTotalSalesCount(total);
    }, [sales]);

    useEffect(() => {
        // Calculate total typeofsand
        const counts = product.reduce((acc, item) => {
            acc[item.typeofsand] = (acc[item.typeofsand] || 0) + 1;
            return acc;
        }, {});
        setTypeofsandCounts(counts);
    }, [product]);

    const fetchProduct = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getMaterialRegistration');
            setProduct1(response.data.data);
            console.log("Material", response);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchSales = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/getSales`);
            const { success, data } = response.data;
            if (success) {
                const salesArray = Object.values(data);
                setSales(salesArray);
            } else {
                throw new Error('Backend response indicates failure');
            }
        } catch (error) {
            console.error('Error fetching sales data:', error);
            setError(error.message);
        }

    };
    const totalSandTypesCount = Object.values(typeofsandCounts).reduce((acc, count) => acc + count, 0);

    return (
        <div className='mb-10'>
            <div id="section-1" style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)' }}>
                <div className="content-slider">
                    <input type="radio" id="banner1" className="sec-1-input" name="banner" checked />

                    <div className="slider">
                        <div id="top-banner-1" className="banner" >
                            <div className="banner-inner-wrapper header-text">
                                <div className="main-caption">
                                    <h1 className='text-black'>Welcome To Supply Buliding Material</h1>
                                </div>
                                <div className="container" style={{opacity:'0.8'}}>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="more-info">
                                                <div className="row">
                                                    <div className="col-lg-3 col-sm-4 col-2">
                                                        <i className="fa fa-user"></i>
                                                        <h4><span style={{color:'red', fontWeight:'bolder'}}>Happy Builders</span><br></br>{totalSalesCount}</h4>
                                                    </div>
                                                    <div className="col-lg-3 col-sm-6 col-6">
                                                        <i className="fa fa-globe"></i>
                                                        <h4>
                                                            <span style={{color:'red',  fontWeight:'bolder'}}>Sand Types</span><br></br>{totalSandTypesCount}
                                                           
                                                        </h4>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
