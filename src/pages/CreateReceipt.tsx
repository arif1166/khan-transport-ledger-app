import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useReceipts } from "@/context/ReceiptContext";
import { formatCurrency, parseCurrency } from "@/lib/formatters";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Expense } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { Plus, Trash2 } from "lucide-react";

const CreateReceipt = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addReceipt, getLastReceiptNumber } = useReceipts();
  
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [receiptNumber, setReceiptNumber] = useState("");
  const [transporterName, setTransporterName] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: uuidv4(), name: "Driver", amount: 0 },
    { id: uuidv4(), name: "Diesel", amount: 0 },
    { id: uuidv4(), name: "FASTag", amount: 0 },
  ]);
  
  const parsedQuantity = parseInt(quantity) || 0;
  const parsedUnitPrice = parseCurrency(unitPrice) || 0;
  const totalRent = parsedQuantity * parsedUnitPrice;
  
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const parsedAdvanceAmount = parseCurrency(advanceAmount) || 0;
  const remainingAmount = parsedAdvanceAmount - totalExpenses;
  const balanceAmount = totalRent - parsedAdvanceAmount;
  
  useEffect(() => {
    setReceiptNumber(getLastReceiptNumber());
  }, [getLastReceiptNumber]);
  
  const handleExpenseAmountChange = (id: string, value: string) => {
    setExpenses(prevExpenses =>
      prevExpenses.map(expense =>
        expense.id === id
          ? { ...expense, amount: parseCurrency(value) }
          : expense
      )
    );
  };
  
  const handleAddExpense = () => {
    setExpenses(prev => [...prev, {
      id: uuidv4(),
      name: "",
      amount: 0
    }]);
  };
  
  const handleRemoveExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };
  
  const handleExpenseNameChange = (id: string, name: string) => {
    setExpenses(prev =>
      prev.map(expense =>
        expense.id === id ? { ...expense, name } : expense
      )
    );
  };
  
  const handleSubmit = () => {
    if (!transporterName) {
      toast({
        title: "Error",
        description: "Please enter transporter name",
        variant: "destructive",
      });
      return;
    }
    
    if (parsedQuantity <= 0 || parsedUnitPrice <= 0) {
      toast({
        title: "Error",
        description: "Quantity and Unit Price must be greater than zero",
        variant: "destructive",
      });
      return;
    }
    
    const validExpenses = expenses.filter(exp => exp.name.trim() !== "");
    
    const newReceipt = {
      id: uuidv4(),
      date,
      receiptNumber,
      transporterName,
      advanceAmount: parsedAdvanceAmount,
      quantity: parsedQuantity,
      unitPrice: parsedUnitPrice,
      totalRent,
      expenses: validExpenses,
      totalExpenses,
      remainingAmount,
      balanceAmount,
      status: "pending" as const
    };
    
    addReceipt(newReceipt);
    
    toast({
      title: "Receipt Created",
      description: "Receipt has been successfully created",
    });
    
    navigate(`/receipt/${newReceipt.id}`);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header title="Create Receipt" showBackButton />
      
      <div className="container mx-auto px-4 py-6 pb-20">
        <Card className="p-5">
          <div className="flex justify-between mb-6">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="receiptNumber">Receipt Number</Label>
              <Input
                id="receiptNumber"
                value={receiptNumber}
                readOnly
                className="bg-gray-100"
              />
            </div>
          </div>
          
          <div className="bg-primary text-white p-3 rounded-md mb-6">
            <div className="text-sm">Total Rent</div>
            <div className="text-2xl font-bold">
              ₹{formatCurrency(totalRent)}
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="transporterName">Transporter Name</Label>
              <Input
                id="transporterName"
                value={transporterName}
                onChange={(e) => setTransporterName(e.target.value)}
                placeholder="Enter transporter name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="advanceAmount">Advance Amount</Label>
              <Input
                id="advanceAmount"
                value={advanceAmount}
                onChange={(e) => {
                  const parsed = parseCurrency(e.target.value);
                  setAdvanceAmount(parsed ? formatCurrency(parsed) : "");
                }}
                placeholder="e.g. 15,000"
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="unitPrice">Unit Price</Label>
                <Input
                  id="unitPrice"
                  value={unitPrice}
                  onChange={(e) => {
                    const parsed = parseCurrency(e.target.value);
                    setUnitPrice(parsed ? formatCurrency(parsed) : "");
                  }}
                  placeholder="Enter price per unit"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-3">Expenses</h3>
            
            <div className="space-y-3 mb-4">
              {expenses.map((expense, index) => (
                <div key={expense.id} className="flex items-center space-x-2">
                  <div className="flex-grow">
                    <Input
                      value={expense.name}
                      onChange={(e) => handleExpenseNameChange(expense.id, e.target.value)}
                      placeholder="Expense name"
                      readOnly={index < 3}
                    />
                  </div>
                  <div className="w-1/3">
                    <Input
                      value={expense.amount ? formatCurrency(expense.amount) : ""}
                      onChange={(e) => handleExpenseAmountChange(expense.id, e.target.value)}
                      placeholder="Amount"
                    />
                  </div>
                  {index >= 3 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveExpense(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAddExpense}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" /> Add New Expense
            </Button>
            
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex justify-between font-medium">
                <span>Total Expenses:</span>
                <span>₹{formatCurrency(totalExpenses)}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
              <span className="font-medium">Remaining Amount:</span>
              <span className="font-bold text-blue-600">
                ₹{formatCurrency(remainingAmount)}
              </span>
            </div>
            
            <div className="flex justify-between items-center bg-amber-50 p-3 rounded-lg">
              <span className="font-medium">Balance Amount:</span>
              <span className="font-bold text-amber-600">
                ₹{formatCurrency(balanceAmount)}
              </span>
            </div>
          </div>
          
          <Button
            size="lg"
            onClick={handleSubmit}
            className="w-full"
          >
            Create Receipt
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default CreateReceipt;
