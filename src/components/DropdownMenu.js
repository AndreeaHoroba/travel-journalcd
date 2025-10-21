import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './DropdownMenu.css';

const DropdownMenu = () => {
  const nav = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      nav("/login");
    } catch (error) {
      console.error("Error logging out: ", error);
      alert("Error logging out. Please try again.");
    }
  };

  return (
      <div className="menu">
        <div className="item">
          <a href="#" className="link">
            <span> Menu </span>
            <svg viewBox="0 0 360 360" xmlSpace="preserve">
              <g id="SVGRepo_iconCarrier">
                <path id="XMLID_225_" d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z" />
              </g>
            </svg>
          </a>
          <div className="submenu">
            <div className="submenu-item">
              <div className="submenu-link" onClick={() => nav('/create-entry')}>Add Trip</div>
            </div>
            <div className="submenu-item">
              <div className="submenu-link" onClick={() => nav('/wishlist')}>Wishlist</div>
            </div>
            <div className="submenu-item">
              <div className="submenu-link" onClick={handleLogout}>Logout</div>
            </div>
            
          </div>
        </div>
      </div>

        
  );
}


export default DropdownMenu;