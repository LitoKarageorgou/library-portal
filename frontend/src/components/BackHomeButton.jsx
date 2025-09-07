import { useNavigate } from "react-router-dom";

function BackHomeButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/")}
      className="px-4 py-2 mt-5 bg-gray-500 text-white rounded hover:bg-gray-700"
    >
      Back to Home
    </button>
  );
}

export default BackHomeButton;
