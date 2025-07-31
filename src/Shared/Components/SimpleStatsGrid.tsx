import { ImagePath } from "@/Constant";
import React from "react";
import { Card, CardBody, Col } from "reactstrap";
import { useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";

interface SimpleStatsGridProps {
  data: Record<string, number | string>;
  logoMap?: Record<string, string>;
}

const SimpleStatsGrid: React.FC<SimpleStatsGridProps> = ({
  data,
  logoMap = {},
}) => {
    const { i18LangStatus } = useAppSelector((state) => state.langSlice);
    const { t } = useTranslation(i18LangStatus);
    
  return (
    <>
      {Object.entries(data).map(([title, value], i) => {
        const iconPath = logoMap[title];
        return (
          <Col xl="3" sm="6" key={i} className="mb-3">
            <Card className="h-100">
              <CardBody className="d-flex align-items-center gap-3">
                {iconPath && (
                  <div className="flex-shrink-0" style={{ width: 70, height: 70, padding:13, backgroundColor: '#7A70BA', borderRadius: 100 }}>
                    <img
                      src={`${ImagePath}/Report${iconPath}`}
                      alt={title}
                      style={{ width: '100%', height: '100%', objectFit: "contain"  }}
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
