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
    vehicleno: '',
    vehicletype: '',
    owner: '',
    insurancedetails: '',
    insuranceexpairydate: '',
    model: '',
};

const VehicleMaster = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [selectedDriverId, setSelectedDriverId] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState(null);

    const handleSelectChange = (value, name) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getVehicleRegistration');
            setCustomers(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message);
            toast.error(`Error fetching vehicles: ${error.message}`);
        }
    };

    const validateFormData = (data) => {
        const { vehicleno, vehicletype, owner, insurancedetails, insuranceexpairydate, model } = data;

        // Check for empty required fields
        if (
            !vehicleno ||
            !vehicletype ||
            !owner ||
            !insurancedetails ||
            !insuranceexpairydate ||
            !model
        ) {
            return 'All fields are mandatory';
        }

        // Validate the insurance expiry date (YYYY-MM-DD format)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(insuranceexpairydate)) {
            return 'Insurance expiry date must be in YYYY-MM-DD format';
        }

        // Validate model year (between 1900 and current year)
        const currentYear = new Date().getFullYear();
        const modelYear = parseInt(model, 10);
        if (isNaN(modelYear) || modelYear < 1900 || modelYear > currentYear) {
            return `Model year must be between 1900 and ${currentYear}`;
        }

        return null; // No errors
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let truncatedValue = value;
        if (name === 'owner') {
            // Remove non-alphabetical characters
            truncatedValue = value.replace(/[^a-zA-Z]/g, '');
        }
        setFormData({
            ...formData,
            [name]: truncatedValue,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateFormData(formData);
        if (validationError) {
            toast.error(validationError);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/vehicleRegistration', formData);

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

    const handleUpdate = async (e, id) => {
        e.preventDefault();

        const validationError = validateFormData(formData);
        if (validationError) {
            toast.error(validationError);
            return;
        }

        try {
            const response = await axios.put(`http://localhost:5000/updateVehicle/${id}`, formData);

            if (response.status === 200) {
                toast.success('Record updated successfully');
                fetchCustomers();
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error during update:', error);
            toast.error('Failed to update record');
        }
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
                    const response = await axios.delete(`http://localhost:5000/deleteVehicle/${id}`);
                    if (response.status === 200) {
                        toast.success('Record deleted successfully');
                        fetchCustomers(); // Refresh the list after deletion
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


    return (
        <>
            <Navbar />
            <Layout>
                <div className="registration-form-container">
                    <ToastContainer />
                    <h1 style={{ textAlign: 'center', fontSize: '30px', padding: '20px' }}><strong>Vehicle Registration</strong></h1>
                    <form>
                        {/* Form inputs */}

                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="vehicleno"
                                    placeholder='Vehicle No'
                                    value={formData.vehicleno}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <select value={formData.vehicletype} onChange={(e) => handleSelectChange(e.target.value, 'vehicletype')} className='select'>
                                    <option value="">Select Vehicle Type</option>
                                    <option value="Appartment">Truck</option>
                                    <option value="Tractor">Tractor</option>
                                    <option value="Bunglow">Dumper</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="owner"
                                    placeholder='Owner Name'
                                    value={formData.owner}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="insurancedetails"
                                    placeholder='Insurance Details'
                                    value={formData.insurancedetails}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="insuranceexpairydate"
                                    placeholder='Insurance Expairy Date'
                                    value={formData.insuranceexpairydate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="model"
                                    placeholder='Model Year'
                                    value={formData.model}
                                    onChange={handleChange}
                                    required
                                />
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
                                    <th>Vehicle No.</th>
                                    <th>Vehicle Type</th>
                                    <th>Insurance Details</th>
                                    <th>Owner Name</th>
                                    <th>Insurance Expairy Date</th>
                                    <th>model</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td>{customer.id}</td>
                                        <td>{customer.vehicleno}</td>
                                        <td>{customer.vehicletype}</td>
                                        <td>{customer.insurancedetails}</td>
                                        <td>{customer.owner}</td>
                                        <td>{customer.insuranceexpairydate}</td>
                                        <td>{customer.model}</td>
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

export default VehicleMaster;
