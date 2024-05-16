import React, { useEffect, useState } from 'react';
import Navbar from '../../component/Navbar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import '../registrations/registration.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaFilePdf } from 'react-icons/fa';
import SalesmanNavbar1 from '../../component/SalesmanNavbar1';
import { FaEdit, FaTrash } from 'react-icons/fa';
import SweetAlert from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const BuilderAvailable = ({ id }) => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const currentTime = new Date().toLocaleTimeString();
    const [registrations, setRegistrations] = useState([]);

    const [formData, setFormData] = useState({
        date: currentDate,
        time: currentTime,
        buildername: '',
        sitename: '',
        siteaddress: '',
        mobile: '',
        supervisorname: '',
        supervisormobile: '',
        quotation: '',
        openingbal: '',
        products: []   //an array to save multiple products
    });

    const [file, setFile] = useState(null);
    const [salesman, setSalesman] = useState([]);
    const [product1, setProduct1] = useState([]);
    const [supply, setSupply] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [selectedDriverId, setSelectedDriverId] = useState(null);

    const handleViewQuotation = () => {
        navigate(`/purchase1`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateFormData(formData);
        if (validationError) {
            toast.error(validationError);
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/builderAvailableRegistration`, {
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
                    date: currentDate,
                    time: currentTime,
                    buildername: '',
                    sitename: '',
                    siteaddress: '',
                    mobile: '',
                    supervisorname: '',
                    supervisormobile: '',
                    quotation: '',
                    openingbal: '',
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

    useEffect(() => {
        fetchData();
        fetchSalesman();
        fetchProduct();
        fetchBuilder();

    }, []);

    const fetchBuilder = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getSupplyRegistration');
            setSupply(response.data.data);
            console.log("SupplyRegistration", response);
        } catch (error) {
            setError(error.message);
        }
    };


    const fetchSalesman = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getSiteRegistration');
            setSalesman(response.data.data);
            console.log("Site", response);
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

    const handleAddProductField = () => {
        const newProductField = {
            product_name: '',
            price: '',
            quantity: '',
            tamount: ''
        };

        setFormData(prevState => ({
            ...prevState,
            products: [...prevState.products, newProductField]
        }));
    };

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        const updatedProducts = [...formData.products];

        // Ensure the products array is initialized for the specific index
        if (!updatedProducts[index]) {
            updatedProducts[index] = {
                product_name: '',
                price: '',
                quantity: '',
                tamount: ''
            };
        }
        // If supervisor name is changed, update supervisor mobile
        if (name === 'supervisorname' && salesman.length > 0) {
            const selectedSupervisor = salesman.find((s) => s.supervisorname === value);
            if (selectedSupervisor) {
                setFormData({
                    ...formData,
                    supervisorname: selectedSupervisor.supervisorname,
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

        if (name === 'price' || name === 'quantity') {
            // If price or quantity changes, update the total amount
            updatedProducts[index][name] = value;
            const quantity = parseFloat(updatedProducts[index].quantity);
            const price = parseFloat(updatedProducts[index].price);

            // Check if both price and quantity are valid numbers
            if (!isNaN(quantity) && !isNaN(price)) {
                const totalAmount = quantity * price;
                updatedProducts[index].tamount = totalAmount.toFixed(2);
            }
        } else {
            updatedProducts[index][name] = value;
        }

        setFormData(prevState => ({
            ...prevState,
            products: updatedProducts
        }));

        updatedProducts[index][name] = value;

        if (name === 'product_name') {
            const selectedProduct = product1.find((p) => p.typeofsand === value);
            if (selectedProduct) {
                updatedProducts[index].product_name = selectedProduct.typeofsand;
                updatedProducts[index].price = selectedProduct.price;
            } else {
                updatedProducts[index].product_name = '';
                updatedProducts[index].price = '';
            }
        }

        if (name === 'quantity') {
            const quantity = parseFloat(value);
            const totalAmount = quantity * parseFloat(updatedProducts[index].price);
            updatedProducts[index].tamount = totalAmount.toFixed(2);
        }

        setFormData(prevState => ({
            ...prevState,
            products: updatedProducts
        }));

        if (name === 'buildername') {
            const selectedSupplier = supply.find((p) => p.suppliername === value);
            if (selectedSupplier) {
                setFormData({
                    ...formData,
                    buildername: selectedSupplier.suppliername,
                    sitename: selectedSupplier.sitename,
                    siteaddress: selectedSupplier.address,
                    mobile: selectedSupplier.mobile,
                    openingbal: selectedSupplier.openingbal,

                });
            } else {
                setFormData(prevState => ({
                    ...prevState,
                    buildername: selectedSupplier ? selectedSupplier.suppliername : '', // Check if selectedSupplier is defined
                    sitename: selectedSupplier ? selectedSupplier.sitename : '',
                    siteaddress: selectedSupplier ? selectedSupplier.address : '',
                    mobile: selectedSupplier ? selectedSupplier.mobile : '',
                    openingbal: selectedSupplier ? selectedSupplier.openingbal : '',

                }));
            }
        } else {
            // Handle scenario when supply is not initialized yet
            console.log('Supply data not available yet.');
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
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

    const validateFormData = (data) => {
        const { date, time, buildername, sitename, siteaddress, mobile, supervisorname, supervisormobile, products } = data;

        if (!date || !time || !buildername || !sitename || !siteaddress || !mobile || !supervisorname || !supervisormobile || products.length === 0) {
            return 'All fields are mandatory';
        }

        // Check if any product fields are missing
        for (const product of products) {
            const { product_name, price, quantity, tamount } = product;
            if (!product_name || !price || !quantity || !tamount) {
                return 'All product fields are mandatory';
            }
        }

        return null; // No validation errors
    };

    const handleUpdate = async (e, id) => {
        e.preventDefault();
        const validationError = validateFormData(formData);
        if (validationError) {
            toast.error(validationError);
            return;
        }
        try {
            const response = await axios.put(`http://localhost:5000/updateBuilderAvailable/${id}`, formData);

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
                    const response = await axios.delete(`http://localhost:5000/deleteBuilderAvailable/${id}`);
                    if (response.status === 200) {
                        toast.success('Record deleted successfully');
                        setRegistrations(registrations.filter(registration => registration.id !== id));
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


    // Function to handle removing a product input field
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
            <SalesmanNavbar1 />

            <div className="registration-form-container">
                <ToastContainer />
                <h1 style={{ textAlign: 'center', fontSize: '30px', padding: '20px' }}><strong>Salesman Site Visit</strong></h1>
                <form encType="multipart/form-data">
                    <div className="form-row">
                        <div className="form-group">
                            <input
                                type="text"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                required
                            />
                        </div>
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
                    <div className="form-row">
                        <div className="form-group">
                            <input
                                type="text"
                                name="sitename"
                                placeholder='Site Name'
                                value={formData.sitename}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="siteaddress"
                                placeholder='Site Address'
                                value={formData.siteaddress}
                                onChange={handleChange}
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
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <select style={{ width: '100%', height: '45px', border: '1px solid #ccc', borderRadius: '5px' }}
                                name="supervisorname"
                                value={formData.supervisorname}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Site Supervisor Name</option>
                                {salesman.map((salesman) => (
                                    <option key={salesman.id} value={salesman.supervisorname}>
                                        {salesman.supervisorname}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="supervisormobile"
                                placeholder='Site Supervisor Mobile'
                                value={formData.supervisormobile}
                                onChange={handleChange}
                                required
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <div className={`form-group ${isVisible ? '' : 'hidden'}`}>
                                <input
                                    type="text"
                                    name="quotation"
                                    placeholder='Quotation No'
                                    value={formData.quotation}
                                    onChange={handleChange}
                                    required
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className='form-row'>
                            <div className='form-group'>
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
                    </div>
                    <hr className='mt-2 mb-2'></hr>
                    <button className='btn btn-danger mb-3' onClick={handleAddProductField}>Add Product</button>
                    {formData.products.map((product, index) => (
                        <div key={index}>
                            <div className="form-row">
                                <div className="form-group">
                                    <select
                                        style={{ width: '100%', height: '45px', border: '1px solid #ccc', borderRadius: '5px' }}
                                        name="product_name"
                                        value={product.product_name}
                                        onChange={(e) => handleChange(e, index)}
                                        required
                                    >
                                        <option value="">Select Material</option>
                                        {product1.map((material) => (
                                            <option key={material.id} value={material.typeofsand}>
                                                {material.typeofsand}
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
                                        readOnly
                                    />
                                </div>
                                <div className='form-group'>
                                    <FaTrash style={{ color: 'red', textAlign: 'center', fontSize: '25px', cursor: 'pointer' }} className="delete-icon" onClick={() => handleRemoveProductField(index)} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="form-row">
                        <div className="form-group mt-2">
                            <input type="file" name="image" onChange={handleFileChange} />
                            {file && <img src={URL.createObjectURL(file)} alt="Uploaded Image" />}
                            {console.log("image", file)}
                        </div>
                        <div className="form-group mb-3">
                            <button className='btn btn-primary' onClick={handleSubmit} type="submit">Save</button>
                            <button className='btn btn-primary' onClick={(e) => handleUpdate(e, selectedDriverId)} style={{ marginLeft: '1rem' }}>Update</button>
                            <button className='btn btn-warning' onClick={handleClear} style={{ marginLeft: '1rem' }}>Clear</button>
                        </div>
                    </div>
                </form >
                <div className="table-container">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Builder Name</th>
                                <th>Site Name</th>
                                <th>Site Address</th>
                                <th>Mobile</th>
                                <th>Supervisor Name</th>
                                <th>Supervisor Mobile</th>
                                <th>Quotation</th>
                                <th>Image</th>
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
                            {registrations.map((registration, regIndex) => (
                                registration.products.map((product, prodIndex) => (
                                    <tr key={`${registration.id}-${prodIndex}`}>
                                        {prodIndex === 0 ? (
                                            <>
                                                <td rowSpan={registration.products.length}>{registration.date}</td>
                                                <td rowSpan={registration.products.length}>{registration.time}</td>
                                                <td rowSpan={registration.products.length}>{registration.buildername}</td>
                                                <td rowSpan={registration.products.length}>{registration.sitename}</td>
                                                <td rowSpan={registration.products.length}>{registration.siteaddress}</td>
                                                <td rowSpan={registration.products.length}>{registration.mobile}</td>
                                                <td rowSpan={registration.products.length}>{registration.supervisorname}</td>
                                                <td rowSpan={registration.products.length}>{registration.supervisormobile}</td>
                                                <td rowSpan={registration.products.length}>{registration.quotation}</td>
                                                <td rowSpan={registration.products.length}>{registration.image}</td>
                                            </>
                                        ) : null}
                                        <td>{product.product_name}</td>
                                        <td>{product.price}</td>
                                        <td>{product.quantity}</td>
                                        <td>{product.tamount}</td>
                                        {prodIndex === 0 ? (
                                            <td rowSpan={registration.products.length}>
                                                <FaEdit style={{ color: 'green', textAlign: 'center', fontSize: '25px', cursor: 'pointer' }} className="delete-icon" onClick={() => handleEdit(registration)} />
                                            </td>
                                        ) : null}
                                        {prodIndex === 0 ? (
                                            <td rowSpan={registration.products.length}>
                                                <FaTrash style={{ color: 'red', textAlign: 'center', fontSize: '25px', cursor: 'pointer' }} className="delete-icon" onClick={() => handleDelete(registration.id)} />
                                            </td>
                                        ) : null}
                                        {prodIndex === 0 ? (
                                            <td rowSpan={registration.products.length}>  {registration.id && <Link to={`/quotation1/${registration.id}`}>
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
        </>
    );
};

export default BuilderAvailable;