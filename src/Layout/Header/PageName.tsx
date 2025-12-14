import { useAppSelector } from "@/Redux/Hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "react-feather";
import { Breadcrumb, BreadcrumbItem, Col } from "reactstrap";

export const PageName = () => {
  const pathname = usePathname();
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const symbolRegex = /[!@#\$%\^&\*\(\)_\+\{\}\[\]:;"'<>,.?/\\|`~\-=]/g;
  const [firstPart, secondPart, thirdPart] = pathname
    .split("/")
    .slice(2)
    .map((item) => item.replace(symbolRegex, " "));

  return (
    <Col>
      <h5 className="f-w-900 text-capitalize">
        {thirdPart ? thirdPart : secondPart}
      </h5>
    </Col>
  );
};
