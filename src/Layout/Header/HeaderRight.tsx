import { Col } from "reactstrap";
import { HeaderSearch } from "./HeaderSearch/HeaderSearch";
import { SearchBox } from "./SearchBox";
import { DarkMode } from "./DarkMode";
import { Profile } from "./Profile";
import Languages from "./Languages";
import MaximizeScreen from "./MaximizeScreen";

export const HeaderRight = () => {
  return (

    
    <Col xxl="8" xl="6" md="7" xs="8" className="nav-right pull-right right-header p-0 ms-auto">
      <ul className="nav-menus">
        {/* <SearchBox /> */}
        <HeaderSearch />
        <MaximizeScreen />
        <DarkMode />
        <Languages/>
        <Profile/>
      </ul>
    </Col>
  );
};
