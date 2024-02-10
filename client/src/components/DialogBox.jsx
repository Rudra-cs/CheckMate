/* eslint-disable react/prop-types */

export default function CustomDialog({
  open,
  children,
  title,
  contentText,
  handleContinue,
}) {
  return (
    <div className={`fixed inset-0 ${open ? "block" : "hidden"} z-10`}>
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-lg w-96">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <p className="mb-4">{contentText}</p>
          <div>{children}</div>
          <div className="mt-4 flex justify-end">
            {/* You may customize the button styles based on your needs */}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
