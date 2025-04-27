import type { CSVData } from "../index";
import { BiLoaderAlt } from "react-icons/bi";
import { Formik, Form } from "formik";
import * as yup from "yup";
import TextField from "@src/Components/FormikFields/TextField";

interface PreviewProps {
  csvData: CSVData;
  isUploading: boolean;
  onConfirm: (portfolioNameInput: string) => void;
  onReupload: () => void;
  portfolioName?: string;
}

const Preview = ({ csvData, onConfirm, onReupload, isUploading, portfolioName }: PreviewProps) => {
  const principalIndex = csvData.headers.findIndex((h) => h.toLowerCase().includes("principal"));

  const totalPrincipal = csvData.data.reduce((sum, row) => {
    const amount = parseFloat(row[principalIndex].replace(/[^0-9.-]+/g, ""));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const validationSchema = yup.object({
    portfolioNameInput: yup.string().required("Portfolio name is required"),
  });

  const initialValues = {
    portfolioNameInput: portfolioName || "",
  };

  return (
    <div>
      <p className="text-red-500 text-center mb-4 font-bold text-lg">
        Total {csvData.data.length} Debters &nbsp;•&nbsp; Total Principal Amount:{" "}
        {totalPrincipal.toLocaleString("en-US")} USD
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={({ portfolioNameInput }) => {
          onConfirm(portfolioNameInput);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="mb-6 max-w-md mx-auto space-y-4">
            <TextField
              field="portfolioNameInput"
              label_text="Portfolio Name"
              placeholder="Enter a name for this portfolio"
            />

            <div className="flex justify-center">
              <button
                className="btn-primary !px-12"
                type="submit"
                disabled={isUploading || isSubmitting}
              >
                {isUploading ? (
                  <BiLoaderAlt className="animate-spin text-2xl mx-auto" />
                ) : (
                  "Yes, I Confirm"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="text-center mb-10">
        <button onClick={onReupload} className="btn-outline">
          Upload a different file
        </button>
      </div>

      <div className="overflow-x-auto max-h-[600px] border rounded-md">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-zinc text-white sticky top-0">
              {csvData.headers.map((header, index) => (
                <th key={index} className="py-3 px-4 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData.data.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-zinc/5"}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="py-2 px-4 border-t border-gray-200">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Preview;

