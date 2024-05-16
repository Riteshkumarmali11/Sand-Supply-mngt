import React, { useEffect, useState } from 'react';
import './registration.css';
import Navbar from '../../component/Navbar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Layout from '../../component/Layout';
import { FaEdit, FaTrash } from 'react-icons/fa';
import SweetAlert from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const initialFormData = {
    gstno: '',
    pan: '',
    suppliername: '',
    mobile: '',
    sitename: '',
    address: '',
    email: '',
    architectname: '',
    latitude: '',
    longitude: '',
    openingbal: ''
};

const SupplyMaster = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [selectedVendorId, setSelectedVendorId] = useState(null); // Track the ID of the selected record
    const [customers, setCustomers] = useState([]);
    const [supply, setSupply] = useState([]);
    const [error, setError] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        fetchCustomers(); // Fetch the list of customers when the component mounts
        fetchSite(); // Fetch site data
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getSupplyRegistration');
            setCustomers(response.data.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
            toast.error(`Error fetching customers: ${error.message}`);
        }
    };

    const fetchSite = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getSiteRegistration');
            setSupply(response.data.data);
        } catch (error) {
            console.error('Error fetching sites:', error);
            toast.error(`Error fetching sites: ${error.message}`);
        }
    };

    const handleEdit = (customer) => {
        setFormData(customer);
        setSelectedVendorId(customer.id); // Set the ID of the record being edited
    };

    const validateFormData = (data) => {
        const { gstno, pan, suppliername, mobile, sitename, address, email, architectname, latitude, longitude, openingbal } = data;

        // Check for empty required fields
        if (
            !gstno ||
            !pan ||
            !suppliername ||
            !mobile ||
            !sitename ||
            !address ||
            !email ||
            !architectname ||
            !latitude ||
            !longitude ||
            !openingbal
        ) {
            return 'All fields are mandatory';
        }
        if (!/^\d{10}$/.test(mobile)) {
            return 'Mobile number must be a 10-digit numerical value';
        }
        if (!/^\d{10}$/.test(pan)) {
            return 'Pan number must be a not valid';
        }

        return null; // No errors
    };
    const handleChange = (e) => {
        const { name, value } = e.target;

        let truncatedValue = value;

        // Apply specific validation for mobile and gstno fields
        if (name === 'mobile' || name === 'openingbal') {
            // Remove non-digit characters
            truncatedValue = value.replace(/[^\d]/g, '');
            // Limit the length of mobile and gstno to 10 characters
            truncatedValue = truncatedValue.slice(0, 10);
        }

        // Apply specific validation for suppliername, architectname, and pan fields
        if (name === 'suppliername' || name === 'architectname') {
            // Remove non-alphabetical characters
            truncatedValue = value.replace(/[^a-zA-Z]/g, '');
        } else if (name === 'pan') {
            // Remove non-alphanumeric characters
            truncatedValue = value.replace(/[^a-zA-Z0-9]/g, '');
            // Limit the length of PAN to 10 characters
            truncatedValue = truncatedValue.slice(0, 10).toUpperCase(); // Ensure uppercase
        }

        // Update the form data with the truncated value
        setFormData({
            ...formData,
            [name]: truncatedValue,
        });

        // Update form data based on selected site name
        if (name === 'sitename') {
            const selectedSite = supply.find((p) => p.sitename === value);
            if (selectedSite) {
                setFormData({
                    ...formData,
                    sitename: selectedSite.sitename,
                    address: selectedSite.siteaddress,
                    latitude: selectedSite.latitude,
                    longitude: selectedSite.longitude,
                });
            }
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
            const response = await axios.post('http://localhost:5000/supplyRegistration', formData);

            if (response.status === 200) {
                handleClear();
                toast.success('Registration Successful');
                fetchCustomers();
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error during submission:', error);
            toast.error('Data Not Registered');
        }
    };

    const handleClear = () => {
        setFormData(initialFormData);
        setSelectedVendorId(null); // Reset the selected record ID
    };

    const handleUpdate = async (e, id) => {
        if (e) {
            e.preventDefault(); // Prevent form submission
        }

        if (!id) {
            toast.error("No record ID provided for update");
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:5000/updateSupply/${id}`,
                formData
            );

            if (response.status === 200) {
                toast.success('Record updated successfully');
                fetchCustomers(); // Refresh after updating
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error during update:', error);
            toast.error('Failed to update record');
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
                    const response = await axios.delete(`http://localhost:5000/deleteSupply/${id}`);
                    if (response.status === 200) {
                        toast.success('Record deleted successfully');
                        fetchCustomers();
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

    return (

        <>
            <Navbar />
            <Layout>
                <div className="registration-form-container">
                    <ToastContainer />
                    <h1 style={{ textAlign: 'center', fontSize: '30px', padding: '20px' }}><strong>Builder Registration</strong></h1>
                    <form>
                        {/* Form inputs */}

                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="gstno"
                                    placeholder='GST No.'
                                    value={formData.gstno}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="pan"
                                    placeholder='PAN Card No.'
                                    value={formData.pan}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="suppliername"
                                    placeholder='Builder Name'
                                    value={formData.suppliername}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
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
                                <input
                                    type="text"
                                    name="address"
                                    placeholder='Site Address'
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="email"
                                    placeholder='Email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="architectname"
                                    placeholder='Architecture Name'
                                    value={formData.architectname}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className='form-group'>
                                <input
                                    type="text"
                                    name="openingbal"
                                    placeholder='Opening Balance'
                                    value={formData.openingbal}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className='form-row'>
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
                                        onChange={handleChange}
                                        required
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>

                        <div className=" button-container mb-3">
                            <button className='btn btn-primary' onClick={handleSubmit}>Save</button>
                            <button className='btn btn-primary' onClick={(e) => {
                                e.preventDefault(); // Prevent form submission
                                handleUpdate(e, selectedVendorId);
                            }} style={{ marginLeft: '1rem' }}>Update</button>
                            <button className='btn btn-warning' onClick={handleClear} style={{ marginLeft: '1rem' }}>Clear</button>
                        </div>
                    </form >
                    <div className="table-container">
                        <table className="styled-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>GST No.</th>
                                    <th>PAN No.</th>
                                    <th>Supplier Name</th>
                                    <th>Mobile</th>
                                    <th>Site Name</th>
                                    <th>Address</th>
                                    <th>Email</th>
                                    <th>Architect Name</th>
                                    <th>Lat</th>
                                    <th>Long</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td>{customer.id}</td>
                                        <td>{customer.gstno}</td>
                                        <td>{customer.pan}</td>
                                        <td>{customer.suppliername}</td>
                                        <td>{customer.mobile}</td>
                                        <td>{customer.sitename}</td>
                                        <td>{customer.address}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.architectname}</td>
                                        <td>{customer.latitude}</td>
                                        <td>{customer.longitude}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <FaEdit className="edit-icon" onClick={() => handleEdit(customer)} style={{ color: 'green', cursor: 'pointer', fontSize: '25px' }} />
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <FaTrash style={{ color: 'red', textAlign: 'center', fontSize: '25px', cursor: 'pointer' }} className="delete-icon" onClick={() => handleDelete(customer.id)}>Delete</FaTrash>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default SupplyMaster;
