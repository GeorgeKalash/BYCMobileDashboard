"use client";
import React, { useEffect, useState } from "react";
import SharedModal from "@/Shared/Components/SharedModal";
import TransactionLog from "@/Shared/Components/TransactionLog";
import { withRequestTracking } from "@/utils/withRequestTracking";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";
import { getMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { DashboardMobileRepository } from "@/Repositories/DashboardMobileRepository";

interface TransactionLogFormProps {
  visible: boolean;
  onClose: () => void;
  phoneNumber?: string;
}

const TransactionLogForm: React.FC<TransactionLogFormProps> = ({
  visible,
  onClose,
  phoneNumber,
}) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();
  const [trxType, setTrxType] = useState<string>("");
  const [data, setData] = useState<any[]>([]);

  const fetchData = async () => {
    const result = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: DashboardMobileRepository.TransactionLog.getAll,
          parameters: `_resourceId=20001&_masterRef=${phoneNumber?.replace(
            "+",
            "%2B"
          )}&_trxType=${trxType}`,
        })
      )
    );

    const list = result?.payload?.data;
    setData(Array.isArray(list) ? list : []);
  };

  useEffect(() => {
    if (visible && phoneNumber) {
      fetchData();
    }
  }, [visible, phoneNumber, trxType]);

  const columns = [
    {
      name: t("Event Date"),
      selector: (row: any) => new Date(row.eventDt).toLocaleString(),
      sortable: true,
      id: "eventDt",
    },
    {
      name: t("User ID"),
      selector: (row: any) => row.userId,
      sortable: true,
      id: "userId",
    },
    {
      name: t("User Name"),
      selector: (row: any) => row.username,
      sortable: true,
      id: "userName",
    },
    {
      name: t("Transaction Name"),
      selector: (row: any) => row.typeName,
      sortable: true,
      id: "TransactionName",
    },
  ];

  return (
    <SharedModal
      visible={visible}
      onClose={onClose}
      title="User Info"
      height="80vh"
      width="60vw"
    >
      <TransactionLog
        data={data}
        columns={columns}
        dataSetId={32}
        showActions
        searchType="local"
        onSearchChange={(val) => {
          setTrxType(val);
        }}
      />
    </SharedModal>
  );
};

export default TransactionLogForm;
