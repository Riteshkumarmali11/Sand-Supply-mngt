import React, { useEffect, useState } from 'react';
import Navbar from '../../component/Navbar';
import Layout from '../../component/Layout';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import '../../static/page.css';
import { FaFilePdf } from 'react-icons/fa';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';

const PurchaseReport = () => {
    const [registrations, setRegistrations] = useState([]);
    const [salesByMonth, setSalesByMonth] = useState([]);
    const [formData, setFormData] = useState({
        selectedOwnerName: '',
        selectedMonth: ''
    });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedOwnerTransactions, setSelectedOwnerTransactions] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    useEffect(() => {
        fetchSalesData();
    }, []);

    const fetchSalesData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/getPurchaseInventory`);
            const { success, data } = response.data;
            if (success) {
                setRegistrations(data);
                filterSales(data); // Filter data initially when fetched
            } else {
                throw new Error('Backend response indicates failure');
            }
        } catch (error) {
            console.error('Error fetching sales data:', error);
        }
    };

    useEffect(() => {
        filterSales(registrations); // Filter data when form data changes
    }, [formData.selectedOwnerName, formData.selectedMonth, registrations]);

    const filterSales = (data) => {
        let filteredSales = [...data];

        if (formData.selectedOwnerName) {
            filteredSales = filteredSales.filter(owner => owner.selectedOwnerName === formData.selectedOwnerName);
        }

        if (formData.selectedMonth !== '') {
            const selectedMonth = parseInt(formData.selectedMonth);
            filteredSales = filteredSales.filter(sale => new Date(sale.fromdate).getMonth() === selectedMonth);
        }

        // Aggregate sales data by particular name
        const aggregatedSales = filteredSales.reduce((accumulator, sale) => {
            const existingSale = accumulator.find(item => item.selectedOwnerName === sale.selectedOwnerName);
            if (existingSale) {
                existingSale.recievedAmount += parseInt(sale.recievedAmount);
                existingSale.totalAmount += parseInt(sale.totalAmount);
                existingSale.debitAmount += sale.debitAmount;
                existingSale.transactions.push(sale); // Store transactions
            } else {
                accumulator.push({
                    selectedOwnerName: sale.selectedOwnerName,
                    recievedAmount: parseInt(sale.recievedAmount),
                    totalAmount: parseInt(sale.totalAmount),
                    debitAmount: sale.debitAmount,
                    month: new Date(sale.fromdate).getMonth(),
                    transactions: [sale] // Store transactions for this owner
                });
            }
            return accumulator;
        }, []);

        setSalesByMonth(aggregatedSales);
    };

    const getMonthName = (month) => {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return monthNames[month];
    };

    const handlePdfView = (ownerName) => {
        const owner = salesByMonth.find(sale => sale.selectedOwnerName === ownerName);
        if (owner) {
            setSelectedOwnerTransactions(owner.transactions);
            setModalIsOpen(true);
        }
    };

    return (
        <>
            <Navbar />
            <Layout>
                <div className="registration-form-container">
                    <ToastContainer />
                    <h1 style={{ textAlign: 'center', fontSize: '30px', padding: '20px' }}><strong>Purchase Report</strong></h1>
                    <div className='form-row'>
                        <div className='form-group'>
                            <label>From Date</label>
                            <input type="date" name='fromDate' onChange={handleChange} style={{ width: '100%', height: '45px', border: '1' }} />
                        </div>
                        <div className='form-group'>
                            <label>To Date</label>
                            <input type="date" name='toDate' onChange={handleChange} style={{ width: '100%', height: '45px', border: '1' }} />
                        </div>
                        <div className='form-group'></div>
                        <div className='form-group'></div>
                    </div>
                    <div className='form-row'>
                        <div className='form-group'>
                            <label>Select Particulars</label>
                            <select style={{ width: '100%', height: '45px', border: '1px solid #ccc', borderRadius: '5px' }}
                                name="selectedOwnerName" value={formData.selectedOwnerName} onChange={handleChange} required>
                                <option value="">Select Particulars</option>
                                {registrations.map((owner, index) => (
                                    <option key={index} value={owner.selectedOwnerName}>
                                        {owner.selectedOwnerName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='form-group'>
                            <label>Select Month</label>
                            <select style={{ width: '100%', height: '45px', border: '1px solid #ccc', borderRadius: '5px' }}
                                name="selectedMonth" value={formData.selectedMonth} onChange={handleChange} required>
                                <option value="">Select Month</option>
                                {Array.from({ length: 12 }).map((_, index) => (
                                    <option key={index} value={index.toString()}>
                                        {getMonthName(index)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <table className="s-table">
                            <thead>
                                <tr>
                                    <th className='bot'>Month</th>
                                    <th className='bot'>Particulars</th>
                                    <th className='bot'>Credit</th>
                                    <th className='bot'>Debit</th>
                                    <th className='bot'>Closing Balance</th>
                                    <th className='bot'>View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salesByMonth.map((sale, index) => (
                                    <tr key={index}>
                                        <td>{getMonthName(sale.month)}</td>
                                        <td>{sale.selectedOwnerName}</td>
                                        <td>-</td>
                                        <td>{sale.recievedAmount}</td>
                                        <td>{sale.totalAmount}</td>
                                        <td>
                                            <FaFilePdf className="pdf-icon" onClick={() => handlePdfView(sale.selectedOwnerName)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Modal */}
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={() => setModalIsOpen(false)}
                        contentLabel="Transaction Modal"
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
                            <h2>Transactions for {formData.selectedOwnerName}</h2>
                            <button style={{ backgroundColor: 'none', border: 'none', cursor: 'pointer', color: 'black' }} onClick={() => setModalIsOpen(false)}>
                                <FaTimes />
                            </button>
                        </div>
                        <table className='s-table'>
                            <thead>
                                <tr>
                                    <th className='bg-dark-200'>Date</th>
                                    <th className='bg-dark-200'>Owner Name</th>
                                    <th className='bg-dark-200'>Debit</th>
                                    <th className='bg-dark-200'>Closing Balance</th> {/* New column for Closing Balance */}
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOwnerTransactions.map((transaction, index) => {
                                    // Calculate Closing Balance
                                    const closingBalance = index === 0
                                        ? transaction.recievedAmount // First row, use receivedAmount as closing balance
                                        : selectedOwnerTransactions.slice(0, index + 1).reduce((acc, curr) => acc + parseInt(curr.recievedAmount), 0);

                                    return (
                                        <tr key={index}>
                                            <td>{transaction.fromdate}</td>
                                            <td>{transaction.selectedOwnerName}</td>
                                            <td>{transaction.recievedAmount}</td>
                                            <td>{closingBalance}</td> {/* Display Closing Balance */}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div style={{ marginTop: '20px' }}>
                            <p>Total Credit Amount: {selectedOwnerTransactions.reduce((acc, curr) => acc + parseInt(curr.recievedAmount), 0)}</p>
                            <p>Total Closing Balance: {selectedOwnerTransactions.reduce((acc, curr, index) => parseInt(curr.recievedAmount) + (index > 0 ? parseInt(selectedOwnerTransactions[index - 1].closingBalance) : 0), 0)}</p>
                        </div>
                    </Modal>
                </div>
            </Layout>
        </>
    );
};

export default PurchaseReport;
