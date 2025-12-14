import React from "react";
import { Card, CardBody, Col } from "reactstrap";
import { useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import * as Icons from "lucide-react";

interface SimpleStatsGridProps {
  data: Record<string, number | string>;
  logoMap?: Record<string, string>;
}

function toPascalCase(str: string) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}
const IconComponent: React.FC<{
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}> = ({ name, size = 24, color = "currentColor", strokeWidth = 2 }) => {
  const iconName = toPascalCase(name);
  const Icon = Icons[iconName as keyof typeof Icons] as
    | React.ElementType
    | undefined;

  if (!Icon) {
    console.warn(`Icon "${iconName}" not found in lucide-react.`);
    return null;
  }

  return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
};

const SimpleStatsGrid: React.FC<SimpleStatsGridProps> = ({
  data,
  logoMap = {},
}) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);

  return (
    <>
      {Object.entries(data).map(([title, value], i) => {
        const iconName = logoMap[title];

        return (
          <Col key={i} className="mb-3">
            <Card className="h-100">
              <CardBody className="d-flex align-items-center gap-2 py-1 px-3">
                {iconName && (
                  <div
                    className="flex-shrink-0 d-flex align-items-center justify-content-center"
                    style={{
                      width: 70,
                      height: 70,
                      backgroundColor: "#7A70BA",
                      borderRadius: "50%",
                    }}
                  >
                    <IconComponent
                      name={iconName}
                      size={36}
                      color="#fff"
                      strokeWidth={2}
                    />
                  </div>
                )}
                <div className="flex-grow-1">
                  <h6 className="mb-1">{t(title)}</h6>
                  <h3 className="mb-0">{value}</h3>
                </div>
              </CardBody>
            </Card>
          </Col>
        );
      })}
    </>
  );
};

export default SimpleStatsGrid;
