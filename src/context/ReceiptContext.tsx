
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { Receipt, DashboardSummary } from "@/types";

interface ReceiptContextType {
  receipts: Receipt[];
  addReceipt: (receipt: Receipt) => void;
  getReceiptById: (id: string) => Receipt | undefined;
  getLastReceiptNumber: () => string;
  getSummary: () => DashboardSummary;
  searchReceipts: (query: string, dateQuery?: string) => Receipt[];
  updateReceiptStatus: (id: string, status: 'pending' | 'paid') => void;
}

const ReceiptContext = createContext<ReceiptContextType | undefined>(undefined);

export const useReceipts = () => {
  const context = useContext(ReceiptContext);
  if (context === undefined) {
    throw new Error("useReceipts must be used within a ReceiptProvider");
  }
  return context;
};

interface ReceiptProviderProps {
  children: ReactNode;
}

export const ReceiptProvider = ({ children }: ReceiptProviderProps) => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  // Load receipts from localStorage on initial load
  useEffect(() => {
    const storedReceipts = localStorage.getItem("receipts");
    if (storedReceipts) {
      setReceipts(JSON.parse(storedReceipts));
    }
  }, []);

  // Save receipts to localStorage whenever they change
  useEffect(() => {
    if (receipts.length > 0) {
      localStorage.setItem("receipts", JSON.stringify(receipts));
    }
  }, [receipts]);

  const addReceipt = (receipt: Receipt) => {
    setReceipts((prevReceipts) => [...prevReceipts, receipt]);
  };

  const getReceiptById = (id: string) => {
    return receipts.find((receipt) => receipt.id === id);
  };

  const getLastReceiptNumber = () => {
    if (receipts.length === 0) {
      return "KT-001";
    }
    
    const lastReceiptNumber = receipts[receipts.length - 1].receiptNumber;
    const lastNumber = parseInt(lastReceiptNumber.split("-")[1]);
    return `KT-${String(lastNumber + 1).padStart(3, "0")}`;
  };

  const getSummary = (): DashboardSummary => {
    let totalReceived = 0;
    let totalPending = 0;

    receipts.forEach((receipt) => {
      if (receipt.status === "paid") {
        // For paid receipts, add the remaining amount to totalReceived
        totalReceived += receipt.remainingAmount;
      } else {
        // For pending receipts, add the balance amount to totalPending
        totalPending += receipt.balanceAmount;
      }
    });

    return {
      totalReceived,
      totalPending
    };
  };

  const searchReceipts = (query: string, dateQuery?: string): Receipt[] => {
    return receipts.filter((receipt) => {
      const matchesTransporter = receipt.transporterName.toLowerCase().includes(query.toLowerCase());
      const matchesDate = dateQuery ? receipt.date.includes(dateQuery) : true;
      return matchesTransporter && matchesDate;
    });
  };

  const updateReceiptStatus = (id: string, status: 'pending' | 'paid') => {
    setReceipts((prevReceipts) => 
      prevReceipts.map((receipt) => 
        receipt.id === id ? { ...receipt, status } : receipt
      )
    );
  };

  const value = {
    receipts,
    addReceipt,
    getReceiptById,
    getLastReceiptNumber,
    getSummary,
    searchReceipts,
    updateReceiptStatus
  };

  return <ReceiptContext.Provider value={value}>{children}</ReceiptContext.Provider>;
};
