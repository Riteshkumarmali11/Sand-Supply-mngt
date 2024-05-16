import React, { useEffect, useState } from 'react';
import Navbar from '../../component/Navbar';
import axios from 'axios';
import Layout from '../../component/Layout';
import { ToastContainer, toast } from 'react-toastify';

const SalesInventory = () => {
  const [registrations, setRegistrations] = useState([]);
  const [selectedOwnerName, setSelectedOwnerName] = useState('');
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [recievedAmount, setRecievedAmount] = useState('');
  const [netAmount, setNetAmount] = useState(0);
  const [fromDate, setFromDate] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState('');

  const [formData, setFormData] = useState({
    invoiceno: '',
    date:'',
    selectedOwnerName: '',
    recievedAmount: '',
    paymode: '',
    fromdate: ''
  })

  useEffect(() => {
    fetchOwnerNames();
  }, []);

  useEffect(() => {
    // Calculate status based on netAmount
    let newStatus;
    if (netAmount > 0) {
      newStatus = 'Payment Remaining';
    } else if (netAmount === 0) {
      newStatus = 'Complete';
    } else {
      newStatus = '';
    }
    // Update the status state
    setStatus(newStatus);
  }, [netAmount]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const formattedOwnerName = `${selectedOwnerName} - ${formData.invoiceno}`;
      const response = await axios.post(`http://localhost:5000/salesInventoryRegister`, {
        ...formData,
        selectedOwnerName: formattedOwnerName,
        status:status,
        netAmount:netAmount,
        totalAmount:totalAmount
      },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json', 
          },
        });
  
      if (response.status === 200) {
        // Clear form fields upon successful submission
        setFormData({
          invoiceno: '',
          date: '',
          selectedOwnerName: '',
          recievedAmount: '',
          paymode: '',
          fromdate: ''
        });
        alert('Registration Saved Successfully');
        console.log("response",response);
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Data Not Updated');
    }
  };
  
  const fetchOwnerNames = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/getSales`);
      const { success, data } = response.data;
      if (success) {
        setRegistrations(data);
      } else {
        throw new Error('Backend response indicates failure');
      }
    } catch (error) {
      console.error('Error fetching owner names:', error);
    }
  };

  // Inside the SalesInventory component

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
        setFormData(prevState => ({
          ...prevState,
          invoiceno: selectedRegistration.invoiceno,
          date:selectedRegistration.date
        }));
      }
    } else if (name === 'recievedAmount') {
      setRecievedAmount(value);
    } else if (name === 'paymode') {
      // Handle paymode changes if needed
    } else if (name === 'fromdate') {
      setFromDate(value);
    }
  };
  

  useEffect(() => {
    calculateTotal();
    calculateNetAmount();
  }, [selectedOwnerName, registrations, totalAmount, recievedAmount]);

  const calculateTotal = () => {
    let totalQuantity = 0;
    let totalAmount = 0;
    registrations.forEach(registration => {
      if (registration.sitename === selectedOwnerName) {
        registration.products.forEach(product => {
          totalQuantity += product.quantity;
          totalAmount += product.tamount;
        });
      }
    });
    setTotalQuantity(totalQuantity);
    setTotalAmount(totalAmount);
  };

  // Calculate received amount and net amount
  const calculateNetAmount = () => {
    setNetAmount(totalAmount - parseFloat(recievedAmount));
  };

  const filteredRegistrations = registrations.filter(registration => registration.sitename === selectedOwnerName);

  return (
    <>
      <Navbar />
      <Layout>
        <div className="registration-form-container">
          <ToastContainer />
          <h1 style={{ textAlign: 'center', fontSize: '30px', padding: '20px' }}><strong>Sales Ledger</strong></h1>
          <form encType="multipart/form-data">
            <div className='form-row'>
              <div className="form-group">
                <label>Select Site Name</label>
                <select style={{ width: '100%', height: '45px', border: '1px solid #ccc', borderRadius: '5px' }}
                  name="selectedOwnerName" value={formData.selectedOwnerName} onChange={handleChange} required>
                  <option value="">Select Builder Name</option>
                  {registrations.map((owner) => (
                    <option key={owner.id} value={owner.sitename}>
                      {`${owner.sitename} - ${owner.invoiceno}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className='form-group'>
                <label>Received Amount</label>
                <input type="text" name='recievedAmount' value={formData.recievedAmount} onChange={handleChange} placeholder='Enter Received Amount' />
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
                <input type="text" name='status' value={status} readOnly />
              </div>
            </div>
            <div className='form-row'>
              <div className='form-group mt-4'>
                <label className='ml-10'><strong>Total Quantity : </strong>{totalQuantity}</label>
                <label className='ml-10'><strong>Total Amount : </strong>{totalAmount}</label>
                <hr className='mb-2 mt-2'></hr>
                <label className='ml-10'><strong>Net Amount : </strong>{netAmount}</label>
              </div>
              <div className='form-group'>
                <div className={`form-group ${isVisible ? '' : 'hidden'}`}>
                  <input type="text" name='netAmount' value={netAmount} onChange={handleChange} />
                </div>
              </div>
              <div className='form-group'>
                <button type="submit" className="btn btn-primary" onClick={handleSave}>
                  Save
                </button>
              </div>
              <div className={`form-group ${isVisible ? '' : 'hidden'}`}>
                <input type="text" name='invoiceno' value={formData.invoiceno} onChange={handleChange} />
              </div>
              <div className={`form-group ${isVisible ? '' : 'hidden'}`}>
                <input type="text" name='totalAmount' value={totalAmount} onChange={handleChange} />
              </div>
            </div>
          </form>
          <div className="table-container mt-5">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Invoice No.</th>
                  <th>Builder Name</th>
                  <th>Site Name</th>
                  <th>Mobile</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((registration, regIndex) => (
                  registration.products.map((product, prodIndex) => (
                    <tr key={`${registration.id}-${prodIndex}`}>
                      {prodIndex === 0 ? (
                        <>
                          <td rowSpan={registration.products.length}>{registration.id}</td>
                          <td rowSpan={registration.products.length}>{registration.invoiceno}</td>
                          <td rowSpan={registration.products.length}>{registration.buildername}</td>
                          <td rowSpan={registration.products.length}>{registration.sitename}</td>
                          <td rowSpan={registration.products.length}>{registration.mobile}</td>
                        </>
                      ) : null}
                      <td>{product.product_name}</td>
                      <td>{product.price}</td>
                      <td>{product.quantity}</td>
                      <td>{product.tamount}</td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default SalesInventory;
