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
    <CardHeader
      className={headClass ? headClass : ""}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h4 className={tagClass ? tagClass : ""}>
          {icon && icon}
          {title}
        </h4>
        {children}
        {span && (
          <p className="f-m-light">
            {span.map((data, index) => (
              <Fragment key={index}>
                {data?.text} {data.code && <code>{data.code}</code>}{" "}
                {data.mark && <mark>{data.mark}</mark>}
              </Fragment>
            ))}
          </p>
        )}
      </div>
      {onAdd && (
        <Button color="primary" onClick={onAdd}>
          {t("Add")}
        </Button>
      )}
    </CardHeader>
  );
};

export default CommonCardHeader;
