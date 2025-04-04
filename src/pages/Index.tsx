import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, PlusCircle, Calendar } from "lucide-react";
import { useReceipts } from "@/context/ReceiptContext";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";

const Index = () => {
  const navigate = useNavigate();
  const { receipts, getSummary, searchReceipts } = useReceipts();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  
  const summary = getSummary();
  const filteredReceipts = searchQuery || dateQuery 
    ? searchReceipts(searchQuery, dateQuery) 
    : receipts;
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header title="KHAN TRANSPORT" />
      
      <div className="container mx-auto px-4 py-6 relative">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Amount I Have</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">₹{formatCurrency(summary.totalReceived)}</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Amount Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-600">₹{formatCurrency(summary.totalPending)}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Search Tools */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by transporter name..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative sm:w-1/3">
            <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="date"
              className="pl-8 w-full"
              value={dateQuery}
              onChange={(e) => setDateQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Receipt List */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-3">Recent Receipts</h2>
          {filteredReceipts.length === 0 ? (
            <Card className="text-center p-6">
              <p className="text-gray-500">No receipts found</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredReceipts.map((receipt) => (
                <Card 
                  key={receipt.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate(`/receipt/${receipt.id}`)}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{receipt.transporterName}</h3>
                        <p className="text-sm text-gray-500">{receipt.receiptNumber} • {receipt.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{formatCurrency(receipt.totalRent)}</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          receipt.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {receipt.status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Advance: ₹{formatCurrency(receipt.advanceAmount)}</span>
                      <span className="text-amber-600">Balance: ₹{formatCurrency(receipt.balanceAmount)}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Create Receipt Button - Positioned at bottom middle */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Button
            size="lg"
            onClick={() => navigate('/create-receipt')}
            className="rounded-full shadow-lg w-14 h-14 p-0"
          >
            <PlusCircle size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
