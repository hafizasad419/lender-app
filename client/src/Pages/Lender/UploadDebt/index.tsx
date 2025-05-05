import { useState, useEffect, useRef } from "react";
import Upload from "./Upload";
import Preview from "./Preview";
import Confirm from "./Confirm";
import { formatCsvDataForBackend } from "@src/utils";
import { useSelector } from "react-redux";
import { Axios } from "@src/api";
import { SuccessNotification, ErrorNotification } from "@src/utils";
import { useNavigate } from "react-router-dom";

type Step = "upload" | "preview" | "confirm";

export interface CSVData {
  data: string[][];
  headers: string[];
}

const UploadDebt = () => {
  const lender = useSelector((state: any) => state.user);
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [portfolioName, setPortfolioName] = useState<string>("");
  const [debtType, setDebtType] = useState<string>("");

  // To avoid repeated uploads due to React.StrictMode or rerenders
  const hasUploadedRef = useRef(false);

  // Load stored data (preview state)
  useEffect(() => {
    const storedData = localStorage.getItem("csvData");
    const storedName = localStorage.getItem("portfolioName");
    const storedDebtType = localStorage.getItem("debtType");

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData) as CSVData;
        setCsvData(parsedData);
        setCurrentStep("preview");

        if (storedName) {
          setPortfolioName(JSON.parse(storedName));
        }
      } catch (error: any) {
        console.error("Error parsing stored CSV data:", error);
        localStorage.removeItem("csvData");
        localStorage.removeItem("portfolioName");
        localStorage.removeItem("debtType");
      }
    }
  }, []);

  // Trigger upload once in Preview step if data and lender exist
  useEffect(() => {
    if (
      currentStep === "preview" &&
      csvData &&
      portfolioName &&
      lender &&
      lender._id &&
      !isUploading &&
      !hasUploadedRef.current
    ) {
      hasUploadedRef.current = true;
      handleConfirmClick(portfolioName, debtType);
    }
  }, [currentStep, csvData, portfolioName, lender]);

  const handleCsvUploaded = (data: CSVData) => {
    setCsvData(data);
    localStorage.setItem("csvData", JSON.stringify(data));
    setCurrentStep("preview");
  };

  const handleConfirmClick = async (portfolioNameInput: string, selectedDebtType: string) => {

    localStorage.setItem("portfolioName",
      JSON.stringify(portfolioNameInput));
    localStorage.setItem("debtType",
      JSON.stringify(selectedDebtType));

    setPortfolioName(portfolioNameInput); // update for effect too
    setDebtType(selectedDebtType);

    if (!csvData) return;

    if (!lender || !lender._id) {
      setCurrentStep("confirm");
      return;
    }

    const formattedData = formatCsvDataForBackend(csvData.data, csvData.headers);

    try {
      setIsUploading(true);
      const response = await Axios.post("/portfolio/upload", {
        lenderId: lender._id,
        debts: formattedData,
        portfolioName: portfolioNameInput,
        debtType: selectedDebtType

      });

      if (response.status === 200) {
        SuccessNotification("Debt portfolio uploaded successfully!");
        localStorage.removeItem("csvData");
        localStorage.removeItem("portfolioName");
      }

      navigate("/portfolio");
    } catch (error: any) {
      ErrorNotification(error?.response?.data?.error + " Please Refresh and Try Again." || "Failed to upload debt portfolio. Please Refresh and Try Again.");
      console.error("Debt upload error:", error);
      hasUploadedRef.current = false;
    } finally {
      setIsUploading(false);
    }
  };

  const handleReupload = () => {
    setCsvData(null);
    localStorage.removeItem("csvData");
    localStorage.removeItem("portfolioName");
    setCurrentStep("upload");
    hasUploadedRef.current = false;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {currentStep === "upload" && (
        <>
          <section>
            <h1 className="text-3xl font-bold text-zinc mb-2">Upload Debt Portfolio</h1>
            <p className="text-gray-700 mb-6">
              Upload your debt portfolio in <strong>CSV format</strong>. Make sure your file includes all required columns listed below:
            </p>
          </section>
          <Upload onCsvUploaded={handleCsvUploaded} />
        </>
      )}

      {csvData && currentStep === "preview" && (
        <Preview
          isUploading={isUploading}
          csvData={csvData}
          portfolioName={portfolioName}
          onConfirm={handleConfirmClick}
          onReupload={handleReupload}
          debtType={debtType}
        />
      )}

      {currentStep === "confirm" && <Confirm onReupload={handleReupload} />}
    </div>
  );
};

export default UploadDebt;

