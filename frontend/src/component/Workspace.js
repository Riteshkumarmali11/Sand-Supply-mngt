import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./DC.css";

const Workspace = () => {
    const [sales, setSales] = useState([]);
    const [purchase, setPurchase] = useState([]);
    const [error, setError] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const username= localStorage.getItem('username');

    useEffect(() => {
        fetchSales();
        fetchPurchase();
        const interval = setInterval(() => setCurrentTime(new Date()), 1000); // Update current time every second
        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

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

    const fetchPurchase = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/getPurchase`);
            const { success, data } = response.data;
            if (success) {
                const purchaseArray = Object.values(data);
                setPurchase(purchaseArray);
            } else {
                throw new Error('Backend response indicates failure');
            }
        } catch (error) {
            console.error('Error fetching purchase data:', error);
            setError(error.message);
        }
    };

    const getTotalAmount = (data) => {
        let total = 0;
        data.forEach(item => {
            item.products.forEach(product => {
                total += product.tamount;
            });
        });
        return total;
    };

    const calculateTotalAmountForDate = (data, currentDate) => {
        let total = 0;
        data.forEach(item => {
            if (new Date(item.date).toDateString() === currentDate.toDateString()) {
                item.products.forEach(product => {
                    total += product.tamount;
                });
            }
        });
        return total;
    };

    const getTotalAmountForDate = (data, currentDate) => {
        const totalAmount = calculateTotalAmountForDate(data, currentDate);
        return totalAmount;
    };


    return (
        <div className="container mt-28 h-screen p-4 md:p-8 w-full max-w-screen-100 bg-wheet-100 shadow-md" >
            <div>
                <div className="row mb-4 bg-orange-300 text-black" style={{ padding: "10px", borderRadius: "5px", justifyContent: "space-between", boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.2)", zIndex: '100'  }}>
                    <div style={{ flex: 1 }}>
                        <span>Welcome <span style={{fontSize:'20px', fontWeight:'bolder', color:'gray'}}>{username}</span></span>
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>{currentTime.toLocaleString()}</div>
                </div>
                {/* Total Sales and Total Purchase */}
                <div style={{fontSize:'20px', fontWeight:'bolder', textAlign:'center'}}>Total Sales and Purchase</div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ margin: "20px", boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.2)"}}>
                        <div className="p-7 bg-gold-100" style={{ width: "18rem", border: "none" }}>
                            <div className="card-body">
                                <h5 className="card-title text-black">Total Sales</h5>
                                <p className="card-text text-gray" style={{fontWeight:'bolder'}}>{getTotalAmount(sales)}</p>
                            </div>
                        </div>
                    </div>
                    <div style={{ margin: "20px", boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.2)"  }}>
                        <div className="p-7 bg-gold-100" style={{ width: "18rem", border: "none"  }}>
                            <div className="card-body">
                                <h5 className="card-title text-black">Total Purchase</h5>
                                <p className="card-text text-gray"  style={{fontWeight:'bolder'}}>{getTotalAmount(purchase)}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-10' style={{fontSize:'20px', fontWeight:'bolder', textAlign:'center'}}>Today's Sales and Purchase</div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ margin: "20px", boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.2)" }}>
                        <div className="p-7 bg-gold-100" style={{ width: "18rem", border: "none" }}>
                            <div className="card-body">
                                <h5 className="card-title text-black">Total Sales</h5>
                                <p className="card-text text-gray" style={{fontWeight:'bolder'}}>{getTotalAmountForDate(sales, new Date())}</p>
                            </div>
                        </div>
                    </div>
                    <div style={{ margin: "20px", boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.2)" }}>
                        <div className="p-7 bg-gold-100" style={{ width: "18rem", border: "none" }}>
                            <div className="card-body">
                                <h5 className="card-title text-black">Total Purchase</h5>
                                <p className="card-text text-gray"  style={{fontWeight:'bolder'}}>{getTotalAmountForDate(purchase, new Date())}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {error && <p>Error: {error}</p>}
            </div>
        </div>
    );
};

export default Workspace;
