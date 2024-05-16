import React, { useEffect, useState } from 'react';
import Navbar from '../../component/Navbar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import SweetAlert from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const SalesnonAvailable = () => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toLocaleTimeString(),
        salesmanmobile: '',
        sitename: '',
        siteaddress: '',
        buildername: '',
        architecturename: '',
        mobile: '',
        appointdate: '',
        appointtime: ''
    });

    const [customers, setCustomers] = useState([]);
    const [selectedDriverId, setSelectedDriverId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        const { appointdate, appointtime } = formData;
        if (appointdate && appointtime) {
            const appointmentDateTime = new Date(`${appointdate}T${appointtime}`);
            const oneHourPrior = new Date(appointmentDateTime.getTime() - 24 * 60 * 60 * 1000);
            const currentTime = new Date();

            if (oneHourPrior > currentTime) {
                const timeout = oneHourPrior.getTime() - currentTime.getTime();
                const timer = setTimeout(() => {
                    notifyAppointment();
                }, timeout);

                return () => clearTimeout(timer);
            }
        }
    }, [formData.appointdate, formData.appointtime]);

    const notifyAppointment = () => {
        if (Notification.permission === "granted") {
            new Notification("Appointment Reminder", {
                body: "Your appointment is scheduled for one day from now."
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {
                    new Notification("Appointment Reminder", {
                        body: "Your appointment is scheduled for one day from now."
                    });
                }
            });
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getBuilderNotAvailable');
            setCustomers(response.data.data);
        } catch (error) {
            setError(error.message);
        }
    };

    const validateFormData = (data) => {
        const { date, time, salesmanmobile, sitename, siteaddress, buildername, architecturename, mobile, appointdate, appointtime } = data;

        if (!date || !time || !salesmanmobile || !sitename || !siteaddress || !buildername || !architecturename || !mobile || !appointdate || !appointtime) {
            return 'All fields are mandatory';
        }

        if (!/^\d{10}$/.test(mobile)) {
            return 'Mobile number must be a 10-digit numerical value';
        }

        if (!/^\d{10}$/.test(salesmanmobile)) {
            return 'Mobile number must be a 10-digit numerical value';
        }

        return null; // No validation errors
    };

    const handleClear = () => {
        setFormData(formData);
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
            const response = await axios.post('http://localhost:5000/builderNotAvailableRegistration', formData);

            if (response.status === 200) {
                handleClear();
                toast.success('Registration Successful');
                fetchCustomers();
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Data Not Registered');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let truncatedValue = value;

        // Apply specific validation for mobile and gstno fields
        if (name === 'mobile' || name==='salesmanmobile') {
            // Remove non-digit characters
            truncatedValue = value.replace(/[^\d]/g, '');
            // Limit the length of mobile and gstno to 10 characters
            truncatedValue = truncatedValue.slice(0, 10);
        }

        // Apply specific validation for suppliername, architectname, and pan fields
        if (name === 'buildername' || name === 'architecturename') {
            // Remove non-alphabetical characters
            truncatedValue = value.replace(/[^a-zA-Z]/g, '');
        } 
        // Update the form data with the truncated value
        setFormData({
            ...formData,
            [name]: truncatedValue,
        })
};


    const handleUpdate = async (e, id) => {
        e.preventDefault();

        const validationError = validateFormData(formData);
        if (validationError) {
            toast.error(validationError);
            return;
        }
        try {
            const response = await axios.put(`http://localhost:5000/updateBuilderNotAvailable/${id}`, formData);

            if (response.status === 200) {
                toast.success('Record Updated Successfully');
                fetchCustomers(); // Update the list of customers after updating
                console.log("Success", response);
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
                    const response = await axios.delete(`http://localhost:5000/deleteBuilderNotAvailable/${id}`);
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

            <div className="registration-form-container">
                <ToastContainer />
                <h1 style={{ textAlign: 'center', fontSize: '30px', padding: '20px' }}><strong>Salesman Site Visit Builder Meeting Schedule</strong></h1>
                <form onSubmit={handleSubmit}>
                    {/* Form inputs */}
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
                            <input
                                type="text"
                                name="salesmanmobile"
                                placeholder='Salesman Mobile No.'
                                value={formData.salesmanmobile}
                                onChange={handleChange}
                                required
                            />
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
                                name="architecturename"
                                placeholder='Architecture Name'
                                value={formData.architecturename}
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
                            <label>Select Appointment Date</label>
                            <input type="date" name='appointdate' value={formData.appointdate} onChange={handleChange} style={{ width: '100%' }} />
                        </div>
                        <div className="form-group">
                            <label>Select Appointment Time</label>
                            <input type="time" name='appointtime' value={formData.appointtime} onChange={handleChange} style={{ width: '50%' }} />
                        </div>
                    </div>

                    <div className=" button-container mb-3">
                        <button className='btn btn-primary' type="submit">Submit</button>
                        <button className='btn btn-primary' onClick={(e) => handleUpdate(e, selectedDriverId)} style={{ marginLeft: '1rem' }}>Update</button>
                        <button className='btn btn-warning' onClick={handleClear} style={{ marginLeft: '1rem' }}>Clear</button>
                    </div>
                </form >
                <div className="table-container">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>C.DATE</th>
                                <th>C.TIME</th>
                                <th>Salesman Mobile No.</th>
                                <th>Site Name</th>
                                <th>Site Address</th>
                                <th>Builder Name</th>
                                <th>A Name</th>
                                <th>Mobile</th>
                                <th>Appoint Date</th>
                                <th>Appoint Time</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>{customer.id}</td>
                                    <td>{customer.date}</td>
                                    <td>{customer.time}</td>
                                    <td>{customer.salesmanmobile}</td>
                                    <td>{customer.sitename}</td>
                                    <td>{customer.siteaddress}</td>
                                    <td>{customer.buildername}</td>
                                    <td>{customer.architecturename}</td>
                                    <td>{customer.mobile}</td>
                                    <td>{customer.appointdate}</td>
                                    <td>{customer.appointtime}</td>
                                    <td>
                                        <FaEdit style={{ color: 'green', textAlign: 'center', fontSize: '25px', cursor: 'pointer' }} className="edit-icon" onClick={() => handleEdit(customer)} />
                                    </td>
                                    <td>
                                        <FaTrash style={{ color: 'red', textAlign: 'center', fontSize: '25px', cursor: 'pointer' }} className="delete-icon" onClick={() => handleDelete(customer.id)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </>
    );
};

export default SalesnonAvailable;
