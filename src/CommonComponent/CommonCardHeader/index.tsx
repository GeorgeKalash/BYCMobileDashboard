import { CommonCardHeaderProp } from "@/Types/UikitsType";
import React, { Fragment } from "react";
import { CardHeader, Button } from "reactstrap";
import { useTranslation } from "@/app/i18n/client";
import { useAppSelector } from "@/Redux/Hooks";

const CommonCardHeader: React.FC<CommonCardHeaderProp> = ({
  title,
  span,
  headClass,
  icon,
  tagClass,
  onAdd,
  children,
}) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  return (
    <CardHeader className={headClass || ""}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 className={tagClass || ""} style={{ margin: 0 }}>
          {icon && icon}
          {title}
        </h4>
        {onAdd && (
          <Button color="primary" onClick={onAdd}>
            {t("Add")}
          </Button>
        )}
      </div>

      {children && <div className="w-100">{children}</div>}

      {span && (
        <p className="f-m-light mb-0">
          {span.map((data, index) => (
            <Fragment key={index}>
              {data?.text} {data.code && <code>{data.code}</code>}{" "}
              {data.mark && <mark>{data.mark}</mark>}
            </Fragment>
          ))}
        </p>
      )}
    </CardHeader>
  );
};

export default CommonCardHeader;
