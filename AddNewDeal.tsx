import React, { useState } from "react";
import { useQueryContext } from "@/context/query/queryContext";
import DealFormComponent from "@/layouts/deals/DealFormComponent";
import { DealFormFooter } from "@/layouts/deals/DealFormFooter";
import { DealFormHeader } from "@/layouts/deals/DealFormHeader";
import { CREATE_DEAL } from "@/lib/graphql/mutation/createDeal";
import { errorToast, successToast } from "@/styles/toaster";
import { NewDealFormInitialProps } from "@/types/global";
import { s3UploadMethod } from "@/utils/awsFileUploder";
import { adddealschema } from "@/utils/formUtils/validations/ValidationUtils";
import { useMutation } from "@apollo/client";
import { useFormik } from "formik";
import { getStages } from "@/utils/helperUtils";

const AddNewDeal = ({ onClose }: { onClose(): void }) => {
  const initialValues: NewDealFormInitialProps = {
    name: "",
    organization: "",
    value: "",
    valueType: "Euro (EUR)",
    phone: "",
    phoneType: "Work",
    email: "",
    expectedCloseDate: "",
    tags: [],
    stage: [],
    linkedin: "",
    teamMembers: [],
    leadImage: null,
    calendly: "",
  };
  const { data: kanbanBoardvalue, listData } = useQueryContext();
  const [handleCrateDeal, { loading }] = useMutation(CREATE_DEAL, {
    onCompleted: listData,
  });
  const [disabled, setDisabled] = useState(false);
  const handldeSubmit = async (inputvalues: {
    stage: string;
    email: any;
    leadImage: File;
  }) => {
    setDisabled(true);
    const folderName = `leadImage/${inputvalues.email}`;
    const location: any = await s3UploadMethod(
      [inputvalues.leadImage],
      folderName,
    );
    if (!location) {
      errorToast("Something went wrong");
      return;
    }
    try {
      const { stage, ...rest } = inputvalues;
      const stageId = getStages(
        values.stage.length,
        kanbanBoardvalue?.kanbanBoard,
      );
      const input = { ...rest, stage: stageId, leadImage: location[0] };
      const { data } = await handleCrateDeal({ variables: { input } });
      if (data) {
        successToast("Deal created successfully");
        setDisabled(false);
        onClose();
      }
    } catch (err: any) {
      setDisabled(false);
      return errorToast(err?.message);
    }
  };

  // Formik Hooks
  const { errors, values, handleChange, setFieldValue, handleSubmit }: any =
    useFormik({
      initialValues: initialValues,
      validationSchema: adddealschema,
      onSubmit: () => {
        handldeSubmit(values);
      },
    });

  return (
    <>
      <DealFormHeader onClose={onClose} />
      <DealFormComponent
        values={values}
        handleChange={handleChange}
        setFieldValue={setFieldValue}
        errors={errors}
      />
      <DealFormFooter
        loading={loading}
        isDisable={disabled}
        handleSubmit={handleSubmit}
        onClose={onClose}
      />
    </>
  );
};

export default AddNewDeal;
