import React, { useEffect, useState } from 'react';
import Navbar from '../../component/Navbar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import '../registrations/registration.css';
import Layout from '../../component/Layout';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import { FaFilePdf } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import { FaEdit, FaTrash } from 'react-icons/fa';
import SweetAlert from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const Sales = () => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const [formData, setFormData] = useState({
        invoiceno: '',
        date: currentDate,
        buildername: '',
        siteaddress: '',
        mobile: '',
        gstno: '',
        sitename: '',
        vehiclenumber: '',
        drivername: '',
        latitude: '',
        longitude: '',
        openingbal: '',
        products: []  //Array for Products mapping
    });

    const [product1, setProduct1] = useState([]);
    const [gstPercentage, setGstPercentage] = useState(5);
    const [file, setFile] = useState(null);
    const [salesman, setSalesman] = useState([]);
    const [supply, setSupply] = useState([]);
    const [vehicle, setVehicle] = useState([]);
    const [driver, setDriver] = useState([]);
    const [site, setSite] = useState([]);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [registrations, setRegistrations] = useState([]);
    const [registrations1, setRegistrations1] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [currentInvoiceNumber, setCurrentInvoiceNumber] = useState(1);


    useEffect(() => {
        fetchData();
        fetchSales();
        fetchSalesman();
        fetchProduct();
        fetchBuilder();
        fetchVehicle();
        fetchDriver();
        // generateInvoiceNumber(currentInvoiceNumber); 
    }, []);

    // const generateInvoiceNumber = (currentNumber) => {
    //     const month = currentDate.split('-')[1];
    //     const year = currentDate.split('-')[0].slice(2);
    //     const formattedMonth = month.length === 1 ? `0${month}` : month;
    //     const nextNumber = currentNumber.toString().padStart(3, '0');
    //     const invoiceNumber = `MR${year}${formattedMonth}/${nextNumber}`;
    //     setFormData(prevState => ({
    //         ...prevState,
    //         invoiceno: invoiceNumber
    //     }));
    // };

    const handleEdit = (registration) => {
        setFormData(registration);
        setModalIsOpen(true);
        setSelectedRegistration(registration);
    };


    const handleAddProductField = () => {
        const newProductField = {
            product_name: '',
            hsncode: '',
            gst: '',
            price: '',
            quantity: '',
            tamount: '',
            gstAmount: '',
            totalAmountWithGST: ''
        };

        setFormData(prevState => ({
            ...prevState,
            products: [...prevState.products, newProductField]
        }));
    };


    const fetchBuilder = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getSupplyRegistration');
            setSupply(response.data.data);
            console.log("Builder", response);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchDriver = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getDriverRegistrations');
            setDriver(response.data.data);
            console.log("Driver", response);
        } catch (error) {
            setError(error.message);
        }
    };


    const fetchVehicle = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getVehicleRegistration');
            setVehicle(response.data.data);
            console.log("Vehicle", response);
        } catch (error) {
            setError(error.message);
        }
    };


    const fetchSalesman = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getSalesmanRegistration');
            setSalesman(response.data.data);
            console.log("Salesman", response);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchProduct = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getMaterialRegistration');
            setProduct1(response.data.data);
            console.log("Material", response);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/getBuilderAvailable`);
            const { success, data } = response.data;
            if (success) {
                // Convert the object of objects into an array of objects
                const registrationsArray = Object.values(data);
                setRegistrations(registrationsArray);
            } else {
                throw new Error('Backend response indicates failure');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchSales = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/getSales`);
            const { success, data } = response.data;
            if (success) {
                // Convert the object of objects into an array of objects
                const registrationsArray = Object.values(data);
                setRegistrations1(registrationsArray);
            } else {
                throw new Error('Backend response indicates failure');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataWithLocation = { ...formData, latitude: formData.latitude, longitude: formData.longitude };
            const response = await axios.post(`http://localhost:5000/salesRegistration`, {
                ...formDataWithLocation,
                products: JSON.stringify(formData.products) // Convert products array to JSON string
            }, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                setCurrentInvoiceNumber(prev => prev + 1);
                // Clear form fields upon successful submission
                setFormData({
                    invoiceno: '',
                    date: '',
                    buildername: '',
                    sitename: '',
                    siteaddress: '',
                    mobile: '',
                    gstno: '',
                    vehiclenumber: '',
                    drivername: '',
                    latitude: '',
                    longitude: '',
                    openingbal: '',
                    products: []
                });
                alert('Registration Successful');
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('All Fields Required!');
        }
    };

    const handleProductNameChange = async (e, index) => {
        const { value } = e.target;
        const updatedProducts = [...formData.products];
        updatedProducts[index] = {
            ...updatedProducts[index],
            product_name: value
        };

        try {
            // Fetch material details based on selected product name
            const response = await axios.get(`http://localhost:5000/getMaterialDetails/${value}`);
            const { success, data } = response.data;

            if (success) {
                const { hsncode, gst } = data;
                console.log('getMaterialDetails', response.data);
                updatedProducts[index] = {
                    ...updatedProducts[index],
                    hsncode: hsncode,
                    gst: gst
                };

                setFormData(prevState => ({
                    ...prevState,
                    products: updatedProducts
                }));
            } else {
                throw new Error('Failed to fetch material details');
            }
        } catch (error) {
            console.error('Error fetching material details:', error);
            // Handle error if necessary
        }
    };


    const handleChange = async (e, index) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        const updatedProducts = [...formData.products];
        //updatedProducts[index][name] = value;

        // Ensure the products array is initialized for the specific index
        if (!updatedProducts[index]) {
            updatedProducts[index] = {
                product_name: '',
                hsncode: '',
                gst: '',
                price: '',
                quantity: '',
                tamount: '',
                gstAmount: '',
                totalAmountWithGST: ''
            };
        }

        if (name === 'product_name' || name === 'price' || name === 'quantity') {
            // Update the product_name, price, or quantity fields
            updatedProducts[index][name] = value;
        } else {
            // Update other fields directly in the formData state
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }

        const quantity = parseFloat(updatedProducts[index].quantity);
        const price = parseFloat(updatedProducts[index].price);

        // Check if both price and quantity are valid numbers
        if (!isNaN(quantity) && !isNaN(price)) {
            const totalAmount = quantity * price;
            const gstAmount = (totalAmount * gstPercentage) / 100;
            const totalAmountWithGST = totalAmount + gstAmount;

            updatedProducts[index].tamount = totalAmount.toFixed(2);
            updatedProducts[index].gstAmount = gstAmount.toFixed(2);
            updatedProducts[index].totalAmountWithGST = totalAmountWithGST.toFixed(2);
        }

        setFormData(prevState => ({
            ...prevState,
            products: updatedProducts
        }));

        if (name === 'quantity' || name === 'price') {
            const quantity = parseFloat(formData.products[index].quantity);
            const price = parseFloat(formData.products[index].price);
            const totalAmount = quantity * price;
            const gstAmount = (totalAmount * gstPercentage) / 100;
            const totalAmountWithGST = totalAmount + gstAmount;

            setFormData(prevState => ({
                ...prevState,
                products: prevState.products.map((product, idx) => idx === index ? {
                    ...product,
                    tamount: totalAmount.toFixed(2), // Ensure two decimal places
                    gstAmount: gstAmount.toFixed(2),
                    totalAmountWithGST: totalAmountWithGST.toFixed(2)
                } : product)
            }));
        }

        // If supervisor name is changed, update supervisor mobile
        if (name === 'supervisorname' && salesman.length > 0) {
            const selectedSupervisor = salesman.find((s) => s.sname === value);
            if (selectedSupervisor) {
                setFormData({
                    ...formData,
                    supervisorname: selectedSupervisor.sname,
                    supervisormobile: selectedSupervisor.mobile,
                });
            } else {
                setFormData({
                    ...formData,
                    supervisorname: '',
                    supervisormobile: '',
                });
            }
        }

        updatedProducts[index][name] = value;

        if (name === 'product_name') {
            handleProductNameChange(e, index);
        } else {
            // Handle other form field changes
            const updatedProducts = [...formData.products];
            updatedProducts[index] = {
                ...updatedProducts[index],
                [name]: value
            };

            setFormData(prevState => ({
                ...prevState,
                products: updatedProducts
            }));
        }

        if (name === 'vehiclenumber') {
            const selectedProduct = vehicle.find((p) => p.vehicleno === value);
            if (selectedProduct) {
                setFormData({
                    ...formData,
                    vehiclenumber: selectedProduct.vehicleno,
                    invoiceno: currentInvoiceNumber
                });
            } else {
                setFormData({
                    ...formData,
                    vehiclenumber: '',
                    invoiceno: currentInvoiceNumber
                });
            }
        }


        if (name === 'quantity') {
            const quantity = parseFloat(value);
            const totalAmount = quantity * parseFloat(formData.price);

            setFormData(prevState => ({
                ...prevState,
                [name]: value,
                tamount: totalAmount.toFixed(2), // Ensure two decimal places
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }

        if (name === 'buildername') {
            const selectedSupplier = supply.find((p) => p.suppliername === value);
            if (selectedSupplier) {
                setFormData({
                    ...formData,
                    buildername: selectedSupplier.suppliername,
                    sitename: selectedSupplier.sitename,
                    siteaddress: selectedSupplier.address,
                    mobile: selectedSupplier.mobile,
                    gstno: selectedSupplier.gstno,
                    latitude: selectedSupplier.latitude,
                    longitude: selectedSupplier.longitude,
                    openingbal: selectedSupplier.openingbal,
                });
            } else {
                setFormData(prevState => ({
                    ...prevState,
                    buildername: selectedSupplier ? selectedSupplier.suppliername : '', // Check if selectedSupplier is defined
                    sitename: selectedSupplier ? selectedSupplier.sitename : '',
                    siteaddress: selectedSupplier ? selectedSupplier.address : '',
                    mobile: selectedSupplier ? selectedSupplier.mobile : '',
                    gstno: selectedSupplier ? selectedSupplier.gstno : '',
                    latitude: selectedSupplier ? selectedSupplier.latitude : '',
                    longitude: selectedSupplier ? selectedSupplier.longitude : '',
                    openingbal: selectedSupplier ? selectedSupplier.openingbal : ''
                }));
            }
        } else {
            // Handle scenario when supply is not initialized yet
            console.log('Supply data not available yet.');
        }
    };

    const handleClear = () => {
        setFormData(formData);
        setFile(null);
    };

    // const handleUpdate = async (id) => {
    //     try {
    //         const response = await axios.put(`http://localhost:5000/updateSales/${id}`, formData);

    //         if (response.status === 200) {
    //             toast.success('Record Updated Successfully');
    //             // Update the registrations state with the updated registration
    //             const updatedRegistrations = registrations.map(registration => {
    //                 if (registration.id === id) {
    //                     return formData;
    //                 } else {
    //                     return registration;
    //                 }
    //             });
    //             setRegistrations(updatedRegistrations);
    //         } else {
    //             throw new Error('Network response was not ok');
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //         toast.error('Failed to Update Record');
    //     }
    // };

    const handleDelete = async (id) => {
        SweetAlert.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this record?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`http://localhost:5000/deleteSales/${id}`);
                    if (response.status === 200) {
                        toast.success('Record deleted successfully');
                        console.log("Succedd Deleted")
                        const updatedRegistrations = registrations.filter(registration => registration.id !== id);
                        setRegistrations(updatedRegistrations);
                        fetchData();
                    } else {
                        throw new Error('Deletion failed');
                    }
                } catch (error) {
                    toast.error(`Error deleting record: ${error.message}`);
                }
            } else {
                toast.info('Record was not deleted');
            }
        });
    };




    const handleRemoveProductField = (index) => {
        const updatedProducts = [...formData.products];
        updatedProducts.splice(index, 1);
        setFormData(prevState => ({
            ...prevState,
            products: updatedProducts
        }));
    };

    return (
        <>
            <Navbar />
            <Layout>
                <div className="registration-form-container">
                    <ToastContainer />
                    <h1 style={{ textAlign: 'center', fontSize: '30px', padding: '20px', color: 'blue' }}><strong>Quotation List</strong></h1>
                    <div className="table-container mb-5">
                        <table className="styled-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Quotation No.</th>
                                    <th>Date</th>
                                    <th>Builder Name</th>
                                    <th>Site Name</th>
                                    <th>Site Address</th>
                                    <th>Mobile</th>
                                    <th>Product Name</th>
                                    <th>HSN</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total Amount</th>
                                    <th>Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.map((registration, regIndex) => (
                                    registration.products.map((product, prodIndex) => (
                                        <tr key={`${registration.id}-${prodIndex}`}>
                                            {prodIndex === 0 ? (
                                                <>
                                                    <td rowSpan={registration.products.length}>{registration.id}</td>
                                                    <td rowSpan={registration.products.length}>{registration.quotation}</td>
                                                    <td rowSpan={registration.products.length}>{registration.date}</td>
                                                    <td rowSpan={registration.products.length}>{registration.buildername}</td>
                                                    <td rowSpan={registration.products.length}>{registration.sitename}</td>
                                                    <td rowSpan={registration.products.length}>{registration.siteaddress}</td>
                                                    <td rowSpan={registration.products.length}>{registration.mobile}</td>
                                                </>
                                            ) : null}
                                            <td>{product.product_name}</td>
                                            <td>{product.hsncode}</td>
                                            <td>{product.price}</td>
                                            <td>{product.quantity}</td>
                                            <td>{product.tamount}</td>
                                            {prodIndex === 0 ? (
                                                <td rowSpan={registration.products.length}>
                                                    <FaEdit className="edit-icon" style={{ color: 'green', cursor: 'pointer', fontSize: '25px' }} onClick={() => handleEdit(registration)} />
                                                </td>
                                            ) : null}

                                        </tr>
                                    ))
                                ))}
                            </tbody>
                        </table>
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
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h2 style={{ textAlign: 'center' }}><span style={{ fontSize: '20px' }}>Update Data </span></h2>
                                <button style={{ backgroundColor: 'gray', border: 'none', cursor: 'pointer', color: 'white' }} onClick={() => setModalIsOpen(false)}>
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="invoiceno"
                                        placeholder='Invoice no.'
                                        value={formData.invoiceno}
                                        onChange={handleChange}
                                        readOnly
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        readOnly
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <div className="form-group">
                                        <select style={{ width: '100%', height: '45px', border: '1px solid #ccc', borderRadius: '5px' }}
                                            name="buildername"
                                            value={formData.buildername}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Builder Name</option>
                                            {supply.map((builder) => (
                                                <option key={builder.id} value={builder.suppliername}>
                                                    {builder.suppliername}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="siteaddress"
                                        placeholder='Site Address'
                                        value={formData.siteaddress}
                                        onChange={handleChange}
                                        readOnly
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="mobile"
                                        placeholder='Mobile No.'
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        readOnly
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="gstno"
                                        placeholder='GST NO'
                                        value={formData.gstno}
                                        onChange={handleChange}
                                        readOnly
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <select style={{ width: '100%', height: '45px', border: '1px solid #ccc', borderRadius: '5px' }}
                                        name="sitename"
                                        value={formData.sitename}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Site Name</option>
                                        {supply.map((builder) => (
                                            <option key={builder.id} value={builder.sitename}>
                                                {builder.sitename}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <select style={{ width: '100%', height: '45px', border: '1px solid #ccc', borderRadius: '5px' }}
                                        name="vehiclenumber"
                                        value={formData.vehiclenumber}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Vehicle No.</option>
                                        {vehicle.map((vehicle1) => (
                                            <option key={vehicle1.id} value={vehicle1.vehicleno}>
                                                {vehicle1.vehicleno}-{vehicle1.drivername}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <select style={{ width: '100%', height: '45px', border: '1px solid #ccc', borderRadius: '5px' }}
                                        name="drivername"
                                        value={formData.drivername}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Driver Name</option>
                                        {driver.map((driver) => (
                                            <option key={driver.id} value={driver.username}>
                                                {driver.username}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className='from-row'>
                                <div className="form-group">
                                    <div className={`form-group ${isVisible ? '' : 'hidden'}`}>
                                        <input
                                            type="text"
                                            name="latitude"
                                            placeholder='Lattitude'
                                            value={formData.latitude}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className={`form-group ${isVisible ? '' : 'hidden'}`}>
                                        <input
                                            type="text"
                                            name="longitude"
                                            value={formData.longitude}
                                            placeholder='Longitude'
                                            onChange={handleChange}
                                            required
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className={`form-group ${isVisible ? '' : 'hidden'}`}>
                                        <input
                                            type="text"
                                            name="openingbal"
                                            value={formData.openingbal}
                                            onChange={handleChange}
                                            required
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                            <hr className='mt-2 mb-2'></hr>

                            <button className='btn btn-danger mb-2' onClick={handleAddProductField}>Add Product</button>
                            {formData.products.map((product, index) => (
                                <div key={index}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <select
                                                style={{ width: '100%', height: '45px', border: '1px solid #ccc', borderRadius: '5px' }}
                                                name="product_name"
                                                value={product.product_name}
                                                onChange={(e) => {
                                                    const updatedProducts = [...formData.products];
                                                    updatedProducts[index].product_name = e.target.value;
                                                    setFormData(prevState => ({
                                                        ...prevState,
                                                        products: updatedProducts
                                                    }));
                                                }}
                                                required
                                            >
                                                <option value="">Select Material</option>
                                                {product1.map((fetch) => (
                                                    <option key={fetch.id} value={fetch.typeofsand}>
                                                        {fetch.typeofsand}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <select
                                                style={{ width: '100%', height: '45px', border: '1px solid #ccc', borderRadius: '5px' }}
                                                name="hsncode"
                                                value={product.hsncode}
                                                onChange={(e) => {
                                                    const updatedProducts = [...formData.products];
                                                    updatedProducts[index].hsncode = e.target.value;
                                                    setFormData(prevState => ({
                                                        ...prevState,
                                                        products: updatedProducts
                                                    }));
                                                }}
                                                required
                                            >
                                                <option value="">Select HSN</option>
                                                {product1.map((fetch) => (
                                                    <option key={fetch.id} value={fetch.hsncode}>
                                                        {fetch.hsncode}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                name="gst"
                                                placeholder='GST No.'
                                                value={product.gst}
                                                onChange={(e) => handleChange(e, index)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                name="price"
                                                placeholder='Basic Rate'
                                                value={product.price}
                                                onChange={(e) => handleChange(e, index)}
                                                required

                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                name="quantity"
                                                placeholder='Quantity'
                                                value={product.quantity}
                                                onChange={(e) => handleChange(e, index)}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <input
                                                type="text"
                                                name="tamount"
                                                placeholder='Total Amount'
                                                value={product.tamount}
                                                onChange={(e) => handleChange(e, index)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                name="gstAmount"
                                                placeholder='GST Amount'
                                                value={product.gstAmount}
                                                readOnly
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                name="totalAmountWithGST"
                                                placeholder='Total Amount with GST'
                                                value={product.totalAmountWithGST}
                                                readOnly
                                                required
                                            />
                                        </div>
                                        <div className='form-group'>
                                            <FaTrash style={{ color: 'red', textAlign: 'center', fontSize: '25px', cursor: 'pointer' }} className="delete-icon" onClick={() => handleRemoveProductField(index)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className=" button-container">
                                <button className='btn btn-primary' onClick={handleSubmit}>Save</button>
                                {/* <button className='btn btn-primary' onClick={() => handleUpdate(formData.id)} style={{ marginLeft: '1rem' }}>Update</button> */}
                                <button className='btn btn-warning' onClick={handleClear} style={{ marginLeft: '1rem' }}>Clear</button>
                            </div>
                        </form >
                    </Modal>
                </div >
                <h1 style={{ textAlign: 'center', fontSize: '30px', padding: '20px', color: 'blue' }}><strong>View Invoice</strong></h1>
                <div className="table-container">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Invoice</th>
                                <th>Date</th>
                                <th>Builder Name</th>
                                <th>Site Name</th>
                                <th>Site Address</th>
                                <th>Mobile</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total Amount</th>
                                <th>Edit</th>
                                <th>Delete</th>
                                <th>PDF</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations1.map((registration, regIndex) => (
                                registration.products.map((product, prodIndex) => (
                                    <tr key={`${registration.id}-${prodIndex}`}>
                                        {prodIndex === 0 ? (
                                            <>
                                                <td rowSpan={registration.products.length}>{registration.invoiceno}</td>
                                                <td rowSpan={registration.products.length}>{registration.date}</td>
                                                <td rowSpan={registration.products.length}>{registration.buildername}</td>
                                                <td rowSpan={registration.products.length}>{registration.sitename}</td>
                                                <td rowSpan={registration.products.length}>{registration.siteaddress}</td>
                                                <td rowSpan={registration.products.length}>{registration.mobile}</td>
                                            </>
                                        ) : null}
                                        <td>{product.product_name}</td>
                                        <td>{product.price}</td>
                                        <td>{product.quantity}</td>
                                        <td>{product.tamount}</td>
                                        {prodIndex === 0 ? (
                                            <td rowSpan={registration.products.length}>
                                                <FaEdit className="edit-icon" style={{ color: 'green', cursor: 'pointer', fontSize: '25px' }} onClick={() => handleEdit(registration)} />
                                            </td>
                                        ) : null}
                                        {prodIndex === 0 ? (
                                            <td rowSpan={registration.products.length}>
                                                <FaTrash style={{ color: 'red', textAlign: 'center', fontSize: '25px', cursor: 'pointer' }} className="delete-icon"
                                                    onClick={() => handleDelete(registration.id)} />
                                            </td>
                                        ) : null}
                                        {prodIndex === 0 ? (
                                            <td rowSpan={registration.products.length}>  {registration.id && <Link to={`/invoice/${registration.id}`}>
                                                <FaFilePdf style={{ color: 'skyblue' }} className="pdf-icon" />
                                            </Link>}
                                            </td>
                                        ) : null}
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </table>
                </div>
            </Layout>
        </>
    );
};

export default Sales;