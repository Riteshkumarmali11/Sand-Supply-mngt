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
    typeofsand: '',
    price: '',
    unit: '',
    state: 'maharashtra',
    hsncode: '',
    gst: '',
    igst: '',
    sgst: '',
    cgst: '',
};

const SupplyMaster = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [customers, setCustomers] = useState([]);
    const [selectedDriverId, setSelectedDriverId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getMaterialRegistration');
            setCustomers(response.data.data);
        } catch (error) {
            setError(error.message);
            toast.error(`Error fetching data: ${error.message}`);
        }
    };

    const validateFormData = (data) => {
        const { typeofsand, price, unit, state, hsncode, gst, igst, sgst, cgst } = data;

        // Check if all required fields are filled
        if (!typeofsand || !price || !unit || !state || !hsncode || !gst) {
            return 'All fields are mandatory';
        }

        // Check if price is a valid number
        if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            return 'Price must be a valid positive number';
        }

        // Validate HSN code (4-8 digits)
        if (!/^\d{4,8}$/.test(hsncode)) {
            return 'HSN code must be 4-8 digits';
        }

        // Validate GST-related fields
        const isValidPercentage = (value) => {
            const num = parseFloat(value);
            return !isNaN(num) && num >= 0 && num <= 100;
        };

        if (!isValidPercentage(gst)) {
            return 'GST must be a percentage between 0 and 100';
        }

        if (state !== 'maharashtra' && (!igst || !isValidPercentage(igst))) {
            return 'IGST must be a percentage between 0 and 100';
        }

        if (state === 'maharashtra' && (!sgst || !isValidPercentage(sgst) || !cgst || !isValidPercentage(cgst))) {
            return 'SGST and CGST must be percentages between 0 and 100';
        }

        return null; // No validation errors
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let truncatedValue = value;

        // Apply specific validation for mobile and gstno fields
        if (name === 'price' || name === 'hsncode' || name == 'gst' || name === 'igst' || name == 'cgst' || name == 'sgst') {
            // Remove non-digit characters
            truncatedValue = value.replace(/[^\d]/g, '');
            // Limit the length of mobile and gstno to 10 characters
            truncatedValue = truncatedValue.slice(0, 10);
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
            const response = await axios.post('http://localhost:5000/materialRegistration', formData);

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
            const response = await axios.put(`http://localhost:5000/updateMaterial/${id}`, formData);

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
                    const response = await axios.delete(`http://localhost:5000/deleteMaterial/${id}`);
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

    const handleSelectChange = (value, name) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <>
            <Navbar />
            <Layout>
                <div className="registration-form-container">
                    <ToastContainer />
                    <h1 style={{ textAlign: 'center', fontSize: '30px', padding: '20px' }}><strong>Material Registration</strong></h1>
                    <form>
                        {/* Form inputs */}

                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="typeofsand"
                                    placeholder='Material Name'
                                    value={formData.typeofsand}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="price"
                                    placeholder='Price'
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <select value={formData.unit} onChange={(e) => handleSelectChange(e.target.value, 'unit')} className='select'>
                                    <option value="">Select Unit</option>
                                    <option value="Brass">Brass</option>
                                    <option value="Tonn">Tonn</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <select value={formData.state} onChange={(e) => handleSelectChange(e.target.value, 'state')} className='select'>
                                    <option value="">Select State</option>
                                    <option value="maharashtra">Maharashtra</option>
                                    <option value="karnataka">Karnataka</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="hsncode"
                                    placeholder='HSN Code'
                                    value={formData.hsncode}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="gst"
                                    placeholder='GST %'
                                    value={formData.gst}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {formData.state !== 'maharashtra' && (
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="igst"
                                        placeholder='IGST %'
                                        value={formData.igst}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}
                            {formData.state === 'maharashtra' && (
                                <>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            name="sgst"
                                            placeholder='SGST %'
                                            value={formData.sgst}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            name="cgst"
                                            placeholder='CGST %'
                                            value={formData.cgst}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </>
                            )}
                        </div>


                        <div className=" button-container mb-3">
                            <button className='btn btn-primary' onClick={handleSubmit}>Save</button>
                            <button className='btn btn-primary' onClick={(e) => handleUpdate(e, selectedDriverId)} style={{ marginLeft: '1rem' }}>Update</button>
                            <button className='btn btn-warning' onClick={handleClear} style={{ marginLeft: '1rem' }}>Clear</button>
                        </div>
                    </form >
                    <div className="table-container">
                        <table className="styled-table">
                            <thead style={{ textAlign: 'center' }}>
                                <tr>
                                    <th>ID</th>
                                    <th>Sand Type</th>
                                    <th>Price</th>
                                    <th>Unit</th>
                                    <th>State</th>
                                    <th>HSN Code</th>
                                    <th>GST %</th>
                                    <th>SGST</th>
                                    <th>CGST</th>
                                    <th>Update</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td>{customer.id}</td>
                                        <td>{customer.typeofsand}</td>
                                        <td>{customer.price}</td>
                                        <td>{customer.unit}</td>
                                        <td>{customer.state}</td>
                                        <td>{customer.hsncode}</td>
                                        <td>{customer.gst}</td>
                                        <td>{customer.sgst}</td>
                                        <td>{customer.cgst}</td>
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
