import { ImagePath, Logout } from "@/Constant";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { logout } from "@/Redux/Reducers/AuthSlice";
import { useRouter } from "next/navigation";
import { LogOut } from "react-feather";
import { toast } from "react-toastify";

export const Profile = () => {
  const { i18LangStatus } = useAppSelector((store) => store.langSlice);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const LogOutUser = () => {
    dispatch(logout());
  };
  

  return (
    <li className="profile-nav onhover-dropdown px-0 py-0">
      <div className="d-flex profile-media align-items-center">
        <img className="img-30" src={`${ImagePath}/dashboard/profile.png`} alt="Profile" />
        <div className="flex-grow-1">
          <span>Alen Miller</span>
          <p className="mb-0 font-outfit">
            UI Designer <i className="fa fa-angle-down"></i>
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
