/* eslint-disable react/prop-types */
const Modal = ({ message, onClose }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white rounded-lg p-8">
                <p className="text-lg font-bold mb-4">{message}</p>
                <button
                    className="bg-lime-600 hover:bg-lime-800 text-white font-bold py-2 px-4 rounded"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;
