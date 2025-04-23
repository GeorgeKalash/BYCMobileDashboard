"use client"

import React, { useEffect, useState, useCallback } from "react"
import { Field, ErrorMessage, useFormikContext } from "formik"
import { FormGroup, Label, Spinner, Button } from "reactstrap"
import { useSelector } from "react-redux"
import { RootState } from "@/Redux/Store"
import { useAppDispatch } from "@/Redux/Hooks"
import { withRequestTracking } from "@/utils/withRequestTracking "
import { getMobileRequest } from "@/Redux/Reducers/RequestThunks"

type OptionType = {
  value: string | number
  label: string
}

interface CustomSelectProps {
  name: string
  label?: string
  options?: OptionType[] | null
  endpointId?: string
  dataSetId?: number | string
  isRequired?: boolean
  submitErrors?: string
  showRefresh?: boolean
  loadingText?: string
  defaultIndex?: number
  valueKey?: string
  labelKey?: string
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  name,
  label = "",
  options = null,
  endpointId,
  dataSetId,
  isRequired = false,
  submitErrors = "",
  showRefresh = true,
  loadingText = "Loading...",
  defaultIndex,
  valueKey = "code",
  labelKey = "name"
}) => {
  const [selectOptions, setSelectOptions] = useState<OptionType[]>(options || [])
  const [isLoading, setIsLoading] = useState(false)
  const { setFieldValue } = useFormikContext<any>()
  const dispatch = useAppDispatch()

  const reduxLangId = useSelector((state: RootState) => state.authSlice.languageId)
  const langId = reduxLangId || parseInt(localStorage.getItem("languageId") || "1", 10)

  const loadOptions = useCallback(async () => {
    let url = dataSetId ? `/api/KVS/getAllKVS` : endpointId
    if (!url) return

    setIsLoading(true)
    const action = await withRequestTracking(dispatch, () =>
      dispatch(
        getMobileRequest({
          extension: url,
          parameters: `_dataset=${dataSetId || ""}&_language=${langId}`
        })
      )
    )
    const data = action.payload

    const mapped = data?.list?.map((item: any) => ({
      value: item[valueKey],
      label: item[labelKey]
    })) || []

    setSelectOptions(mapped)

    if (typeof defaultIndex === "number" && mapped[defaultIndex]) {
      setFieldValue(name, mapped[defaultIndex].value)
    }
    setIsLoading(false)
  
  }, [dataSetId, endpointId, dispatch, langId, valueKey, labelKey, name, defaultIndex, setFieldValue])

  useEffect(() => {
    if ((dataSetId || endpointId) && selectOptions.length === 0) {
      loadOptions()
    }
  }, [dataSetId, endpointId, selectOptions.length, loadOptions])

  const validationClass =
    submitErrors === "invalid"
      ? "is-invalid"
      : submitErrors === "valid"
      ? "is-valid"
      : ""

  return (
    <FormGroup>
      <Label>
        {label} {isRequired && <span className="text-danger">*</span>}
        {(dataSetId || endpointId) && showRefresh && (
          <Button
            type="button"
            color="link"
            size="sm"
            onClick={loadOptions}
            className="ms-2 p-0 align-baseline"
            title="Refresh options"
          >
            🔄
          </Button>
        )}
      </Label>

      {isLoading ? (
        <div className="form-control">
          <Spinner size="sm" /> {loadingText}
        </div>
      ) : (
        <Field
          as="select"
          name={name}
          className={`form-control form-select ${validationClass}`}
        >
          <option value="">Select {label}</option>
          {selectOptions.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Field>
      )}

      <ErrorMessage name={name} component="div" className="invalid-feedback" />
    </FormGroup>
  )
}

export default CustomSelect
