import React, { useEffect, useState } from 'react';
import './registration.css';
import Navbar from '../../component/Navbar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Layout from '../../component/Layout';
import { FaEdit, FaTrash, FaSave } from 'react-icons/fa';
import SweetAlert from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const initialFormData = {
    username: '',
    address: '',
    mobile: '',
    licenceno: '',
    aadhar: '',
    expairydate: '',
    password: '',
    cpassword: ''
};

const DriverMaster = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [selectedDriverId, setSelectedDriverId] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getDriverRegistrations');
            setCustomers(response.data.data);
        } catch (error) {
            console.error('Error fetching drivers:', error);
            toast.error(`Error fetching drivers: ${error.message}`);
        }
    };

    const validateFormData = (data) => {
        const { username, address, mobile, licenceno, aadhar, expairydate, password, cpassword } = data;

        if (!username || !address || !mobile || !licenceno || !aadhar || !expairydate || !password || !cpassword) {
            return 'All fields are mandatory';
        }

        if (!/^\d{10}$/.test(mobile)) {
            return 'Mobile number must be a 10-digit numerical value';
        }

        if (!/^\d{12}$/.test(aadhar)) {
            return 'Aadhar must be a 12-digit number';
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(expairydate)) {
            return 'Expiry date must be in YYYY-MM-DD format';
        }

        if (password !== cpassword) {
            return 'Passwords do not match';
        }

        return null; // No validation errors
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Apply specific validation for mobile, altermobile, and aadhar fields
        let truncatedValue = value;
        if (name === 'username') {
            // Remove non-alphabetical characters
            truncatedValue = value.replace(/[^a-zA-Z]/g, '');
        } else
            if (['mobile', 'aadhar'].includes(name)) {
                // Remove non-digit characters
                truncatedValue = value.replace(/[^\d]/g, '');
                // Limit the length of mobile, altermobile, and aadhar to 10 and 12 digits respectively
                const maxLength = name === 'aadhar' ? 12 : 10;
                truncatedValue = truncatedValue.slice(0, maxLength);
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
            const response = await axios.post('http://localhost:5000/driverRegistration', formData);

            if (response.status === 200) {
                handleClear();
                toast.success('Registration Successful');
                fetchCustomers();
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            toast.error('Data not registered');
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
            const response = await axios.put(`http://localhost:5000/updateDriver/${id}`, formData);

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
                    const response = await axios.delete(`http://localhost:5000/deleteDriver/${id}`);
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

    return (
        <>
            <Navbar />
            <Layout>
                <div className="registration-form-container">
                    <ToastContainer />
                    <h1 style={{ textAlign: 'center', fontSize: '30px', padding: '20px' }}>
                        <strong>Driver Registration</strong>
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Driver Name"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="mobile"
                                    placeholder="Mobile No."
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="licenceno"
                                    placeholder="Licence No"
                                    value={formData.licenceno}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div class="form-group">
                                <input
                                    type="text"
                                    name="aadhar"
                                    placeholder="Aadhar No."
                                    value={formData.aadhar}
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="expairydate"
                                    placeholder="Licence Expiry Date (YYYY-MM-DD)"
                                    value={formData.expairydate}
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div class="form-group">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div class="form-group">
                                <input
                                    type="password"
                                    name="cpassword"
                                    placeholder="Confirm Password"
                                    required
                                    value={formData.cpassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="button-container mb-3">
                            <button
                                className="btn btn-primary"
                                type="submit"
                            >
                                <FaSave className="icon" />
                                <span>Save</span>
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={(e) => handleUpdate(e, selectedDriverId)}
                                style={{ marginLeft: '1rem' }}
                            >
                                <FaEdit className="icon" />
                                <span>Update</span>
                            </button>
                            <button
                                className="btn btn-warning"
                                onClick={handleClear}
                                style={{ marginLeft: '1rem' }}
                            >
                                Clear
                            </button>
                        </div>
                    </form>
                    <div className="table-container">
                        <table className="styled-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Driver Name</th>
                                    <th>Address</th>
                                    <th>Mobile No.</th>
                                    <th>Licence No.</th>
                                    <th>Aadhar No.</th>
                                    <th>Licence Expiry Date</th>
                                    <th>Password</th>
                                    <th>Confirm Password</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td>{customer.id}</td>
                                        <td>{customer.username}</td>
                                        <td>{customer.address}</td>
                                        <td>{customer.mobile}</td>
                                        <td>{customer.licenceno}</td>
                                        <td>{customer.aadhar}</td>
                                        <td>{customer.expairydate}</td>
                                        <td>{customer.password}</td>
                                        <td>{customer.cpassword}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <FaEdit
                                                className="edit-icon"
                                                style={{ color: 'green', cursor: 'pointer', fontSize: '25px' }}
                                                onClick={() => handleEdit(customer)}
                                            />
                                        </td>
                                        <td>
                                            <FaTrash
                                                style={{ color: 'red', cursor: 'pointer', fontSize: '25px' }}
                                                onClick={() => handleDelete(customer.id)}
                                            />
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

export default DriverMaster;
