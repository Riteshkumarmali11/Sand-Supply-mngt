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
    companyname: '',
    companyaddress: '',
    ownername: '',
    username: '',
    mobile: '',
    altermobile: '',
    email: '',
    panno: '',
    gstno: '',
    bankname: '',
    ifsccode: '',
    accountno: '',
    openingbalance: ''
};

const VendorRegistration = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [selectedVendorId, setSelectedVendorId] = useState(null); // For tracking the selected record
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCustomers(); // Fetch the vendor list when the component mounts
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getVendor');
            setCustomers(response.data.data);
        } catch (error) {
            console.error('Error fetching vendors:', error);
            toast.error(`Error fetching vendors: ${error.message}`);
        }
    };

    const handleEdit = (customer) => {
        setFormData({
            companyname: customer.companyname,
            companyaddress: customer.companyaddress,
            ownername: customer.ownername,
            username: customer.username,
            mobile: customer.mobile,
            altermobile: customer.altermobile,
            email: customer.email,
            panno: customer.panno,
            gstno: customer.gstno,
            bankname: customer.bankname,
            ifsccode: customer.ifsccode,
            accountno: customer.accountno,
            openingbalance: customer.openingbalance,
        });
        setSelectedVendorId(customer.id); // Set the ID of the record being edited
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        const validationError = validateFormData(formData);
        if (validationError) {
            toast.error(validationError);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/vendorRegistration', formData);

            if (response.status === 200) {
                handleClear(); // Reset the form data
                toast.success('Registration Successful');
                fetchCustomers(); // Refresh the list of vendors
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            toast.error('Data not registered');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const validationError = validateFormData(formData);
        if (validationError) {
            toast.error(validationError);
            return;
        }

    
        try {
            const response = await axios.put(
                `http://localhost:5000/updateVendor/${selectedVendorId}`,
                formData
            );
    
            if (response.status === 200) {
                toast.success('Record updated successfully');
                fetchCustomers(); // Refresh the list after updating
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
                    const response = await axios.delete(`http://localhost:5000/deleteVendor/${id}`);
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
        setFormData(initialFormData); // Reset the form data
        setSelectedVendorId(null); // Reset the selected ID
    };

    const validateFormData = (data) => {
        const { companyname, companyaddressa, ownername, mobile, username, altermobile, email, panno, gstno, bankname, ifsccode, accountno, openingbalance } = data;

        if (!companyname || !companyaddressa || !mobile || !ownername || !username || !altermobile || !email || !panno || !gstno || !bankname || !ifsccode || !accountno || !openingbalance) {
            return 'All fields are mandatory';
        }

        if (!/^\d{10}$/.test(mobile)) {
            return 'Mobile number must be a 10-digit numerical value';
        }
        if (!/^\d{20}$/.test(accountno)) {
            return 'Invalid account No...';
        }
        if (!/^\d{10}$/.test(altermobile)) {
            return 'Alter Mobile number must be a 10-digit numerical value';
        }
        if (!/^\d{10}$/.test(openingbalance)) {
            return 'must be in number';
        }

        return null; // No validation errors
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let truncatedValue = value;

        // Apply specific validation for mobile and gstno fields
        if (name === 'mobile' ||name==='altermobile' || name === 'openingbalance') {
            // Remove non-digit characters
            truncatedValue = value.replace(/[^\d]/g, '');
            // Limit the length of mobile and gstno to 10 characters
            truncatedValue = truncatedValue.slice(0, 10);
        }
        if (name === 'accountno') {
            // Remove non-digit characters
            truncatedValue = value.replace(/[^\d]/g, '');
            // Limit the length of mobile and gstno to 10 characters
            truncatedValue = truncatedValue.slice(0, 20);
        }

        // Apply specific validation for suppliername, architectname, and pan fields
        if (name === 'companyname' || name === 'ownername' || name==='username' || name==='bankname') {
            // Remove non-alphabetical characters
            truncatedValue = value.replace(/[^a-zA-Z]/g, '');
        } else if (name === 'panno') {
            // Remove non-alphanumeric characters
            truncatedValue = value.replace(/[^a-zA-Z0-9]/g, '');
            // Limit the length of PAN to 10 characters
            truncatedValue = truncatedValue.slice(0, 10).toUpperCase(); // Ensure uppercase
        }else if (name === 'gstno' || name==='ifsccode') {
            // Remove non-alphanumeric characters
            truncatedValue = value.replace(/[^a-zA-Z0-9]/g, '');
            // Limit the length of PAN to 10 characters
            truncatedValue = truncatedValue.slice(0, 20).toUpperCase(); // Ensure uppercase
        }

        // Update the form data with the truncated value
        setFormData({
            ...formData,
            [name]: truncatedValue,
        });
    };
    

    return (
        <>
            <Navbar />
            <Layout>
                <div className="registration-form-container">
                    <ToastContainer />
                    <h1 style={{ textAlign: 'center', fontSize: '30px', padding: '20px' }}>
                        <strong>Vendor Registration</strong>
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="companyname"
                                    placeholder="Company Name"
                                    required
                                    value={formData.companyname}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="companyaddress"
                                    placeholder="Company Address"
                                    required
                                    value={formData.companyaddress}
                                    onChange={handleChange}
                                />
                            </div>
                            <div class="form-group">
                                <input
                                    type="text"
                                    name="ownername"
                                    required
                                    placeholder="Owner Name"
                                    value={formData.ownername}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div class="form-group">
                                <input
                                    type="text"
                                    name="mobile"
                                    placeholder="Mobile No."
                                    required
                                    value={formData.mobile}
                                    onChange={handleChange}
                                />
                            </div>
                            <div class="form-group">
                                <input
                                    type="text"
                                    name="altermobile"
                                    required
                                    placeholder="Alternate Mobile No."
                                    value={formData.altermobile}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div class="form-group">
                                <input
                                    type="text"
                                    name="panno"
                                    required
                                    placeholder="PAN No."
                                    value={formData.panno}
                                    onChange={handleChange}
                                />
                            </div>
                            <div class="form-group">
                                <input
                                    type="text"
                                    name="gstno"
                                    required
                                    placeholder="GST No."
                                    value={formData.gstno}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <input
                                    type="text"
                                    name="bankname"
                                    required
                                    placeholder="Bank Name"
                                    value={formData.bankname}
                                    onChange={handleChange}
                                />
                            </div>
                            <div class="form-group">
                                <input
                                    type="text"
                                    name="ifsccode"
                                    required
                                    placeholder="IFSC Code"
                                    value={formData.ifsccode}
                                    onChange={handleChange}
                                />
                            </div>
                            <div class="form-group">
                                <input
                                    type="text"
                                    name="accountno"
                                    required
                                    placeholder="Account No."
                                    value={formData.accountno}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <input
                                    type="text"
                                    name="openingbalance"
                                    required
                                    placeholder="Opening Balance"
                                    value={formData.openingbalance}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='form-group'></div>
                            <div className='form-group'></div>
                        </div>

                        <div className="button-container mb-3">
                            <button className="btn btn-primary" type="submit">
                                Save
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={(e) => {
                                    handleUpdate(e);
                                }}
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
                                    <th>Company Name</th>
                                    <th>Company Address</th>
                                    <th>Owner Name</th>
                                    <th>Mobile</th>
                                    <th>Alter Mobile</th>
                                    <th>Email</th>
                                    <th>Pan No.</th>
                                    <th>GST No.</th>
                                    <th>Bank Name</th>
                                    <th>IFSC Code</th>
                                    <th>Account No.</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td>{customer.id}</td>
                                        <td>{customer.companyname}</td>
                                        <td>{customer.companyaddress}</td>
                                        <td>{customer.ownername}</td>
                                        <td>{customer.mobile}</td>
                                        <td>{customer.altermobile}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.panno}</td>
                                        <td>{customer.gstno}</td>
                                        <td>{customer.bankname}</td>
                                        <td>{customer.ifsccode}</td>
                                        <td>{customer.accountno}</td>
                                        <td>
                                            <FaEdit
                                                style={{ color: 'green', fontSize: '25px', cursor: 'pointer' }}
                                                onClick={() => handleEdit(customer)}
                                            />
                                        </td>
                                        <td>
                                            <FaTrash
                                                style={{ color: 'red', fontSize: '25px', cursor: 'pointer' }}
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

export default VendorRegistration;
