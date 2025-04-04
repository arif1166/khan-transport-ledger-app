
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Receipt } from '@/types';
import { formatCurrency, formatDate } from './formatters';

export const generatePDF = (receipt: Receipt): jsPDF => {
  const doc = new jsPDF();
  
  // Add company name as header
  doc.setFontSize(22);
  doc.setTextColor(30, 58, 138); // Primary color
  doc.text("KHAN TRANSPORT", 105, 20, { align: "center" });
  
  // Add receipt details
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  
  // Receipt header
  doc.text(`Receipt No: ${receipt.receiptNumber}`, 150, 40, { align: "right" });
  doc.text(`Date: ${formatDate(receipt.date)}`, 20, 40);
  
  // Transporter details
  doc.text(`Transporter: ${receipt.transporterName}`, 20, 50);
  
  // Main financial details
  doc.setFontSize(14);
  doc.text(`Advance Amount: ₹${formatCurrency(receipt.advanceAmount)}`, 20, 65);
  doc.text(`Total Rent: ₹${formatCurrency(receipt.totalRent)}`, 20, 75);
  
  // Expenses table
  doc.setFontSize(12);
  doc.text("Expenses:", 20, 90);
  
  const expenseTableData = receipt.expenses.map(expense => [
    expense.name,
    `₹${formatCurrency(expense.amount)}`
  ]);
  
  autoTable(doc, {
    startY: 95,
    head: [["Expense", "Amount"]],
    body: expenseTableData,
    theme: 'striped',
    headStyles: { fillColor: [30, 58, 138] },
    margin: { left: 20, right: 20 }
  });
  
  // Calculate the Y position after the table
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  
  // Summary calculations
  doc.text(`Total Expenses: ₹${formatCurrency(receipt.totalExpenses)}`, 20, finalY);
  doc.text(`Remaining Amount: ₹${formatCurrency(receipt.remainingAmount)}`, 20, finalY + 10);
  doc.text(`Balance Amount: ₹${formatCurrency(receipt.balanceAmount)}`, 20, finalY + 20);
  
  // Footer with contact
  doc.setFontSize(10);
  doc.text("Contact No: 6296376280", 105, 280, { align: "center" });
  
  return doc;
};

export const sharePDF = async (receipt: Receipt) => {
  try {
    const doc = generatePDF(receipt);
    const pdfBlob = doc.output('blob');
    
    if (navigator.share) {
      const file = new File([pdfBlob], `${receipt.receiptNumber}.pdf`, { type: 'application/pdf' });
      await navigator.share({
        title: `Receipt ${receipt.receiptNumber}`,
        files: [file]
      });
    } else {
      // Fallback for browsers that don't support sharing
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
    }
  } catch (error) {
    console.error('Error sharing PDF:', error);
  }
};

export const downloadPDF = (receipt: Receipt) => {
  const doc = generatePDF(receipt);
  doc.save(`${receipt.receiptNumber}.pdf`);
};
