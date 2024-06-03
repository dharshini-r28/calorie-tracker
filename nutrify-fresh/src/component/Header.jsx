import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
import { useNavigate,Link } from "react-router-dom";
export default function Header()
{

    const loggedData = useContext(UserContext);
    const navigate = useNavigate();

    function logout()
    {
        localStorage.removeItem("nutrify-user");
        loggedData.setLoggedUser(null);
        navigate("/login");

    }

    return (
        <div className="header">

                <ul>
                    <Link to="/track"><li>Track</li></Link>
                    <Link to="/plan"><li>Diet</li></Link>
                    <Link to="/cal">Form</Link>
                    <Link to="/chatbot">suggestion</Link>
                    <li onClick={logout}>Logout</li>
                </ul>


        </div>
    )
}