import React, { useEffect, useState } from 'react';
import Layout from '../../component/Layout';
import Navbar from '../../component/Navbar';
import axios from 'axios';


const DriverReport = () => {
    const [error, setError] = useState('');
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState('');
    const [invoiceData, setInvoiceData] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getImageUpload');
            if (Array.isArray(response.data.data)) {
                setDrivers(response.data.data);
            } else {
                setError('Drivers data is not in the expected format.');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDriverChange = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/getImageUpload`);
            setInvoiceData(response.data.data);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    return (
        <>
            <Navbar />
            <Layout>
                <div>
                    {error && <div>Error: {error}</div>}
                    <select className='mb-4 bg-gold-100' value={selectedDriver}  style={{width:'50%', height:'55px'}} onChange={(e) => {
                        setSelectedDriver(e.target.value);
                        handleDriverChange(e.target.value);
                    }}>
                        <option value="">Select a driver</option>
                        {drivers.map((driver) => (
                            <option key={driver.id} value={driver.id}>{driver.drivername}</option>
                        ))}
                    </select>
                    {invoiceData.length > 0 && (
                        <div>
                            <table className="styled-table">
                                <thead className='bg-gray-300'>
                                    <tr>
                                        <th>Invoice Number</th>
                                        <th>Date</th>
                                        <th>Load Image</th>
                                        <th>UnLoad Image</th>
                                        <th>Other </th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoiceData.map((data) => (
                                        <tr key={data.id}>
                                            <td>{data.invoiceno}</td>
                                            <td>{data.submissionDate}</td>
                                            <td><button onClick={() => handleImageClick(data.image1)}>View</button></td>
                                            <td><button onClick={() => handleImageClick(data.image2)}>View</button></td>
                                            <td><button onClick={() => handleImageClick(data.image3)}>View</button></td>
                                            <td>{data.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </Layout>
            {selectedImage && (
                <div className="image-preview">
                    <img src={selectedImage} alt="Selected Image"  style={{height:'300px', width:'300px', textAlign:'center'}}/>
                    <button onClick={() => setSelectedImage('')}>Close</button>
                </div>
            )}
        </>
    );
};

export default DriverReport;
