import { useEffect, useState } from "react";
import { ImagePath, Logout } from "@/Constant";
import { useAppDispatch } from "@/Redux/Hooks";
import { logout } from "@/Redux/Reducers/AuthSlice";
import { LogOut } from "react-feather";

export const Profile = () => {
  const [fullName, setFullName] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("userData");
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setFullName( userData.username || "Guest"); 
      setName( userData.fullName || "Guest");  

    } else {
      setFullName("Guest");
      setName( "Guest");  
    }
  }, []);

  const LogOutUser = () => {
    dispatch(logout());
  };

  return (
    <li className="profile-nav onhover-dropdown px-0 py-0">
      <div className="d-flex profile-media align-items-center">
        <img className="img-30" src={`${ImagePath}/dashboard/profile.png`} alt="Profile" />
        <div className="flex-grow-1">
          <span>{name}</span>
          <p className="mb-0 font-outfit">
            {fullName}<i className="fa fa-angle-down"></i>
          </p>
        </div>
      </div>
      <ul className="profile-dropdown onhover-show-div">
        <li onClick={LogOutUser}>
          <div className="d-flex align-items-center cursor-pointer">
            <LogOut />
            <span className="ms-2">{Logout}</span>
          </div>
        </li>
      </ul>
    </li>
  );
};
