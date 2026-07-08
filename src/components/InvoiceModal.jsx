import React from "react";
import { X, Printer, Download, Receipt, CheckCircle, Car } from "lucide-react";

export default function InvoiceModal({ isOpen, onClose, booking, payment }) {
  if (!isOpen || !booking) return null;

  // Derive payment details if not fully passed
  const baseAmount = booking.totalAmount;
  const tax = payment?.tax || parseFloat((baseAmount * 0.18).toFixed(2));
  const grandTotal = payment?.grandTotal || parseFloat((baseAmount + tax).toFixed(2));
  const txnId = payment?.transactionId || "MOCK_GATEWAY_RECEIPT";
  const pStatus = payment?.status || "Success";
  const pDate = payment?.createdAt ? new Date(payment.createdAt).toLocaleDateString() : new Date().toLocaleDateString();

  const handlePrint = () => {
    try {
      const printContent = document.getElementById("printable-invoice-content").innerHTML;
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(`
        <html>
          <head>
            <title>Invoice - ${booking.id}</title>
            <!-- Load Tailwind CSS for beautiful styling in the print frame -->
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
              body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              @media print {
                .no-print { display: none; }
                body { background: white; color: black; padding: 0; }
                .print-shadow-none { box-shadow: none !important; border: none !important; }
              }
            </style>
          </head>
          <body class="bg-white p-8">
            <div class="max-w-3xl mx-auto">
              ${printContent}
            </div>
            <script>
              window.onload = function() {
                try {
                  window.print();
                } catch (e) {
                  console.error(e);
                }
                setTimeout(function() {
                  window.frameElement.remove();
                }, 500);
              }
            </script>
          </body>
        </html>
      `);
      doc.close();
    } catch (err) {
      console.error("Direct print error, falling back to document download", err);
      handleDownloadHTML();
    }
  };

  const handleDownloadHTML = () => {
    const printContent = document.getElementById("printable-invoice-content").innerHTML;
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Invoice - INV-${booking.id.toUpperCase()}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            body { 
              font-family: 'Inter', sans-serif; 
              -webkit-print-color-adjust: exact; 
              print-color-adjust: exact; 
              background-color: #f8fafc;
            }
            @media print {
              body { background: white; color: black; padding: 0; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body class="p-4 sm:p-8">
          <div class="max-w-3xl mx-auto bg-white p-6 sm:p-12 rounded-3xl shadow-xl border border-gray-100 my-8">
            ${printContent}
            
            <div class="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 no-print">
              <span class="text-xs text-gray-400 font-medium">Open in any browser to print or save directly as PDF (Ctrl+P / Cmd+P)</span>
              <button onclick="window.print()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5"/><rect width="12" height="8" x="6" y="14" rx="1"/></svg>
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-INV-${booking.id.toUpperCase()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fadeIn" id="invoice-modal-overlay">
      <div className="bg-white border border-slate-200 max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Modal Header Controls (Not Printed) */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center flex-shrink-0 gap-3">
          <div className="flex items-center space-x-2">
            <Receipt className="h-5 w-5 text-indigo-600" />
            <span className="font-extrabold text-sm uppercase tracking-wider text-slate-800">Tax Invoice Viewer</span>
          </div>
          <div className="flex items-center space-x-2 self-stretch sm:self-auto justify-end">
            <button
              onClick={handleDownloadHTML}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-md shadow-emerald-600/10 cursor-pointer transition-colors"
              title="Download standalone invoice file that bypassing browser sandbox blocks"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Invoice</span>
            </button>
            <button
              onClick={handlePrint}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-md shadow-indigo-600/10 cursor-pointer transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Direct Print</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-900 text-sm font-bold p-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Invoice Body Scroll Area */}
        <div className="overflow-y-auto p-8 flex-grow" id="invoice-modal-body">
          
          {/* Printable Wrapper */}
          <div id="printable-invoice-content" className="bg-white text-slate-900 font-sans">
            
            {/* Header / Brand Grid */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-slate-100 pb-6 mb-8 gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-indigo-600">
                  <Car className="h-7 w-7 stroke-[2.5]" />
                  <span className="text-xl font-extrabold tracking-wider uppercase text-slate-900">Elite Fleet</span>
                </div>
                <p className="text-xs text-slate-400 font-mono">Premium Mobility & Rentals</p>
              </div>

              <div className="text-left sm:text-right space-y-1 font-mono text-xs">
                <h1 className="text-slate-900 font-extrabold text-sm uppercase">Official Tax Invoice</h1>
                <p className="text-indigo-600 font-bold">INV-{booking.id.toUpperCase()}</p>
                <p className="text-slate-400">Date: {pDate}</p>
              </div>
            </div>

            {/* Billed To vs Billed From */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-b border-slate-100 pb-8 text-xs">
              <div className="space-y-2">
                <h3 className="font-mono text-slate-400 uppercase tracking-wider font-bold">BILLED TO</h3>
                <div className="space-y-1 font-sans text-slate-700">
                  <p className="font-bold text-slate-900 text-sm">{booking.userName}</p>
                  <p className="font-mono">{booking.userEmail}</p>
                  {booking.phone && <p>Phone: {booking.phone}</p>}
                  <p className="font-mono text-[11px] text-slate-500 uppercase">DL: {booking.licenseNumber || "DL-REGISTERED-VERIFIED"}</p>
                </div>
              </div>

              <div className="space-y-2 text-left md:text-right">
                <h3 className="font-mono text-slate-400 uppercase tracking-wider font-bold">ISSUED BY</h3>
                <div className="space-y-1 font-sans text-slate-700">
                  <p className="font-bold text-slate-900 text-sm">Elite Fleet Rentals Ltd.</p>
                  <p>Electronic City Phase 1</p>
                  <p>Bengaluru, KA, 560100</p>
                  <p className="font-mono text-[11px] text-slate-500">GSTIN: 29AACEF3819M1ZP</p>
                </div>
              </div>
            </div>

            {/* Transaction Receipt & Status Alert Box */}
            <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-slate-400 uppercase">GATEWAY PAYMENT RECEIPT</span>
                <p className="font-mono font-bold text-slate-800">{txnId}</p>
                <p className="text-slate-500">Method: Razorpay Secure Network</p>
              </div>
              <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200/60 text-emerald-700 font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider text-[10px]">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>{pStatus}</span>
              </div>
            </div>

            {/* Rental Particulars Item Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden mb-8 shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-mono text-slate-500 uppercase">
                    <th className="p-4">Rental Particulars / Service</th>
                    <th className="p-4 text-center">Duration</th>
                    <th className="p-4 text-right">Daily Rate</th>
                    <th className="p-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        {booking.vehicleImage && (
                          <img
                            src={booking.vehicleImage}
                            alt={booking.vehicleName}
                            className="w-12 h-8 object-cover rounded border border-slate-100 bg-slate-50 flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{booking.vehicleName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">ID: {booking.vehicleId || "FLEET-UNIT"}</p>
                          <p className="text-[10px] text-slate-400">Period: {booking.startDate} to {booking.endDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center font-mono font-semibold text-slate-700">{booking.totalDays} Days</td>
                    <td className="p-4 text-right font-mono text-slate-600">${parseFloat(baseAmount / booking.totalDays).toFixed(2)}</td>
                    <td className="p-4 text-right font-mono font-bold text-slate-900">${baseAmount}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Final Cost Summary Blocks */}
            <div className="flex justify-end mb-12">
              <div className="w-full sm:w-64 space-y-2 text-xs font-mono border-t border-slate-100 pt-4">
                <div className="flex justify-between text-slate-500">
                  <span>Fare Subtotal:</span>
                  <span>${baseAmount}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST Tax (18%):</span>
                  <span>${tax}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold text-sm border-t border-slate-200 pt-3">
                  <span>Grand Total:</span>
                  <span className="text-indigo-600">${grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Policy & Thank you Note */}
            <div className="text-center space-y-2 border-t border-slate-100 pt-8">
              <p className="text-xs text-slate-400 font-medium">Thank you for traveling with Elite Fleet. Have a pleasant and safe ride!</p>
              <p className="text-[10px] text-slate-300 font-mono">This is a system-generated document and does not require a physical signature.</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
