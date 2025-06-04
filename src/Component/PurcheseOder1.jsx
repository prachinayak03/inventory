import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PurcheseOder1 = () => {
  const pdfRef = useRef();

  const [items, setItems] = useState([
    { description: '', qty: 0, rate: 0, amount: 0 },
  ]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [taxRate, setTaxRate] = useState(18); // Editable Tax %

const [note, setNote] = useState("It was great doing business with you.");
const [terms, setTerms] = useState("Upon accepting this purchase order, you hereby agree to the terms & conditions.");

// Editable trem condition
const [orderDate, setOrderDate] = useState('');
const [deliveryDate, setDeliveryDate] = useState('');
// Editable date 
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-IN', options);
};

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = field === 'description' ? value : parseFloat(value) || 0;
    updatedItems[index].amount = updatedItems[index].qty * updatedItems[index].rate;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', qty: 0, rate: 0, amount: 0 }]);
  };

  const generatePDF = () => {
    setIsGeneratingPDF(true);
    setTimeout(() => {
      const input = pdfRef.current;
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('purchase-order.pdf');
        setIsGeneratingPDF(false);
      });
    }, 100);
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  return (
    <>
    <section className="container my-3 ">
        <button className="btn btn-dark" onClick={generatePDF}>Get PDF</button>
      </section>
      <div ref={pdfRef}>
        <section className="container my-3 header" id="heading">
          <h1>Arihant</h1>
          <h5>Engineering Works</h5>
          <hr />
        </section>

        <section className="container">
          <h1 className="px-4 p-heading">Purchase Order</h1>
          <div className="col-md-12 " id="col">
           
          </div>

          <form>
            <div className="row">
              <div className="col-md-12 w-100 box" id='col'>
                <h2 className={`${isGeneratingPDF ? 'd-none' : ''}`}> Company Detail</h2>
                <input className={`form-control mb-2 ${isGeneratingPDF ? 'border-0' : ''}`}  placeholder="Enter your Name" 
                style={isGeneratingPDF ? {fontSize:'20px'}:{}}/>
                <input className={`form-control mb-2 ${isGeneratingPDF ? 'border-0' : ''}`} 
                style={isGeneratingPDF ? {fontSize:'20px'}:{}}
                placeholder="Company Address" />
                <input className={`form-control mb-2 ${isGeneratingPDF ? 'border-0' : ''}`} 
                placeholder="City, State, ZIP" style={isGeneratingPDF ? {fontSize:'20px'}:{}}/>
                <input className={`form-control mb-2 ${isGeneratingPDF ? 'border-0' : ''}`} 
                style={isGeneratingPDF ? {fontSize:'20px'}:{}} placeholder="Country" />
              </div>

              <div className="col-md-6 box" id='col'>
                <h2 className={`${isGeneratingPDF ? 'd-none' : ''}`}>Vendor Detail</h2>
                <input className={`form-control mb-2 ${isGeneratingPDF ? 'border-0' : ''}`} 
                 style={{
                    fontSize: isGeneratingPDF ? '20px' : '',
                    fontWeight: isGeneratingPDF ? 'bold' : '',
                  }}  placeholder="Company Name" />
                <input className={`form-control mb-2 ${isGeneratingPDF ? 'border-0' : ''}`} 
                style={isGeneratingPDF ? {fontSize:'20px'}:{}} placeholder="Company Address" />
                <input className={`form-control mb-2 ${isGeneratingPDF ? 'border-0' : ''}`} 
                style={isGeneratingPDF ? {fontSize:'20px'}:{}} placeholder="City, State, ZIP" />
                <input className={`form-control mb-2 ${isGeneratingPDF ? 'border-0' : ''}`} 
                style={isGeneratingPDF ? {fontSize:'20px'}:{}} placeholder="Country" />
                 <input className={`form-control mb-2 ${isGeneratingPDF ? 'border-0' : ''}`} 
                 style={isGeneratingPDF ? {fontSize:'20px'}:{}} placeholder="GST No." />
              </div>

          
              <div className="col-md-6 box" style={{ position: "relative", left: "15%" }} id="col">
                  <h2 className={`${isGeneratingPDF ? 'd-none' : ''}`}>PO Detail</h2>
                
              <input className={`form-control mb-2 ${isGeneratingPDF ? 'border-0' : ''}`}
              style={{
                    fontSize: isGeneratingPDF ? '20px' : '',
                    paddingLeft: isGeneratingPDF ? '0' : '',
                  }}>PO #</input>

               {isGeneratingPDF ? (
               <div className='mb-2'>
                 <p><strong style={isGeneratingPDF ? {fontSize:'20px'}:{}} >Order Date:</strong></p>
                 <p style={isGeneratingPDF ? {fontSize:'20px'}:{}}>{formatDate(orderDate)}</p>
                 <p><strong style={isGeneratingPDF ? {fontSize:'20px'}:{}}>Delivery Date:</strong></p>
                 <p style={isGeneratingPDF ? {fontSize:'20px'}:{}}>{formatDate(deliveryDate)}</p>
               </div>
             ) : (
            <>
                 <label style={isGeneratingPDF ? {fontSize:'25px'}:{}}>Order Date</label>
                <input
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                 className={`form-control mb-2 ${isGeneratingPDF ? 'border-0' : ''}`}
                 style={isGeneratingPDF ? {fontSize:'20px'}:{}}
                />

                <label style={isGeneratingPDF ? {fontSize:'25px'}:{}}>Delivery Date</label>
                <input
                  type="date"
                  value={deliveryDate}
                   onChange={(e) => setDeliveryDate(e.target.value)}
                   className={`form-control mb-2 ${isGeneratingPDF ? 'border-0 pdf-input' : ''}`}
                   style={isGeneratingPDF ? {fontSize:'20px'}:{}}
                />
              </>
                )}
                </div>

                    </div>
                  </form>
               </section>

                  <div className="container my-5">
                <table className="table ">
               <thead className='hd'>
              <tr>
             <td style={{ width: isGeneratingPDF ?'26.5%' : '48%' }}>Item Description</td>
            <td style={{ width: isGeneratingPDF ? '26.5%' : '17%' }}>Qty</td>
            <td style={{ width: isGeneratingPDF ? '26.5%' : '17%' }}>Rate</td>
            <td style={{ width: isGeneratingPDF ? '26.5%' : '18%' }}>Amount</td>
            {!isGeneratingPDF && (
             <td style={{ width: '19%' }}>Action</td>
             )}
           </tr>
            </thead>
          <tbody id='col'>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className='tarea'>
                    {isGeneratingPDF ? (
                 <div className="form-control border-0"style={{ whiteSpace: 'pre-wrap', fontSize: '20px' }}>
                {item.description}
                 </div>
                  ) : (
                    <textarea
                     value={item.description}
                     onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    className={`form-control ${isGeneratingPDF ? 'border-0' : 'L-'}`}
                    placeholder="Enter item name/description"
                    />
                    )}
                  </td>
                  <td style={{'padding-top':"30px"}}>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                      className={`form-control ${isGeneratingPDF ? 'border-0' : ''}`}
                      style={isGeneratingPDF ? {fontSize:'20px'}:{}}
                    />
                  </td>
                  <td style={{'padding-top':"30px"}}>
                    <input 
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                      className={`form-control ${isGeneratingPDF ? 'border-0' : ''}`}
                      style={isGeneratingPDF ? {fontSize:'20px'}:{}}

                    />
                  </td>
                  <td style={isGeneratingPDF ? {fontSize:'20px'}:{}} id='amount'>{item.amount.toFixed(2)}</td>
                  <td style={{'padding-top':"30px"}}>
                    <button
                      className={`btn btn-danger ${isGeneratingPDF ? 'd-none' : ''}`}
                      onClick={() => {
                        const updated = [...items];
                        updated.splice(index, 1);
                        setItems(updated);
                      }}
                    >
                     del
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            
          <div className="justify-content-between row add">
            <div className='col-md-6'>
               <button className={`btn btn-secondary add ${isGeneratingPDF ? 'd-none' : ''}`} onClick={addItem}>
              Add Line Item
            </button>
            </div>
           
            <div className='col-md-6 totals'>
              <p>
                <strong style={isGeneratingPDF ? {fontSize:'20px'}:{}}>Sub Total:</strong> 
              <span style={isGeneratingPDF ? {fontSize:'20px'}:{}} id='subtotal'>{subtotal.toFixed(2)}</span></p>
              <p>
                <strong style={isGeneratingPDF ? {fontSize:'20px'}:{}}>Tax (%):</strong>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="form-control d-inline mx-2"
                  style={{  width: '80px', display: isGeneratingPDF ? 'none' : 'inline-block' , border:0 }}
                  />
                <span style={isGeneratingPDF ? {fontSize:'20px'}:{}}>{tax.toFixed(2)}</span>
              </p>
              <p id='tot'>
                <strong style={isGeneratingPDF ? {fontSize:'20px'}:{}}>Total:</strong>
                <span style={isGeneratingPDF ? {fontSize:'20px'}:{}}>₹ {total.toFixed(2)}</span> </p>
            </div>
          </div>
        </div>

        <div className="container terms">
          <input type='text' className='form-control w-50' placeholder='Note' disabled={isGeneratingPDF} />
          {isGeneratingPDF ? (
            <div className='form-control w-50 m-3 border-0' style={{ whiteSpace: 'pre-wrap' , fontSize:'20px'}}>
            {note}
          </div>
          ) : (
          <textarea
      className="form-control  mt-3"
      value={note}
      onChange={(e) => setNote(e.target.value)}
    />
  )}

  <input type='text' className='form-control w-50' placeholder='Terms & Condition' disabled={isGeneratingPDF} />

  {isGeneratingPDF ? (
    <div className='form-control w-50 border-0' style={{ whiteSpace: 'pre-wrap' , fontSize:'20px'}}>
      {terms}
    </div>
  ) : (
    <textarea
      className="form-control w-50 mt-3"
      value={terms}
      onChange={(e) => setTerms(e.target.value)}
    />
  )}
</div>

      </div>
       
    </>
  );
};

export default PurcheseOder1;
