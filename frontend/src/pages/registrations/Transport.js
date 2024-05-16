import React, { useState } from 'react';
//import './Registration.css'; // Import your CSS file for styling
import Navbar from '../../component/Navbar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Layout from '../../component/Layout';

const Transport = () => {
    const initialFormData = {
        registrationname: '',
        mobile: '',
        email: '',
        address: '',
        nation: '',
        state: '',
        city: '',
        village: '',
        pincode: '',
        password: '',
        cpassword: '',
        profiletype: 'Transporter',
        altermobile: '',
        remarks: '',
        status: '',
        empcd: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSelectChange = (value, name) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        let errors = {};

        if (formData.city.trim() === '') {
            errors.city = "City field cannot be empty";
        }

        if (formData.pincode.trim() === '' || formData.pincode.trim().length !== 6 || !(/^\d+$/.test(formData.pincode))) {
            errors.pincode = "Pin Code must be a 6-digit number";
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleClear = () => {
        setFormData(initialFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/registration', formData);

            if (response.status === 200) {
                handleClear();
                //alert('Registration successful!');
                toast.success('Registration Successfull');
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error:', error);
            //alert('An error occurred, please try again later.');
            toast.error('Data Not Registered');
        }
    };


    return (
        <>
            <Navbar />
            <Layout>
            <div className="registration-form-container">
                <h1 style={{ textAlign: 'center', fontSize: '30px', padding: '20px' }}><strong>Transporter Registration</strong></h1>
                <form onSubmit={handleSubmit}>
                    <ToastContainer />
                    <div className="form-row">
                        <div className="form-group">
                            <input
                                type="text"
                                name="registrationname"
                                placeholder='Username'
                                value={formData.registrationname}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                placeholder='User Email'
                                value={formData.email}
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
                                placeholder='User Mobile No.'
                                value={formData.mobile}
                                onChange={handleChange}
                                pattern="[0-9]{10}"
                                required
                            />
                            <small>Mobile number must be 10 digits</small>
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="address"
                                placeholder='Address'
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <input
                                type="text"
                                name="nation"
                                placeholder='Enter Nationality'
                                value={formData.nation}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <select value={formData.state} onChange={(e) => handleSelectChange(e.target.value, 'state')} className='select'>
                                <option value="">Select State</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Goa">Goa</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <input
                                type="text"
                                name="city"
                                placeholder='City'
                                value={formData.city}
                                onChange={handleChange}
                            />
                            {errors.city && <div className="error">{errors.city}</div>}
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="village"
                                placeholder='Select Village'
                                value={formData.village}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <input
                                type="text"
                                name="pincode"
                                placeholder='Pin Code'
                                value={formData.pincode}
                                onChange={handleChange}

                            />
                            {errors.pin && <div className="error">{errors.pin}</div>}
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                name="password"
                                placeholder='Password'
                                value={formData.password}
                                onChange={handleChange}
                                minLength="4"
                                required
                            />
                            <small>Password must be at least 6 characters</small>
                        </div>

                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <input
                                type="password"
                                name="cpassword"
                                placeholder='Confirm Password'
                                value={formData.cpassword}
                                onChange={handleChange}
                                minLength="4"
                                required
                            />
                            <small>Password must be at least 6 characters</small>
                        </div>
                        <div className="form-group">
                            <select value={formData.profiletype} onChange={(e) => handleSelectChange(e.target.value, 'profiletype')} className='select'>
                                <option value="">Select Profile Type</option>
                                <option value="Transporter">Transporter</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <input
                                type="text"
                                name="altermobile"
                                placeholder='Alternate Mobile No.'
                                value={formData.altermobile}
                                onChange={handleChange}
                                pattern="[0-9]{10}"
                                required
                            />
                            <small>Mobile number is 10 digit</small>
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="remarks"
                                placeholder='Remark'
                                value={formData.remarks}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <select value={formData.status} onChange={(e) => handleSelectChange(e.target.value, 'status')} className='select'>
                                <option value="">Select Status</option>
                                <option value="Active">Active</option>
                                <option value="Pending">Pending</option>
                                <option value="Suspended">Suspended</option>
                                <option value="Deactive">Deactive</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="empcd"
                                placeholder='Employee Code'
                                value={formData.empcd}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    {/* Add more rows for other fields */}
                    <div className=" button-container">
                        <button className='btn btn-primary'>Register</button>
                        <button className='btn btn-warning' onClick={handleClear} style={{ marginLeft: '1rem' }}>Clear</button>
                    </div>
                </form>
            </div>
            </Layout>
        </>
    )
}

export default Transport
