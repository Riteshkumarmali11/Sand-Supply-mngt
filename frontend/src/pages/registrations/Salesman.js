import React, { useEffect, useState } from 'react';
import Navbar from '../../component/Navbar';
import Layout from '../../component/Layout';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import SweetAlert from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import './registration.css';

const initialFormData = {
    username: '',
    address: '',
    mobile: '',
    altermobile: '',
    aadhar: '',
    email: '',
    password: '',
    cpassword: '',
};

const Salesman = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [isFormValid, setIsFormValid] = useState(false);
    const [selectedDriverId, setSelectedDriverId] = useState(null);
    // const [isEditing, setIsEditing] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [errors, setErrors] = useState({}); // Stores validation errors

    useEffect(() => {
        fetchCustomers(); // Fetch existing salesmen on component mount
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getSalesmanRegistration');
            setCustomers(response.data.data);
        } catch (error) {
            toast.error(`Error fetching customers: ${error.message}`);
        }
    };

    const validateFormData = (data) => {
        const { username, address, mobile, altermobile, aadhar, email, password, cpassword } = data;

        // Check for empty required fields
        if (!username || !address || !mobile || !altermobile || !aadhar || !email || !password || !cpassword) {
            return 'All fields are mandatory';
        }
        if (!/^\d{10}$/.test(mobile)) {
            return 'Mobile number must be a 10-digit numerical value';
        }
        if (!/^\d{10}$/.test(altermobile)) {
            return 'Alternate Mobile number must be a 10-digit numerical value';
        }
        if (!/^\d{12}$/.test(aadhar)) {
            return 'Aadhar must be a 12-digit number';
        }
        if (password !== cpassword) {
            return 'Passwords do not match';
        }

        return null; // No errors
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Apply specific validation for mobile, altermobile, and aadhar fields
        let truncatedValue = value;
        if (name === 'username') {
            // Remove non-alphabetical characters
            truncatedValue = value.replace(/[^a-zA-Z]/g, '');
        } else
            if (['mobile', 'altermobile', 'aadhar'].includes(name)) {
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
            const response = await axios.post('http://localhost:5000/salesmanRegistration', formData);

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
            const response = await axios.put(`http://localhost:5000/updateSalesman/${id}`, formData);

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
                    const response = await axios.delete(`http://localhost:5000/deleteSalesman/${id}`);
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
                    <h1 style={{ textAlign: 'center', fontSize: '30px', padding: '20px' }}>
                        <strong>Salesman Registration</strong>
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Salesman Name"
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
                                    placeholder="Mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.mobile && (
                                    <span className="error-message">{errors.mobile}</span>
                                )}
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="altermobile"
                                    placeholder="Alternate Mobile"
                                    value={formData.altermobile}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.mobile && (
                                    <span className="error-message">{errors.mobile}</span>
                                )}
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="aadhar"
                                    placeholder="Aadhar"
                                    value={formData.aadhar}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    name="cpassword"
                                    placeholder="Confirm Password"
                                    value={formData.cpassword}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.passwordMismatch && (
                                    <span className="error-message">{errors.passwordMismatch}</span>
                                )}
                            </div>
                            <div className="form-group">

                            </div>
                        </div>
                        <div className="button-container mb-3">
                            <button
                                type="submit"
                                className="btn btn-primary ml-2"

                            >
                                Save
                            </button>
                            <button
                                className="btn btn-primary ml-2"
                                onClick={(e) => handleUpdate(e, selectedDriverId)}
                            >
                                Update
                            </button>
                            <button
                                className="btn btn-warning ml-3"
                                onClick={handleClear}
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
                                    <th>Salesman Name</th>
                                    <th>Address</th>
                                    <th>Mobile</th>
                                    <th>Alternate Mobile</th>
                                    <th>Aadhar</th>
                                    <th>Email</th>
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
                                        <td>{customer.altermobile}</td>
                                        <td>{customer.aadhar}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.password}</td>
                                        <td>{customer.cpassword}</td>
                                        <td>
                                            <FaEdit
                                                className="edit-icon"
                                                style={{ color: 'green', cursor: 'pointer' }}
                                                onClick={() => handleEdit(customer)}
                                            />
                                        </td>
                                        <td>
                                            <FaTrash
                                                className="delete-icon"
                                                style={{ color: 'red', cursor: 'pointer' }}
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

export default Salesman;
