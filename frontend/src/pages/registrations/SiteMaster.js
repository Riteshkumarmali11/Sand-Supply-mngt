import React, { useEffect, useState } from 'react';
import './registration.css';
import Navbar from '../../component/Navbar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Layout from '../../component/Layout';
import { FaEdit, FaTrash } from 'react-icons/fa';
import SweetAlert from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const SiteMaster = () => {
    const initialFormData = {
        buildername: '',
        sitename: '',
        supervisorname: '',
        siteaddress: '',
        mobile: '',
        latitude: '',
        longitude: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [selectedDriverId, setSelectedDriverId] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSite();
    }, []);

    const fetchSite = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getSiteRegistration');
            setCustomers(response.data.data);
        } catch (error) {
            setError(error.message);
        }
    };

    const validateFormData = (formData) => {
        const {
            buildername,
            sitename,
            supervisorname,
            siteaddress,
            mobile,
            latitude,
            longitude,
        } = formData;

        // Check if any required field is empty
        if (
            !buildername ||
            !sitename ||
            !supervisorname ||
            !siteaddress ||
            !mobile ||
            !latitude ||
            !longitude
        ) {
            return 'All fields are mandatory';
        }

        // Check if mobile number is a 10-digit number
        if (!/^\d{10}$/.test(mobile)) {
            return 'Mobile number must be a 10-digit numerical value';
        }

        return null; // No errors
    };


    const handleChange = (e) => {
        const { name, value } = e.target;

        let truncatedValue = value;

        // Apply specific validation for mobile and gstno 
        if (name === 'mobile') {
            // Remove non-digit characters
            truncatedValue = value.replace(/[^\d]/g, '');
            // Limit the length of mobile and gstno to 10 characters
            truncatedValue = truncatedValue.slice(0, 10);
        }

        // Apply specific validation for suppliername, architectname, and pan fields
        if (name === 'buildername' || name === 'supervisorname') {
            // Remove non-alphabetical characters
            truncatedValue = value.replace(/[^a-zA-Z]/g, '');
        } 
        // Update the form data with the truncated value
        setFormData({
            ...formData,
            [name]: truncatedValue,
        })
};

const handleClear = () => {
    setFormData(initialFormData);
    setSelectedDriverId(null); // Reset the selected driver
};

const handleEdit = (customer) => {
    setFormData({
        ...customer,
    });
    setSelectedDriverId(customer.id); // Set the selected driver
};


const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateFormData(formData);
    if (validationError) {
        toast.error(validationError);
        return;
    }

    try {
        const response = await axios.post('http://localhost:5000/siteRegistration', formData);

        if (response.status === 200) {
            handleClear();
            toast.success('Registration Successful');
            fetchSite();
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error:', error);
        toast.error('Data Not Registered');
    }
};

const handleUpdate = async (e, id) => {
    e.preventDefault();

    const validationError = validateFormData(formData);
    if (validationError) {
        toast.error(validationError);
        return;
    }
    try {
        const response = await axios.put(`http://localhost:5000/updateSite/${id}`, formData);

        if (response.status === 200) {
            toast.success('Record updated successfully');
            fetchSite();
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error during update:', error);
        toast.error('Failed to update record');
    }
};

const handleDelete = async (id) => {
    // Show confirmation dialog before deleting
    SweetAlert.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this record?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
    }).then(async (result) => {
        if (result.isConfirmed) {
            // If user confirmed, proceed with deletion
            try {
                const response = await axios.delete(`http://localhost:5000/deleteSite/${id}`);
                if (response.status === 200) {
                    toast.success('Record deleted successfully');
                    fetchSite(); // Refresh the list after deletion
                } else {
                    throw new Error('Deletion failed');
                }
            } catch (error) {
                toast.error(`Error deleting record: ${error.message}`);
            }
        } else {
            toast.info('Record was not deleted'); // User canceled
        }
    });
};

const handleGetCurrentLocation = () => {
    console.log('Current location button clicked');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Current location button clicked');
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                setFormData({
                    ...formData,
                    latitude: latitude,
                    longitude: longitude,
                });
            },
            (error) => {
                console.error('Error getting current location:', error);
                toast.error('Error getting current location');
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
        toast.error('Geolocation is not supported by this browser.');
    }
};

const generateGoogleMapLink = () => {
    const { latitude, longitude } = formData;
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
};

return (
    <>
        <Navbar />
        <Layout>
            <div className="registration-form-container">
                <ToastContainer />
                <h1 style={{ textAlign: 'center', fontSize: '30px', padding: '20px' }}><strong>Site Registration</strong></h1>
                <form>
                    {/* Form inputs */}

                    <div className="form-row">
                        <div className="form-group">
                            <input
                                type="text"
                                name="buildername"
                                placeholder='Builder Name'
                                value={formData.buildername}
                                onChange={handleChange}
                                required
                            />
                        </div>
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
                                name="supervisorname"
                                placeholder='Supervisor Name'
                                value={formData.supervisorname}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
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
                        <div className="form-group">
                            <input
                                type="text"
                                name="latitude"
                                placeholder='Latitude'
                                value={formData.latitude}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="longitude"
                                placeholder='Longitude'
                                value={formData.longitude}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>

                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <button className='btn btn-secondary' onClick={handleGetCurrentLocation}>Current Location</button>
                        </div>
                    </div>
                    <div className=" button-container mb-3">
                        <button className='btn btn-primary' onClick={handleSubmit}>Save</button>
                        <button className='btn btn-primary' onClick={(e) => handleUpdate(e, selectedDriverId)} style={{ marginLeft: '1rem' }}>Update</button>
                        <button className='btn btn-warning' onClick={handleClear} style={{ marginLeft: '1rem' }}>Clear</button>
                    </div>
                </form >
                <div className="table-container">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Builder Name</th>
                                <th>Site Name</th>
                                <th>Supervisor Name</th>
                                <th>Site Address</th>
                                <th>Mobile</th>
                                <th>Latitude</th>
                                <th>Longitude</th>
                                <th>Location</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>{customer.id}</td>
                                    <td>{customer.buildername}</td>
                                    <td>{customer.sitename}</td>
                                    <td>{customer.supervisorname}</td>
                                    <td>{customer.siteaddress}</td>
                                    <td>{customer.mobile}</td>
                                    <td>{customer.latitude}</td>
                                    <td>{customer.longitude}</td>
                                    <td>
                                        <a href={generateGoogleMapLink()} target="_blank" rel="noopener noreferrer">View on Map</a>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <FaEdit className="edit-icon" onClick={() => handleEdit(customer)} style={{ color: 'green', cursor: 'pointer', fontSize: '25px' }} />
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <FaTrash style={{ color: 'red', textAlign: 'center', fontSize: '25px', cursor: 'pointer' }} className="delete-icon" onClick={() => handleDelete(customer.id)} />
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

export default SiteMaster;
