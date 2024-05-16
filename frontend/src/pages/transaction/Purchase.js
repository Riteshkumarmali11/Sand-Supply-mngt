import React, { useEffect, useState } from 'react';
import Navbar from '../../component/Navbar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import '../registrations/registration.css';
import Layout from '../../component/Layout';
import SalesInvoice from './SalesInvoice';
import { Link, useNavigate } from 'react-router-dom';
import { FaFilePdf } from 'react-icons/fa';
import { FaEdit, FaTrash } from 'react-icons/fa';
import SweetAlert from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const Purchase = ({ id }) => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const [formData, setFormData] = useState({
        invoiceno: '',
        ownername: '',
        companyname: '',
        companyaddress: '',
        mobile: '',
        date: currentDate,
        paymode: '',
        vehiclenumber: '',
        drivername: '',
        openingbalance: '',
        products: []  //Array for Products mapping
    });

    const [product1, setProduct1] = useState([]);
    const [file, setFile] = useState(null);
    const [supply, setSupply] = useState([]);
    const [vehicle, setVehicle] = useState([]);
    const [driver, setDriver] = useState([]);
    const [error, setError] = useState(null);
    const [showPDF, setShowPDF] = useState(false);
    const [invoicenumber, setInvoiceNumber] = useState('');
    const [registrations, setRegistrations] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [gstPercentage, setGstPercentage] = useState(5);
    const [selectedDriverId, setSelectedDriverId] = useState(null);

    useEffect(() => {
        fetchData();
        fetchProduct();
        fetchBuilder();
        fetchVehicle();
        fetchDriver();
        generateInvoiceNumber();
    }, []);

    const generateInvoiceNumber = () => {
        const currentDate = new Date();
        //const year = currentDate.getFullYear();
        const month = `${currentDate.getMonth() + 1}`.padStart(2, '0');
        const date = `${currentDate.getDate()}`.padStart(2, '0');
        // const currentYear = year.toString().slice(-4);

        // Get the last part of the previous invoice number and increment it
        let lastNumber = parseInt(invoicenumber.slice(-4)) || 0;
        lastNumber++; // Increment the last number

        // Construct the new invoice number by concatenating date and incremented number
        const newInvoiceNumber = `${month}${date}${lastNumber.toString().padStart(2, '0')}`;
        setInvoiceNumber(newInvoiceNumber);
    };

    const handleAddProductField = () => {
        const newProductField = {
            product_name: '',
            price: '',
            unit: '',
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
            const response = await axios.get('http://localhost:5000/getVendor');
            setSupply(response.data.data);
            console.log("Vendor", response);
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
            const response = await axios.get(`http://localhost:5000/getPurchase`);
            const { success, data } = response.data;
            if (success) {
                // Convert the object of objects into an array of objects
                const registrationsArray = Object.values(data);
                setRegistrations(registrationsArray);
                console.log("Purchase", registrationsArray);
            } else {
                throw new Error('Backend response indicates failure');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateFormData(formData);
        if (validationError) {
            toast.error(validationError);
            return;
        }
        try {
            const response = await axios.post(`http://localhost:5000/purchaseRegistration`, {
                ...formData,
                products: JSON.stringify(formData.products) // Convert products array to JSON string
            }, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // Clear form fields upon successful submission   
                setFormData({
                    invoiceno: '',
                    ownername: '',
                    companyname: '',
                    companyaddress: '',
                    mobile: '',
                    date: '',
                    paymode: '',
                    vehiclenumber: '',
                    drivername: '',
                    openingbalance: '',
                    products: []
                });
                alert('Registration Successful');
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Data Not Registered');
        }
    };

    const handleChange = (e, index) => {
        const { name, value } = e.target;

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

        if (name === 'ownername') {
            const selectedSupplier = supply.find((p) => p.ownername === value);
            if (selectedSupplier) {
                setFormData(prevState => ({
                    ...prevState,
                    [name]: value,
                    companyname: selectedSupplier.companyname,
                    companyaddress: selectedSupplier.companyaddress,
                    mobile: selectedSupplier.mobile,
                    openingbalance: selectedSupplier.openingbalance,
                    invoiceno: invoicenumber
                }));
            } else {
                setFormData(prevState => ({
                    ...prevState,
                    [name]: value,
                    companyname: '',
                    companyaddress: '',
                    mobile: '',
                    openingbalance: '',
                    invoiceno: invoicenumber
                }));
            }
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
            }));
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

    };

    const validateFormData = (data) => {
        const { ownername, companyname, companyaddress, invoiceno, mobile, date, paymode, vehiclenumber, drivername, openingbalance, products } = data;

        if (!ownername || !companyname || !companyaddress || !invoiceno || !mobile || !date || !paymode || !vehiclenumber || !drivername || !openingbalance || products.length === 0) {
            return 'All fields are mandatory';
        }

        // Check if any product fields are missing
        for (const product of products) {
            const { product_name, price, unit, quantity, tamount, gstAmount, totalAmountWithGST } = product;
            if (!product_name || !price || !unit || !quantity || !tamount || !gstAmount || !totalAmountWithGST) {
                return 'All product fields are mandatory';
            }
        }

        return null; // No validation errors
    };



    const handleClear = () => {
        setFormData(formData);
        setSelectedDriverId(null); // Reset the selected driver
        setFile(null);
    };

    const handleEdit = (customer) => {
        setFormData({
            ...customer,
        });
        setSelectedDriverId(customer.id); // Set the selected driver
    };

    const handleUpdate = async (e, id) => {
        e.preventDefault();
        const validationError = validateFormData(formData);
        if (validationError) {
            toast.error(validationError);
            return;
        }
        try {
            const response = await axios.put(`http://localhost:5000/updatePurchase/${id}`, formData);

            if (response.status === 200) {
                toast.success('Record Updated Successfully');
                // Update the registrations state with the updated registration
                const updatedRegistrations = registrations.map(registration => {
                    if (registration.id === id) {
                        return formData;
                    } else {
                        return registration;
                    }
                });
                setRegistrations(updatedRegistrations);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to Update Record');
        }
    };

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
                    const response = await axios.delete(`http://localhost:5000/deletePurchase/${id}`);
                    if (response.status === 200) {
                        toast.success('Record deleted successfully');
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
                    <h1 style={{ textAlign: 'center', fontSize: '30px', padding: '20px' }}><strong>Purchase Products</strong></h1>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                                <div className="form-group">
                                    <select style={{ width: '100%', height: '45px', border: '1px solid #ccc', borderRadius: '5px' }}
                                        name="ownername"
                                        value={formData.ownername}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Supplier Name</option>
                                        {supply.map((owner) => (
                                            <option key={owner.id} value={owner.ownername}>
                                                {owner.ownername}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="companyname"
                                    placeholder='Purchase Site Name'
                                    value={formData.companyname}
                                    onChange={handleChange}
                                    readOnly
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="companyaddress"
                                    placeholder='Purchase Company Address'
                                    value={formData.companyaddress}
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
                            <div className={`form-group ${isVisible ? '' : 'hidden'}`}>
                                <input
                                    type="text"
                                    name="openingbalance"
                                    value={formData.openingbalance}
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
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    readOnly
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <select value={formData.paymode} name='paymode' onChange={handleChange} className='select'>
                                    <option value="">Select Payment Mode</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Debit">Debit</option>
                                    <option value="Credit">Credit</option>
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
                                            {vehicle1.vehicleno}
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

                        <hr className='mt-2 mb-2'></hr>

                        <button className='btn btn-danger mb-2' onClick={handleAddProductField}>Add Product</button>
                        {formData.products.map((product, index) => (
                            <div key={index}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <select
                                            style={{ width: '100%', height: '45px', border: '1px solid #ccc', borderRadius: '5px' }}
                                            name="product"
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
                                        <select
                                            style={{ width: '100%', height: '45px', border: '1px solid #ccc', borderRadius: '5px' }}
                                            name="unit"
                                            value={product.unit}
                                            onChange={(e) => {
                                                const updatedProducts = [...formData.products];
                                                updatedProducts[index].unit = e.target.value;
                                                setFormData(prevState => ({
                                                    ...prevState,
                                                    products: updatedProducts
                                                }));
                                            }}
                                            required
                                        >
                                            <option value="">Select Unit</option>
                                            {product1.map((fetch) => (
                                                <option key={fetch.id} value={fetch.unit}>
                                                    {fetch.unit}
                                                </option>
                                            ))}
                                        </select>
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
                        <div className=" button-container mb-5">
                            <button className='btn btn-primary' onClick={handleSubmit}>Save</button>
                            <button className='btn btn-primary' onClick={(e) => handleUpdate(e, selectedDriverId)} style={{ marginLeft: '1rem' }}>Update</button>
                            <button className='btn btn-warning' onClick={handleClear} style={{ marginLeft: '1rem' }}>Clear</button>
                            {showPDF && (
                                <div className="modal-background">
                                    <div className="modal-content">
                                        <button className="close-modal-btn" onClick={() => setShowPDF(false)}>Close</button>
                                        <SalesInvoice sitename={formData.sitename} siteaddress={formData.siteaddress} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </form >
                    <div className="table-container">
                        <table className="styled-table">
                            <thead>
                                <tr>
                                    <th>Invoice No.</th>
                                    <th>Owner Name</th>
                                    <th>Site Name</th>
                                    <th>Site Address</th>
                                    <th>Mobile</th>
                                    <th>Date</th>
                                    <th>Payment Mode</th>
                                    <th>Vehicle No.</th>
                                    <th>Driver Name</th>
                                    <th>Product Name</th>
                                    <th>Price</th>
                                    <th>Unit</th>
                                    <th>Quantity</th>
                                    <th>Total Amount</th>
                                    <th>Gst A.</th>
                                    <th>Total GSTAmount</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                    <th>PDF</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.map((registration, regIndex) => (
                                    registration.products.map((product, prodIndex) => (
                                        <tr key={`${registration.id}-${prodIndex}`}>
                                            {prodIndex === 0 ? (
                                                <>
                                                    <td rowSpan={registration.products.length}>{registration.invoiceno}</td>
                                                    <td rowSpan={registration.products.length}>{registration.ownername}</td>
                                                    <td rowSpan={registration.products.length}>{registration.companyname}</td>
                                                    <td rowSpan={registration.products.length}>{registration.companyaddress}</td>
                                                    <td rowSpan={registration.products.length}>{registration.mobile}</td>
                                                    <td rowSpan={registration.products.length}>{registration.date}</td>
                                                    <td rowSpan={registration.products.length}>{registration.paymode}</td>
                                                    <td rowSpan={registration.products.length}>{registration.vehiclenumber}</td>
                                                    <td rowSpan={registration.products.length}>{registration.drivername}</td>

                                                </>
                                            ) : null}
                                            <td>{product.product_name}</td>
                                            <td>{product.price}</td>
                                            <td>{product.unit}</td>
                                            <td>{product.quantity}</td>
                                            <td>{product.tamount}</td>
                                            <td>{product.gstAmount}</td>
                                            <td>{product.totalAmountWithGST}</td>
                                            {prodIndex === 0 ? (
                                                <td rowSpan={registration.products.length}>
                                                    <FaEdit className="edit-icon" style={{ color: 'green', cursor: 'pointer', fontSize: '25px' }} onClick={() => handleEdit(registration)} />
                                                </td>
                                            ) : null}
                                            {prodIndex === 0 ? (
                                                <td rowSpan={registration.products.length}>
                                                    <FaTrash style={{ color: 'red', textAlign: 'center', fontSize: '25px', cursor: 'pointer' }} className="delete-icon" onClick={() => handleDelete(registration.id)} />
                                                </td>
                                            ) : null}
                                            {prodIndex === 0 ? (
                                                <td rowSpan={registration.products.length}>  {registration.id && <Link to={`/purchaseinvoice/${registration.id}`}>
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
                </div >
            </Layout>
        </>
    );
};

export default Purchase;