"use client";

import React from "react";
import { Formik, Form, FormikHelpers, FormikProps } from "formik";
import { useTranslation } from "@/app/i18n/client";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import CustomInput from "@/Shared/Components/CustomInput";
import { Col, Row } from "reactstrap";
import { withRequestTracking } from "@/utils/withRequestTracking";
import { postMobileRequest } from "@/Redux/Reducers/RequestThunks";
import { SystemMobileRepository } from "@/Repositories/SystemMobileRepository";
import * as Yup from "yup";
import { showToast } from "@/Shared/Components/showToast";
const isDarkColor = (hex: string): boolean => {
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 150;
};
const colorPalette: Record<string, string> = {
  ColorOne: "#E8F9FA",
  ColorTwo: "#D6F1F2",
  ColorThree: "#C5E8E9",
  ColorFour: "#A3D5D6",
  ColorFive: "#7DBDBF",
  ColorSix: "#5FA4A7", // Dark aqua
  ColorSeven: "#0A1F2E", // Very dark blue-teal
  ColorEight: "#264C5C", // Shadow dark
  ColorNine: "#006D77", // Deep teal (main primary)
  ColorTen: "#00A1A7", // Bright aqua
  ColorEleven: "#48C9B0", // Soft green-teal
  ColorTwelve: "#D2FAF4", // Light aqua background
  ColorThirteen: "#004D4D", // Deep cyan/blue
  ColorFourteen: "#2A8D92", // Aqua shadow
  ColorFifteen: "#FBF1DD", // Soft cream
  ColorSixteen: "#FADAA0", // Muted beige
  ColorSeventeen: "#F9C06E", // Light orange
  ColorEighteen: "#F6A13A", // Mid orange
  ColorNineteen: "#F28705", // Bright orange
  ColorTwenty: "#F8D7DA", // Light pink/red
  ColorTwentyOne: "#F5B5B8", // Mid red-pink
  ColorTwentyTwo: "#E87A7A", // Red
  ColorTwentyThree: "#D40000", // Critical red
  ColorTwentyFour: "#D5F2E8", // Light green background
  ColorTwentyFive: "#99E1C7", // Pale mint
  ColorTwentySix: "#33C290", // Mid green
  ColorTwentySeven: "#009F67", // Deep green
  ColorTwentyEight: "#00B374", // Primary green
  ColorTwentyNine: "#FFF9E3", // Pale yellow
  ColorThirty: "#FCE6A4", // Yellowish beige
  ColorThirtyOne: "#F6D26F", // Golden beige
  ColorThirtyTwo: "#E6B84C", // Gold-orange
  ColorThirtyThree: "#AFE8E3", // Soft accent teal
  ColorThirtyFour: "#1A7A80", // Deep accent blue-green
  ColorThirtyFive: "#EBFAFB", // Aqua highlight
  ColorThirtySix: "#DAF4F4", // Aqua shadow
  ColorThirtySeven: "#093E47", // Deepest accent
  ColorThirtyEight: "#D9F7F5",
  ColorThirtyNine: "#B2EDE8",
  ColorForty: "#8DE2DD",
  ColorFortyOne: "#64D7D1",
  ColorFortyTwo: "#3BCDC7",
  ColorFortyThree: "#E1F0FF",
  ColorFortyFour: "#B7DAF7",
  ColorFortyFive: "#8EC5EF",
  ColorFortySix: "#64B0E7",
  ColorFortySeven: "#3A9ADF",
  ColorFortyEight: "#E0FCF9",
  ColorFortyNine: "#B6F7F1",
  ColorFifty: "#8CF2E9",
  ColorFiftyOne: "#61EDE0",
  ColorFiftyTwo: "#37E8D8",
  ColorFiftyThree: "#DAE9EA",
  ColorFiftyFour: "#BADBDC",
  ColorFiftyFive: "#9ACDCD",
  ColorFiftySix: "#79BFBF",
  ColorFiftySeven: "#59B1B1",
  ColorFiftyEight: "#47686B",
  ColorFiftyNine: "#345153",
  ColorSixty: "#213A3C",
  ColorSixtyOne: "#0E2324",
  ColorSixtyTwo: "#041011",
  ColorSixtyThree: "#F1F5F5",
  ColorSixtyFour: "#E3EBEB",
  ColorSixtyFive: "#D4E1E1",
  ColorSixtySix: "#C6D7D7",
  ColorSixtySeven: "#B7CDCD",
  ColorSixtyEight: "#00C2CB",
  ColorSixtyNine: "#FFFFFF",
  ColorSeventy: "#28953A",
  ColorSeventyOne: "#1D92FF",
  ColorSeventyTwo: "#20B038",
  ColorSeventyThree: "#CCCCCC",
  ColorSeventyFour: "#008891",
  ColorSeventyFive: "#00A7AF",
  ColorSeventySix: "#00C6CF",
  ColorSeventySeven: "#00E4EB",
  ColorSeventyEight: "#5FFAFB",
  ColorSeventyNine: "#C2F5F3",
  ColorEighty: "#A8EFED",
  ColorEightyOne: "#8FEAE8",
  ColorEightyTwo: "#75E4E4",
  ColorEightyThree: "#5BDFDF",
  ColorEightyFour: "#F1FCFB",
  ColorEightyFive: "#D3F5F3",
  ColorEightySix: "#B6EFEC",
  ColorEightySeven: "#98E8E5",
  ColorEightyEight: "#7AE2DF",
  ColorEightyNine: "#DFF2F3",
  ColorNinety: "#C0E4E5",
  ColorNinetyOne: "#A1D6D7",
  ColorNinetyTwo: "#82C8C9",
  ColorNinetyThree: "#63BABB",
  ColorNinetyFour: "#E3FCFA",
  ColorNinetyFive: "#C9F8F6",
  ColorNinetySix: "#AFF3F3",
  ColorNinetySeven: "#95EFEE",
  ColorNinetyEight: "#7BEAE9",
  ColorNinetyNine: "#FFFFFF",
  ColorOneHundred: "#F9FDFD",
  ColorOneHundredOne: "#FFEFBA",
  ColorOneHundredTwo: "#FFD080",
  ColorOneHundredThree: "#FFC857",
  ColorOneHundredFour: "#FFB42C",
  ColorOneHundredFive: "#FFA000",
  ColorOneHundredSix: "#FFE6E6",
  ColorOneHundredSeven: "#FFB3B3",
  ColorOneHundredEight: "#FF8080",
  ColorOneHundredNine: "#FF4D4D",
  ColorOneHundredTen: "#FF1A1A",
  ColorOneHundredEleven: "#E6F7FF",
  ColorOneHundredTwelve: "#B3E5FC",
  ColorOneHundredThirteen: "#81D4FA",
  ColorOneHundredFourteen: "#4FC3F7",
  ColorOneHundredFifteen: "#29B6F6",
  ColorOneHundredSixteen: "#DFF7F8",
  ColorOneHundredSeventeen: "#B6ECEE",
  ColorOneHundredEighteen: "#8CE2E3",
  ColorOneHundredNineteen: "#63D7D9",
  ColorOneHundredTwenty: "#39CCCE",
  ColorOneHundredTwentyOne: "rgba(0, 162, 170, 0.1)",
  ColorOneHundredTwentyTwo: "rgba(0, 162, 170, 0.2)",
  ColorOneHundredTwentyThree: "rgba(0, 162, 170, 0.4)",
  ColorOneHundredTwentyFour: "rgba(0, 162, 170, 0.6)",
  ColorOneHundredTwentyFive: "rgba(0, 162, 170, 0.8)",
  white: "#FFFFFF",
  black: "#000000",
  grey: "#A4A4A4",
  lightGrey: "#dddada",
  darkGrey: "#555555",
  primary: "#00A1A7",
  primaryDark: "#006D77",
  success: "#00B374",
  warning: "#FF9900",
  error: "#D40000",
  info: "#29B6F6",
  secondary: "#6C6E8B",
  disabled: "#B0B0B0",
  disabledText: "#FFFFFF",
  surface: "#FFFFFF",
  textPrimary: "#0A1F2E",
  textSecondary: "#4A707A",
};

