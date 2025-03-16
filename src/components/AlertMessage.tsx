interface AlertMessageProps {
    message: string;
    type: "success" | "error";
}

const AlertMessage: React.FC<AlertMessageProps> = ({ message, type }) => {
    const isSuccess = type === "success";

    return (
        <div 
            className={`px-4 py-2 rounded-md flex items-center gap-2 border transition-opacity duration-500 
                ${isSuccess ? "bg-green-100 text-green-700 border-green-400" : "bg-red-100 text-red-700 border-red-400"}
            `}
        >
            {isSuccess ? (
                <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" strokeWidth="2"
                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l4 4L19 7"></path>
                </svg>    
            ) : (
                <svg className="w-5 h-5 text-red-700" fill="none" stroke="currentColor" strokeWidth="2"
                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 19a7 7 0 100-14 7 7 0 000 14z"></path>
                </svg>
            )}
            <span>{message}</span>
        </div>
    );
};

export default AlertMessage;
