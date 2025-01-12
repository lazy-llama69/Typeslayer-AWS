const NumberPad: React.FC<{ onNumberInput: (number: string) => void, onClear: () => void, onNext: () => void}> = ({ onNumberInput, onClear, onNext }) => {
    // Create the number pad layout with 3 rows and 3 columns for the numbers 1-9, and include buttons for 0, clear, and submit.
    const handleClick = (value: string) => {
        onNumberInput(value);
    };

    return (
        <div>
            <div className="display"> {/* Display the entered number */}
                {/* Show the number input here */}
                {/* The number will come from the parent (Practice.tsx) */}
            </div>

            <div className="number-pad">
                {/* Number buttons */}
                {[...Array(9)].map((_, index) => (
                    <button key={index} onClick={() => handleClick((index + 1).toString())}>{index + 1}</button>
                ))}
                <button onClick={() => handleClick('0')}>0</button>
                <button onClick={onClear}>Clear</button>
                <button onClick={onNext}>Next</button> {/* You can implement the submission action as needed */}
            </div>
        </div>
    );
};

export default NumberPad;
