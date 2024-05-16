import React, { useEffect, useState } from 'react';
import { RiShoppingCartLine, RiShoppingBasketLine } from 'react-icons/ri';
import Navbar from '../../component/Navbar';
import Layout from '../../component/Layout';
import { ToastContainer, toast } from 'react-toastify';
import { RiArrowRightSLine } from 'react-icons/ri';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import ModalLayout from '../../component/ModalLayout';

const Ledger = () => {

    const [salesModalIsOpen, setSalesModalIsOpen] = useState(false);
    const [purchaseModalIsOpen, setPurchaseModalIsOpen] = useState(false);
    const [registrations, setRegistrations] = useState([]);
    const [purchase, setPurchase] = useState([]);
    const [selectedOwnerName, setSelectedOwnerName] = useState('');
    const [selectSiteName, setSelectSiteName] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [receivedAmount, setTotalAmount] = useState(0);
    const [tAmount, setTAmount] = useState(0);

    const [formData, setFormData] = useState({
        id: '',
        invoiceno: '',
        selectedOwnerName: '',
        recievedAmount: '',
        dueAmount: '',
        paymode: '',
        fromdate: '',
        status: '',
        openingbal: '',
    })

    const [purchseData, setPurchaseData] = useState({
        id: '',
        invoiceno: '',
        selectSiteName: '',
        payableAmount: '',
        dueAmount: '',
        paymode: '',
        paymentdate: '',
        status: '',
        openingbalance: ''
    })

    useEffect(() => {
        fetchOwnerNames();
        fetchData();
    }, []);

    const handleChange1 = (e) => {
        const { name, value } = e.target;

        setPurchaseData(prevState => ({
            ...prevState,
            [name]: value,
        }));

        if (name === 'selectSiteName') {
            setSelectSiteName(value);

            const selectedPurchase = purchase.find(purchase => purchase.companyname === value);
            if (selectedPurchase) {
                // Calculate total amount
                let tamount = 0;
                selectedPurchase.products.forEach(product => {
                    tamount += parseFloat(product.tamount);
                });
                // Update form data and total amount state
                setPurchaseData(prevState => ({
                    ...prevState,
                    tamount: tamount.toFixed(2),
                    id: selectedPurchase.id,
                    invoiceno: selectedPurchase.invoiceno,
                    openingbalance: selectedPurchase.openingbalance
                }));
                setTAmount(parseFloat(tamount.toFixed(2)));
            } else {
                setPurchaseData(prevState => ({
                    ...prevState,
                    openingbalance: '' // Reset opening balance if selected site not found
                }))
            }
        }

        if (name === 'payableAmount') {
            const payableAmount = parseFloat(value);
            const totalAmount = parseFloat(purchseData.tamount);

            if (!isNaN(payableAmount) && !isNaN(totalAmount)) {
                const dueAmount = totalAmount - payableAmount;
                setPurchaseData(prevState => ({
                    ...prevState,
                    payableAmount: value, // Update payable amount without rounding
                    dueAmount: dueAmount.toFixed(2), // Update due amount
                    status: dueAmount === 0 ? 'Done' : 'Pending', // Update status based on due amount
                }));
            }
        }
    };




    const fetchOwnerNames = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/getSales`);
            const { success, data } = response.data;
            if (success) {
                setRegistrations(data);
                console.log("getSales", response);
            } else {
                throw new Error('Backend response indicates failure');
            }
        } catch (error) {
            console.error('Error fetching owner names:', error);
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/getPurchase`);
            const { success, data } = response.data;
            if (success) {
                // Convert the object of objects into an array of objects
                const registrationsArray = Object.values(data);
                setPurchase(registrationsArray);
                console.log("Purchase", registrationsArray);
            } else {
                throw new Error('Backend response indicates failure');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));

        if (name === 'selectedOwnerName') {
            setSelectedOwnerName(value);

            const selectedRegistration = registrations.find(registration => registration.sitename === value);
            if (selectedRegistration) {
                // Calculate total amount with GST
                let totalAmountWithGST = 0;
                selectedRegistration.products.forEach(product => {
                    totalAmountWithGST += parseFloat(product.totalAmountWithGST);
                });
                // Update form data and total amount state
                setFormData(prevState => ({
                    ...prevState,
                    totalAmountWithGST: totalAmountWithGST.toFixed(2),
                    id: selectedRegistration.id,
                    invoiceno: selectedRegistration.invoiceno,
                    openingbal: selectedRegistration.openingbal
                }));
                setTotalAmount(parseFloat(totalAmountWithGST.toFixed(2)));
            } else {
                setFormData(prevState => ({
                    ...prevState,
                    openingbal: '' // Reset opening balance if selected owner not found
                }))
            }
        }

        if (name === 'recievedAmount') {
            const receivedAmount = parseFloat(value);
            const totalAmount = parseFloat(formData.totalAmountWithGST);

            if (!isNaN(receivedAmount) && !isNaN(totalAmount)) {
                const dueAmount = totalAmount - receivedAmount;
                setFormData(prevState => ({
                    ...prevState,
                    recievedAmount: value, // Update received amount without rounding
                    dueAmount: dueAmount.toFixed(2), // Update due amount
                    status: dueAmount === 0 ? 'Done' : 'Pending', // Update status based on due amount
                }));
            }
        }
    };


    useEffect(() => {
        const fetchOwnerNames = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/getSales`);
                const { success, data } = response.data;
                if (success) {
                    setRegistrations(data);

                    // Update opening balance based on fetched data
                    const selectedRegistration = data.find(registration => registration.sitename === selectedOwnerName);
                    if (selectedRegistration) {
                        setFormData(prevState => ({
                            ...prevState,
                            openingbal: selectedRegistration.openingbal // Update opening balance in form data
                        }));
                    } else {
                        console.log('Selected owner not found in data');
                    }

                    console.log("getSales", response);
                } else {
                    throw new Error('Backend response indicates failure');
                }
            } catch (error) {
                console.error('Error fetching owner names:', error);
            }
        };

        fetchOwnerNames();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/getPurchase`);
                const { success, data } = response.data;
                if (success) {
                    setPurchase(data);
                    console.log("UseEffect Purchas", data)
                    // Update opening balance based on fetched data
                    const selectedPurchase = data.find(purchase => purchase.companyname === selectSiteName);
                    if (selectedPurchase) {
                        // Autofetch opening balance
                        setPurchaseData(prevState => ({
                            ...prevState,
                            openingbalance: selectedPurchase.openingbalance
                        }));
                    } else {
                        console.log('Selected site not found in data');
                    }
                } else {
                    throw new Error('Backend response indicates failure');
                }
            } catch (error) {
                console.error('Error fetching purchase data:', error);
            }
        };

        fetchData();
    }, [selectSiteName]); // Run the effect whenever selectSiteName changes


    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const formattedOwnerName = `${selectedOwnerName} - ${formData.invoiceno}`;
            const response = await axios.post(
                `http://localhost:5000/salesInventoryRegister`,
                {
                    ...formData,
                    selectedOwnerName: formattedOwnerName,
                },
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                // Clear form fields upon successful submission
                setFormData({
                    id: '',
                    invoiceno: '',
                    selectedOwnerName: '',
                    recievedAmount: '',
                    dueAmount: '',
                    paymode: '',
                    fromdate: '',
                    status: '',
                    openingbal: '',
                });
                alert('Registration Saved Successfully');
                console.log("response", response);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Data Not Updated');
        }
    };

    const handlepurchasesave = async (e) => {
        e.preventDefault();
        try {
            const formattedOwnerName = `${selectSiteName} - ${purchseData.invoiceno}`;
            const response = await axios.post(
                `http://localhost:5000/purchaseInventoryRegister`,
                {
                    ...purchseData,
                    selectSiteName: formattedOwnerName,
                },
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                // Clear form fields upon successful submission
                setPurchaseData({
                    id: '',
                    invoiceno: '',
                    selectSiteName: '',
                    payableAmount: '',
                    dueAmount: '',
                    paymode: '',
                    paymentdate: '',
                    status: '',
                    openingbalance: ''
                });
                alert('Registration Saved Successfully');
                console.log("response", response);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Data Not Updated');
        }
    };


    return (
        <>
            <Navbar />
            <Layout>
                <div className="registration-form-container" style={{ backgroundColor: 'greenyallow', padding: '20px' }}>
                    <ToastContainer />
                    <h1 style={{ textAlign: 'center', fontSize: '30px', padding: '20px' }}><strong>Ledger</strong></h1>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <RiShoppingCartLine size={30} style={{ marginRight: '10px', color: 'red', cursor: 'pointer' }} onClick={() => setSalesModalIsOpen(true)} />
                        <div style={{ padding: '5px', cursor: 'pointer' }} onClick={() => setSalesModalIsOpen(true)}>Sales</div>
                        <RiArrowRightSLine size={30} style={{ marginRight: '10px', color: 'black' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <RiShoppingBasketLine size={30} style={{ marginRight: '10px', color: 'green', cursor: 'pointer' }} onClick={() => setPurchaseModalIsOpen(true)} />
                        <div style={{ padding: '5px', cursor: 'pointer' }} onClick={() => setPurchaseModalIsOpen(true)}>Purchase</div>
                        <RiArrowRightSLine size={30} style={{ marginRight: '10px', color: 'black' }} />
                    </div>
                </div>

                {/* Sales Modal */}
                <Modal
                    isOpen={salesModalIsOpen}
                    onRequestClose={() => setSalesModalIsOpen(false)}
                    contentLabel="Sales Transaction Modal"
                    style={{
                        content: {
                            width: '80%',
                            height: '60%',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)'
                        }
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h2>Transactions for Sales</h2>
                        <button style={{ backgroundColor: 'none', border: 'none', cursor: 'pointer', color: 'black' }} onClick={() => setSalesModalIsOpen(false)}>
                            <FaTimes />
                        </button>
                    </div>
                    <ModalLayout>
                        <div>
                            <form encType="multipart/form-data">
                                <div className='form-row'>
                                    <div className="form-group">
                                        <label>Select Site Name</label>
                                        <select style={{ width: '100%', height: '45px', border: '1px solid #ccc', borderRadius: '5px' }}
                                            name="selectedOwnerName" value={formData.selectedOwnerName} onChange={handleChange} required>
                                            <option value="">Select Site Name</option>
                                            {registrations.map((owner) => (
                                                <option key={owner.id} value={owner.sitename}>
                                                    {`${owner.sitename} - ${owner.invoiceno}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={`form-group ${isVisible ? '' : 'hidden'}`}>
                                        <input type="text" name='id' value={formData.id} onChange={handleChange} placeholder='Enter Received Amount' />
                                    </div>
                                    <div className={`form-group ${isVisible ? '' : 'hidden'}`}>
                                        <input type="text" name='invoiceno' value={formData.invoiceno} onChange={handleChange} />
                                    </div>
                                    <div className={`form-group`}>
                                        <label>Opening Bal.</label>
                                        <input type="text" name='openingbal' value={formData.openingbal} onChange={handleChange} />
                                    </div>
                                    <div className='form-group'>
                                        <label>Total Amount</label>
                                        <input type="text" name='totalAmountWithGST' value={formData.totalAmountWithGST} onChange={handleChange} placeholder='Enter Received Amount' />
                                    </div>
                                    <div className='form-group'>
                                        <label>Received Amount</label>
                                        <input type="text" name='recievedAmount' value={formData.recievedAmount} onChange={handleChange} placeholder='Enter Received Amount' />
                                    </div>
                                </div>
                                <div className='form-row'>
                                    <div className='form-group'>
                                        <label>Due Amount</label>
                                        <input type="text" name='dueAmount' value={formData.dueAmount} onChange={handleChange} placeholder='Enter Received Amount' />
                                    </div>
                                    <div className="form-group">
                                        <label>Received Payment Mode</label>
                                        <select value={formData.paymode} name='paymode' onChange={handleChange} className='select'>
                                            <option value="">Select Payment Mode</option>
                                            <option value="cash">Cash</option>
                                            <option value="NetBanking">Net Banking</option>
                                        </select>
                                    </div>
                                    <div className='form-group'>
                                        <label>Received Payment Date</label>
                                        <input type="date" name='fromdate' value={formData.fromdate} onChange={handleChange} style={{ width: '100%', height: '45px', border: '1' }} />
                                    </div>
                                    <div className='form-group'>
                                        <label>Status</label>
                                        <input type="text" name='status' value={formData.status} />
                                    </div>
                                </div>
                                <div>
                                    <button type="submit" className="btn btn-primary" onClick={handleSave}>
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </ModalLayout>
                </Modal>

                {/* Purchase Modal */}
                <Modal
                    isOpen={purchaseModalIsOpen}
                    onRequestClose={() => setPurchaseModalIsOpen(false)}
                    contentLabel="Purchase Transaction Modal"
                    style={{
                        content: {
                            width: '60%',
                            height: '60%',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)'
                        }
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h2>Transactions for Purchase</h2>
                        <button style={{ backgroundColor: 'none', border: 'none', cursor: 'pointer', color: 'black' }} onClick={() => setPurchaseModalIsOpen(false)}>
                            <FaTimes />
                        </button>
                    </div>
                    <ModalLayout>
                        <div>
                            <form encType="multipart/form-data">
                                <div className='form-row'>
                                    <div className="form-group">
                                        <label>Select Site Name</label>
                                        <select style={{ width: '100%', height: '45px', border: '1px solid #ccc', borderRadius: '5px' }}
                                            name="selectSiteName" value={purchseData.selectSiteName} onChange={handleChange1} required>
                                            <option value="">Select Site Name</option>
                                            {purchase.map((owner) => (
                                                <option key={owner.id} value={owner.companyname}>
                                                    {`${owner.companyname} - ${owner.invoiceno}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={`form-group ${isVisible ? '' : 'hidden'}`}>
                                        <input type="text" name='id' value={purchseData.id} onChange={handleChange1} placeholder='Enter Received Amount' />
                                    </div>
                                    <div className={`form-group ${isVisible ? '' : 'hidden'}`}>
                                        <input type="text" name='invoiceno' value={purchseData.invoiceno} onChange={handleChange1} />
                                    </div>
                                    <div className={`form-group`}>
                                        <label>Opening Bal.</label>
                                        <input type="text" name='openingbalance' value={purchseData.openingbalance} onChange={handleChange1} />
                                    </div>
                                    <div className='form-group'>
                                        <label>Total Amount</label>
                                        <input type="text" name='tamount' value={purchseData.tamount} onChange={handleChange1} placeholder='Enter Received Amount' />
                                    </div>
                                    <div className='form-group'>
                                        <label>Received Amount</label>
                                        <input type="text" name='payableAmount' value={purchseData.payableAmount} onChange={handleChange1} placeholder='Enter Received Amount' />
                                    </div>
                                </div>
                                <div className='form-row'>
                                    <div className='form-group'>
                                        <label>Due Amount</label>
                                        <input type="text" name='dueAmount' value={purchseData.dueAmount} onChange={handleChange1} placeholder='Enter Received Amount' />
                                    </div>
                                    <div className="form-group">
                                        <label>Received Payment Mode</label>
                                        <select value={purchseData.paymode} name='paymode' onChange={handleChange1} className='select'>
                                            <option value="">Select Payment Mode</option>
                                            <option value="cash">Cash</option>
                                            <option value="NetBanking">Net Banking</option>
                                        </select>
                                    </div>
                                    <div className='form-group'>
                                        <label>Received Payment Date</label>
                                        <input type="date" name='paymentdate' value={purchseData.paymentdate} onChange={handleChange1} style={{ width: '100%', height: '45px', border: '1' }} />
                                    </div>
                                    <div className='form-group'>
                                        <label>Status</label>
                                        <input type="text" name='status' value={purchseData.status} />
                                    </div>
                                </div>
                                <div>
                                    <button type="submit" className="btn btn-primary" onClick={handlepurchasesave}>
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </ModalLayout>
                </Modal>
            </Layout>
        </>
    );
};

export default Ledger;
