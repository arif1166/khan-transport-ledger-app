
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReceipts } from "@/context/ReceiptContext";
import { formatCurrency } from "@/lib/formatters";
import { downloadPDF, sharePDF } from "@/lib/pdfGenerator";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Share, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Receipt } from "@/types";

const ViewReceipt = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getReceiptById, updateReceiptStatus } = useReceipts();
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  useEffect(() => {
    if (id) {
      const foundReceipt = getReceiptById(id);
      if (foundReceipt) {
        setReceipt(foundReceipt);
      } else {
        navigate('/');
        toast({
          title: "Receipt not found",
          description: "The requested receipt could not be found",
          variant: "destructive",
        });
      }
    }
  }, [id, getReceiptById, navigate, toast]);

  if (!receipt) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading receipt...</p>
      </div>
    );
  }

  const handleShare = () => {
    sharePDF(receipt);
  };

  const handleDownload = () => {
    downloadPDF(receipt);
  };

  const handleMarkAsPaid = () => {
    if (id) {
      updateReceiptStatus(id, "paid");
      setReceipt(prev => prev ? { ...prev, status: "paid" } : null);
      toast({
        title: "Status updated",
        description: "Receipt has been marked as paid",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header title="Receipt Details" showBackButton />

      <div className="container mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="font-bold text-2xl text-primary">{receipt.receiptNumber}</h2>
                <p className="text-gray-500">{receipt.date}</p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  receipt.status === "paid" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-amber-100 text-amber-800"
                }`}>
                  {receipt.status === "paid" ? "Paid" : "Pending"}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <h3 className="font-medium mb-2">Transporter Details</h3>
              <p className="text-lg">{receipt.transporterName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Advance Amount</p>
                <p className="text-xl font-bold text-blue-700">₹{formatCurrency(receipt.advanceAmount)}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Rent</p>
                <p className="text-xl font-bold text-purple-700">₹{formatCurrency(receipt.totalRent)}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <h3 className="font-medium mb-2">Quantity & Price</h3>
              <div className="flex justify-between">
                <p><span className="text-gray-500">Quantity:</span> {receipt.quantity}</p>
                <p><span className="text-gray-500">Unit Price:</span> ₹{formatCurrency(receipt.unitPrice)}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <h3 className="font-medium mb-3">Expenses</h3>
              <div className="space-y-2">
                {receipt.expenses.map((expense) => (
                  <div key={expense.id} className="flex justify-between">
                    <span>{expense.name}</span>
                    <span>₹{formatCurrency(expense.amount)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-2 font-medium">
                  <div className="flex justify-between">
                    <span>Total Expenses:</span>
                    <span>₹{formatCurrency(receipt.totalExpenses)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
                <span className="font-medium">Remaining Amount:</span>
                <span className="font-bold text-blue-600">
                  ₹{formatCurrency(receipt.remainingAmount)}
                </span>
              </div>
              
              <div className="flex justify-between items-center bg-amber-50 p-3 rounded-lg">
                <span className="font-medium">Balance Amount:</span>
                <span className="font-bold text-amber-600">
                  ₹{formatCurrency(receipt.balanceAmount)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {receipt.status === "pending" && (
            <Button 
              onClick={handleMarkAsPaid}
              variant="default"
              className="flex items-center justify-center bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Paid
            </Button>
          )}
          <Button 
            onClick={handleShare}
            variant="outline"
            className="flex items-center justify-center"
          >
            <Share className="mr-2 h-4 w-4" />
            Share PDF
          </Button>
          <Button 
            onClick={handleDownload}
            variant="default"
            className="flex items-center justify-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewReceipt;
