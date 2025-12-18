const ProgressBar = ({ percentage = 0, showLabel = true, height = 'h-3' }) => {
    // Ensure percentage is between 0 and 100
    const validPercentage = Math.min(Math.max(percentage, 0), 100);

    return (
        <div className="w-full">
            <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${height}`}>
                <div
                    className="bg-mdla-yellow h-full transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${validPercentage}%` }}
                ></div>
            </div>
            {showLabel && (
                <div className="mt-2 text-right">
                    <span className="text-sm font-semibold text-gray-700">
                        {validPercentage}% Complété
                    </span>
                </div>
            )}
        </div>
    );
};

export default ProgressBar;
