
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showBackButton = false }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between bg-primary text-white p-4 shadow-md">
      <div className="flex items-center">
        {showBackButton && (
          <button 
            onClick={() => navigate(-1)}
            className="mr-2 p-1 rounded-full hover:bg-primary-700"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
    </div>
  );
};