const PhoneSkeletonPreview: React.FC<{
  height?: number;
  palette?: Record<string, string>;
}> = ({ height = "70vh", palette = colorPalette }) => {
  const bg = palette.ColorOne;
  const card = palette.ColorOneHundred;
  const border = palette.ColorFiftyThree;
  const bar = palette.ColorThirtySix;
  const header = palette.ColorThirteen;
  const accent = palette.ColorNine;
  const fab = palette.ColorSixtyEight;

  return (
    <div>
      {/* Styles for shimmer */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -480px 0; }
          100% { background-position: 480px 0; }
        }
        .skel {
          position: relative;
          overflow: hidden;
          border-radius: 10px;
          background: ${bar};
        }
        .skel:after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.6), rgba(255,255,255,0));
          background-size: 480px 100%;
          animation: shimmer 1.6s infinite;
          mix-blend-mode: screen;
        }
      `}</style>

      {/* Phone frame */}
      <div
        style={{
          width: 320,
          height,
          borderRadius: 36,
          background:
            "linear-gradient(145deg, rgba(20,20,20,.95), rgba(38,38,38,.98))",
          boxShadow:
            "0 12px 28px rgba(0,0,0,.35), inset 0 0 0 2px rgba(255,255,255,.06)",
          padding: 10,
          position: "relative",
        }}
      >
        {/* Screen */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 28,
            background: bg,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Notch */}
          <div
            style={{
              position: "absolute",
              top: 6,
              left: "50%",
              transform: "translateX(-50%)",
              width: 120,
              height: 22,
              background: "#0F0F10",
              borderBottomLeftRadius: 14,
              borderBottomRightRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                background: "rgba(255,255,255,.25)",
              }}
            />
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: "rgba(0,153,255,.5)",
              }}
            />
          </div>

          {/* Curved header block (like screenshot top area) */}
          <div
            style={{
              height: 180,
              background: `linear-gradient(180deg, ${header}, ${accent})`,
              borderBottomLeftRadius: 28,
              borderBottomRightRadius: 28,
              position: "relative",
              paddingTop: 40,
              paddingInline: 16,
              color: "#fff",
            }}
          >
            {/* circular accents */}
            <div
              className="skel"
              style={{
                position: "absolute",
                top: 14,
                left: 14,
                width: 36,
                height: 36,
                borderRadius: 999,
                background: "rgba(255,255,255,.15)",
              }}
            />
            <div
              className="skel"
              style={{
                position: "absolute",
                top: 22,
                right: 18,
                width: 80,
                height: 24,
                borderRadius: 16,
                background: "rgba(255,255,255,.22)",
              }}
            />

            {/* greeting + small counters (skeleton bars) */}
            <div style={{ marginTop: 48, display: "flex", gap: 10 }}>
              <div className="skel" style={{ width: 120, height: 12 }} />
              <div className="skel" style={{ width: 60, height: 12 }} />
            </div>
          </div>

          {/* Floating quick actions card */}
          <div
            style={{
              padding: 12,
              marginInline: 14,
              borderRadius: 18,
              height: 80,
              background: card,
              border: `1px solid ${border}`,
              boxShadow: "0 6px 16px rgba(0,0,0,.08)",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  background: bg,
                  borderRadius: 14,
                  padding: 10,
                  height: 60,

                  border: `1px solid ${border}`,
                }}
              >
                <div
                  className="skel"
                  style={{ width: "100%", height: 40, borderRadius: 12 }}
                />
              </div>
            ))}
          </div>

          {/* Carousel / banner skeleton */}
          <div
            style={{
              marginTop: 12,
              marginInline: 14,
              borderRadius: 16,
              overflow: "hidden",
              background: card,
              border: `1px solid ${border}`,
            }}
          >
            <div className="skel" style={{ height: 90, borderRadius: 0 }} />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 6,
                padding: 8,
              }}
            >
              {[0, 1, 2, 3].map((d) => (
                <div
                  key={d}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: d === 1 ? accent : border,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Section header skeletons */}
          <div
            style={{
              marginTop: 8,
              marginInline: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="skel" style={{ width: 40, height: 12 }} />
            <div className="skel" style={{ width: 80, height: 12 }} />
          </div>

          {/* Transactions list skeleton (3 rows) */}
          <div
            style={{ marginTop: 8, marginInline: 14, display: "grid", gap: 10 }}
          >
            {[0, 1, 2].map((r) => (
              <div
                key={r}
                style={{
                  background: card,
                  border: `1px solid ${border}`,
                  borderRadius: 14,
                  padding: 12,
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {/* left: text bars */}
                <div>
                  <div className="skel" style={{ width: "55%", height: 12 }} />
                  <div
                    className="skel"
                    style={{ width: "35%", height: 10, marginTop: 8 }}
                  />
                </div>

                {/* right: amount/status + flag circle */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    className="skel"
                    style={{ width: 70, height: 10, borderRadius: 8 }}
                  />
                  <div
                    className="skel"
                    style={{
                      width: 66,
                      height: 22,
                      borderRadius: 999,
                      background: palette.ColorFifteen ?? "#FBF1DD",
                    }}
                  />
                  <div
                    className="skel"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      background: "#eee",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom stats card row */}
          <div
            style={{
              marginTop: 10,
              marginInline: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {[0, 1].map((i) => (
              <div
                key={i}
                style={{
                  background: card,
                  border: `1px solid ${border}`,
                  borderRadius: 14,
                  padding: 12,
                }}
              >
                <div className="skel" style={{ width: "40%", height: 10 }} />
                <div
                  className="skel"
                  style={{ width: "100%", height: 12, marginTop: 10 }}
                />
                <div
                  className="skel"
                  style={{ width: "70%", height: 8, marginTop: 8 }}
                />
              </div>
            ))}
          </div>

          {/* Bottom nav + FAB */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 14 }}>
            <div
              style={{
                marginInline: 14,
                background: card,
                border: `1px solid ${border}`,
                borderRadius: 18,
                padding: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                alignItems: "center",
              }}
            >
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{ display: "grid", placeItems: "center", gap: 6 }}
                >
                  <div
                    className="skel"
                    style={{ width: 18, height: 18, borderRadius: 6 }}
                  />
                  <div className="skel" style={{ width: "60%", height: 8 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ColorPreview = () => {
  return (
    <div>
      <div
        style={{
          maxHeight: "70vh",
          overflowY: "auto",
          paddingRight: 12,
        }}
      >
        <Row>
          {Object.entries(colorPalette).map(([key, hex]) => {
            const darkBackground = isDarkColor(hex);
            return (
              <Col key={key} xs={6} sm={4} md={2} style={{ marginBottom: 16 }}>
                <div
                  style={{
                    backgroundColor: hex,
                    height: 40,
                    borderRadius: 8,
                    padding: 4,
                    border: "1px solid #dcdcdc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: darkBackground ? "#fff" : "#000",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {hex}
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

const ActivateThemeForm = ({
  rowData,
  formikRef,
  onSuccessSubmit,
}: {
  rowData: any;
  formikRef?: React.Ref<FormikProps<any>>;
  onSuccessSubmit?: () => void;
}) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const dispatch = useAppDispatch();

  if (!rowData) return null;

  const initialValues = {
    name: rowData?.name || "",
    isInactive: rowData?.isInactive,
  };

  const validationSchema = Yup.object().shape({
    isInactive: Yup.boolean().required(t("Language status is required")),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    const transformedData = {
      languageId: rowData.languageId,
      name: String(rowData.name),
      isInactive: values.isInactive,
    };

    await withRequestTracking(dispatch, () =>
      dispatch(
        postMobileRequest({
          extension: SystemMobileRepository.Languages.update,
          body: transformedData,
          rawBody: true,
        })
      ).unwrap()
    );

    setSubmitting(false);
    if (onSuccessSubmit) {
      showToast("success");
      onSuccessSubmit();
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      innerRef={formikRef}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <Row>
            <Col xs={12} md={8} className="mb-3">
              <ColorPreview />
            </Col>
            <Col xs={12} md={2}>
              <PhoneSkeletonPreview />
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default ActivateThemeForm;
