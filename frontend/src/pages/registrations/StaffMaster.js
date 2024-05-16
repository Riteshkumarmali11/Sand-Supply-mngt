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
    name: '',
    mobile: '',
    joiningdate: '',
    email: '',
    payment: ''
};

const StaffMaster = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [selectedStaffId, setSelectedStaffId] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getStaffRegistration');
            setCustomers(response.data.data);
        } catch (error) {
            console.error('Error fetching staff:', error);
            toast.error(`Error fetching staff: ${error.message}`);
        }
    };

    const handleEdit = (customer) => {
        setFormData({
            name: customer.name,
            mobile: customer.mobile,
            joiningdate: customer.joiningdate,
            email: customer.email,
            payment: customer.payment,
        });
        setSelectedStaffId(customer.id); // Store the ID of the record being edited
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/staffRegistration', formData);

            if (response.status === 200) {
                handleClear();
                toast.success('Registration Successful');
                fetchCustomers(); // Refresh the list after adding a new record
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            toast.error('Data Not Registered');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        if (!selectedStaffId) {
            toast.error("No record selected for update");
            return;
        }

        try {
            const response = await axios.put(`http://localhost:5000/updateStaff/${selectedStaffId}`, formData);

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
                    const response = await axios.delete(`http://localhost:5000/deleteStaff/${id}`);
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
        setSelectedStaffId(null); // Clear the ID of the record being edited
    };

    return (
        <>
            <Navbar />
            <Layout>
                <div className="registration-form-container">
                    <ToastContainer />
                    <h1 style={{ textAlign: 'center', fontSize: '30px', padding: '20px' }}>
                        <strong>Staff Registration</strong>
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder='Name'
                                    value={formData.name}
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="mobile"
                                    placeholder='Mobile No.'
                                    value={formData.mobile}
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="joiningdate"
                                    placeholder='Joining Date'
                                    value={formData.joiningdate}
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder='Email'
                                    value={formData.email}
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="payment"
                                    placeholder='Payment'
                                    required
                                    value={formData.payment}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='form-group'></div>
                        </div>

                        <div className="button-container mb-3">
                            <button className="btn btn-primary" type="submit">
                                Save
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleUpdate}
                                style={{ marginLeft: '1rem' }}
                            >
                                Update
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
                                    <th>Name</th>
                                    <th>Mobile</th>
                                    <th>Joining Date</th>
                                    <th>Email</th>
                                    <th>Payment</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td>{customer.id}</td>
                                        <td>{customer.name}</td>
                                        <td>{customer.mobile}</td>
                                        <td>{customer.joiningdate}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.payment}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <FaEdit
                                                    onClick={() => handleEdit(customer)}
                                                    style={{ color: 'green', cursor: 'pointer', fontSize: '25px' }}
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <FaTrash
                                                    style={{ color: 'red', fontSize: '25px', cursor: 'pointer' }}
                                                    onClick={() => handleDelete(customer.id)}
                                                />
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

export default StaffMaster;
