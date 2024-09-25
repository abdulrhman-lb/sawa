export default function WarningMessage({ message }) {
  return (
    <div className="bg-red-500 py-2 px-4 mr-0 text-white rounded mb-4 text-2xl">
      {message}
    </div>
  );
}
