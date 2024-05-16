import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { FaTimes, FaCheckCircle, FaClock } from 'react-icons/fa';
//import { ToastContainer, toast } from 'react-toastify';

const DriverWorkspace = () => {
    const [salesData, setSalesData] = useState([]);
    const [images, setImages] = useState([null, null, null]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const username = localStorage.getItem('username');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedOwnerTransactions, setSelectedOwnerTransactions] = useState({});
    const [secondImageDisabled, setSecondImageDisabled] = useState(true);
    const [thirdImageDisabled, setThirdImageDisabled] = useState(true);
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        fetchData();
        fetchCustomers();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/getSales`);
            const { success, data } = response.data;
            if (success) {
                const filteredData = data.filter(entry => entry.drivername === username);
                const groupedData = groupDataByDate(filteredData);
                setSalesData(groupedData);
            } else {
                throw new Error('Backend response indicates failure');
            }
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getImageUpload');
            const customersData = response.data.data;

            // Group customers by invoiceno
            const customersByInvoice = customersData.reduce((acc, item) => {
                const { invoiceno, status } = item;
                if (!acc[invoiceno]) {
                    acc[invoiceno] = [];
                }
                acc[invoiceno].push(status);
                return acc;
            }, {});

            setCustomers(customersByInvoice); // Store the grouped customer data
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };


    const groupDataByDate = (data) => {
        const groupedData = {};
        data.forEach((entry) => {
            const { date, sitename, siteaddress, mobile, drivername, latitude, longitude, invoiceno, id } = entry;
            if (!groupedData[date]) {
                groupedData[date] = [];
            }
            groupedData[date].push({ sitename, siteaddress, mobile, drivername, latitude, longitude, invoiceno, id, status: 'Pending' });
        });
        return groupedData;
    };

    const renderSalesData = () => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error: {error.message}</p>;
        if (Object.keys(salesData).length === 0) return <p>No data available</p>;

        const sortedDates = Object.keys(salesData).sort((a, b) => new Date(b) - new Date(a));

        return sortedDates.map((date) => (
            <div key={date} className="mt-4 text-center">
                <h2><strong>{date}</strong></h2>
                <div className="row justify-content-center">
                    {salesData[date].map((sale, index) => {
                        const statuses = customers[sale.invoiceno] || [];
                        const isAllDone = statuses.every((status) => status === 'Done');

                        return (
                            <div key={index} className="col-md-4 mb-4">
                                {/* Use flex layout to create two columns */}
                                <div className="bg-white p-4 shadow-md" style={{ display: 'flex' }}>
                                    {/* Left column: data content */}
                                    <div style={{ flex: 1, textAlign: 'left' }}>
                                        <p><strong>Site Name:</strong> {sale.sitename}</p>
                                        <p><strong>Site Address:</strong> {sale.siteaddress}</p>
                                        <p><strong>Mobile:</strong> {sale.mobile}</p>

                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <button style={{ color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }} 
                                            onClick={() => handleViewDC(sale.id)}>View DC</button>
                                            <button onClick={() => handleMap(sale)}>Map</button>
                                            <button onClick={() => handleUploadImages(sale)}>Upload Images</button>
                                        </div>
                                    </div>

                                    {/* Right column: status icon */}
                                    <div style={{ flex: '0 0 40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {isAllDone ? (
                                            <FaCheckCircle style={{ color: 'green', fontSize:'2rem' }} title="Done" />
                                        ) : (
                                            <FaClock style={{ color: 'orange', fontSize:'2rem' }} title="Pending" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        ));
    };

    const handleFileChange = (e, index) => {
        const file = e.target.files[0];
        const updatedImages = [...images];
        updatedImages[index] = file;
        setImages(updatedImages);

        // Enable the input for the next image if the current image is uploaded
        if (index === 0 && file) {
            setSecondImageDisabled(false);
        } else if (index === 1 && file) {
            setThirdImageDisabled(false);
            // Update the status to "done" when the second image is chosen
            setSelectedOwnerTransactions(prevState => ({
                ...prevState,
                status: "Done"
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create FormData object to append form data
            const formData = new FormData();
            formData.append('invoiceno', selectedOwnerTransactions.invoiceno);
            formData.append('status', selectedOwnerTransactions.status);
            formData.append('drivername', username); // Add drivername from localStorage

            // Add current date
            const currentDate = new Date().toISOString().slice(0, 10);
            formData.append('submissionDate', currentDate);

            // Append images to FormData with their respective field names
            if (images[0]) {
                formData.append('image1', images[0]);
            }
            if (images[1]) {
                formData.append('image2', images[1]);
            }
            if (images[2]) {
                formData.append('image3', images[2]);
            }

            // Submit FormData using axios or any other HTTP client
            const response = await axios.post('http://localhost:5000/imageupload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Handle response
            console.log('Images uploaded successfully:', response.data);

            // Update the status in salesData
            const updatedSalesData = { ...salesData };
            Object.keys(updatedSalesData).forEach(date => {
                updatedSalesData[date] = updatedSalesData[date].map(sale => {
                    if (sale.invoiceno === selectedOwnerTransactions.invoiceno) {
                        return { ...sale, status: 'Done' }; // Update status to 'Done'
                    }
                    return sale;
                });
            });
            setSalesData(updatedSalesData); // Update local state

            // Save updatedSalesData to local storage
            localStorage.setItem('salesData', JSON.stringify(updatedSalesData));

            // Store the identifier of the hidden card in local storage
            const hiddenCards = JSON.parse(localStorage.getItem('hiddenCards')) || [];
            hiddenCards.push(selectedOwnerTransactions.id);
            localStorage.setItem('hiddenCards', JSON.stringify(hiddenCards));

            // Close modal and reset state variables
            setModalIsOpen(false);
            setImages([null, null, null]);
        } catch (error) {
            console.error('Error uploading images:', error);
            // Handle error
        }
    };

    const handleViewDC = (id) => {
        // Handle View DC button click
        window.location.href = `/dchallan/${id}`;
    };

    const handleMap = (sale) => {
        window.open(generateGoogleMapLink(sale.latitude, sale.longitude), '_blank');
    };

    const handleClearImages = () => {
        setImages([null, null, null]);
    };

    const handleSubmitImages = () => {
        // Here you can handle the submission of images
    };

    const handleUploadImages = (sale) => {
        if (sale.status === 'Done') {
            // Do nothing if status is "Done"
            return;
        }
        setModalIsOpen(true);
        setSelectedOwnerTransactions(sale); // Ensure sale is not null before setting it
    };

    const generateGoogleMapLink = (latitude, longitude) => {
        return `https://www.google.com/maps?q=${latitude},${longitude}`;
    };

    return (
        <>
            <div className="container mt-28 h-screen p-4 md:p-8 w-full max-w-screen-100 bg-orange-50 shadow-md">
                <div>
                    <h1 style={{ fontSize: '30px', textAlign: 'center' }}>Welcome <span style={{ color: 'gray', fontWeight: 'bolder' }}>{username}</span></h1>
                </div>
                {renderSalesData()}
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Transaction Modal"
                style={{
                    content: {
                        width: '60%',
                        height: '60%',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        border: '4px solid green', // Add green color border
                        borderRadius: '8px',
                    }
                }}
            >
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h2 style={{ textAlign: 'center' }}><span style={{ fontSize: '20px' }}>Upload Images For </span><span style={{ fontSize: '21px', fontWeight: 'bolder', color: 'gray' }}>{selectedOwnerTransactions.sitename} </span></h2>
                        <button style={{ backgroundColor: 'gray', border: 'none', cursor: 'pointer', color: 'white' }} onClick={() => setModalIsOpen(false)}>
                            <FaTimes />
                        </button>
                    </div>
                    <div>
                        <div className='form-row'>
                            <div className='form-group'>
                                <input type='text' name='invoiceno' value={selectedOwnerTransactions.invoiceno} readOnly />
                            </div>
                            <div className='form-group'>
                                <input type='text' name='status' value={selectedOwnerTransactions.status} readOnly />
                            </div>
                            <div className='form-group'></div>
                        </div>
                        <div className='container'>
                            <div className='row justify-content-center'>
                                <div className='col-md-2'>
                                    <div className='form-row'>
                                        <button className='bg-blue-200 mr-4 text-black' onClick={handleClearImages}>Clear</button>
                                        <button className='bg-green-400 text-black' onClick={handleSubmitImages}>Submit</button>
                                    </div>
                                </div>
                            </div>
                            <div className='form-row'>
                                <div className='form-group'>
                                    <label htmlFor="image1"><strong>Load Material</strong></label>
                                    <input type='file' id="image1" name='image1' onChange={(e) => handleFileChange(e, 0)} />
                                    {images[0] && <img src={URL.createObjectURL(images[0])} alt="Uploaded Image" />}
                                </div>
                                <div className='form-group'>
                                    <label htmlFor="image2"><strong>Unload Material</strong></label>
                                    <input type='file' id="image2" name='image2' onChange={(e) => handleFileChange(e, 1)} disabled={secondImageDisabled} />
                                    {images[1] && <img src={URL.createObjectURL(images[1])} alt="Uploaded Image" />}
                                </div>
                                <div className='form-group'>
                                    <label htmlFor="image3"><strong>Other</strong></label>
                                    <input type='file' id="image3" name='image3' onChange={(e) => handleFileChange(e, 2)} disabled={thirdImageDisabled} />
                                    {images[2] && <img src={URL.createObjectURL(images[2])} alt="Uploaded Image" />}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default DriverWorkspace;

