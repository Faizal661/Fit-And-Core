import { useNavigate } from "react-router-dom";
import { REDIRECT_MESSAGES } from "../../constants/redirect.messges";

const PageNotFound = ({
  title=REDIRECT_MESSAGES.PAGE_NOT_FOUND_TITLE,
  message = REDIRECT_MESSAGES.PAGE_NOT_FOUND_MESSAGE,
  linkText = REDIRECT_MESSAGES.HOME,
  linkTo = "/",
}) => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-4xl font-light mb-2">{title}</h1>
        <p className="text-xl text-gray-600 mb-10">{message}</p>
        <button
          type="button"
          className="text-sm px-6 py-3 border border-gray-300 hover:border-gray-800 transition-colors"
          onClick={() => navigate(`${linkTo}`)}
        >
          {linkText}
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;