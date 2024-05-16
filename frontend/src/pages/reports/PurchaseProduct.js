import React, { useEffect, useState } from 'react';
import Navbar from '../../component/Navbar';
import Layout from '../../component/Layout';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PurchaseProduct = () => {
    const [registration, setRegistration] = useState({});
    const { id } = useParams();
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        fetchData();
    }, [id]);

    useEffect(() => {
        // Recalculate total amount whenever registration data changes
        if (registration.products) {
            calculateTotalAmount();
        }
    }, [registration]);

    const fetchData = async () => {
        try {
            if (!id) return;

            const response = await axios.get(`http://localhost:5000/getPurchase/${id}`);
            const { success, data } = response.data;
            if (success) {
                setRegistration(data);
                console.log("fetch purchase products", data);
            } else {
                throw new Error('Backend response indicates failure');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const calculateTotalAmount = () => {
        let total = 0;
        registration.products.forEach(product => {
            total += parseFloat(product.tamount);
        });
        setTotalAmount(total);
    };

    return (
        <>
            <Navbar />
            <Layout>
                <table>
                    <thead className='bg-orange-100'>
                        <tr>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registration.products && registration.products.length > 0 ? (
                            registration.products
                                .filter(product => product.purchase_id === parseInt(id))
                                .map((product, index) => (
                                    <tr key={index}>
                                        <td>{product.product_name}</td>
                                        <td>{product.quantity}</td>
                                        <td>{product.price}</td>
                                        <td>{product.tamount}</td>
                                    </tr>
                                ))
                        ) : (
                            <tr>
                                <td colSpan="5">No products available</td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot style={{fontWeight:'bolder', padding:'10px'}}>
                        <tr>
                            <td colSpan="3">Total Amount</td>
                            <td>{totalAmount}</td>
                        </tr>
                    </tfoot>
                </table>
            </Layout>
        </>
    );
};

export default PurchaseProduct;
