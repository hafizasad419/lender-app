import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { Clock, FileWarning, UploadIcon } from "lucide-react";
// import { CSV_UPLOAD_COLUMNS } from "@src/constants";
import { CSVData } from "../";
import { parse } from 'date-fns';

interface UploadProps {
    onCsvUploaded: (data: CSVData) => void;
}

const Upload = ({ onCsvUploaded }: UploadProps) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            setError(null);

            if (acceptedFiles.length === 0) {
                return;
            }

            const file = acceptedFiles[0];

            if (!file.name.endsWith(".csv")) {
                setError("Only CSV files are allowed.");
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                setError("File size exceeds the 10MB limit.");
                return;
            }

            setIsLoading(true);

            // First, try to detect the delimiter by reading a small portion of the file
            const reader = new FileReader();
            reader.onload = (e) => {
                const sample = e.target?.result?.toString().slice(0, 1000) || "";

                // Try to guess the delimiter
                const commaCount = (sample.match(/,/g) || []).length;
                const semicolonCount = (sample.match(/;/g) || []).length;
                const tabCount = (sample.match(/\t/g) || []).length;

                // Choose the delimiter that appears most frequently
                let delimiter = ',';
                let maxCount = commaCount;

                if (semicolonCount > maxCount) {
                    delimiter = ';';
                    maxCount = semicolonCount;
                }

                if (tabCount > maxCount) {
                    delimiter = '\t';
                }

                // Now parse with the detected delimiter
                Papa.parse(file, {
                    header: true,
                    delimiter: delimiter,
                    skipEmptyLines: true, // Skip empty lines
                    transformHeader: (header) => header.trim(), // Trim whitespace from headers
                    complete: (results) => {
                        setIsLoading(false);

                        if (results.errors && results.errors.length > 0) {
                            setError(`Error parsing CSV file: ${results.errors[0].message} (Row: ${results.errors[0].row || 'unknown'})`);
                            return;
                        }

                        // With header: true, results.data will be an array of objects
                        const data = results.data as Record<string, string>[];

                        if (data.length === 0) {
                            setError("The CSV file appears to be empty or could not be parsed correctly.");
                            return;
                        }

                        const headers = Object.keys(data[0] || {});

                        // Log for debugging
                        console.log("Parsed headers:", headers);
                        console.log("First row data:", data[0]);
                        console.log("Using delimiter:", delimiter);

                        // Validate required columns
                        const requiredColumns = [
                            "Debtor Name",
                            "Principal Amount",
                            "Debt Age",
                            "Interest",
                            "Last Payment Date",
                            "Collection Attempts",
                            "Age",
                            "Gender",
                            "Location"
                        ];

                        const missingColumns = requiredColumns.filter(
                            (col) => !headers.some((header) => header.toLowerCase() === col.toLowerCase())
                        );

                        if (missingColumns.length > 0) {
                            setError(`Missing required columns: ${missingColumns.join(", ")}`);
                            return;
                        }

                        // Track invalid rows for better error reporting
                        const invalidRows: number[] = [];

                        // Validate each row's data
                        const validData = data.filter((row, index) => {
                            // Skip empty rows
                            if (Object.values(row).every(val => !val)) {
                                return false;
                            }

                            // Access fields directly by name (case-insensitive lookup)
                            const getField = (fieldName: string) => {
                                const key = Object.keys(row).find(k =>
                                    k.toLowerCase() === fieldName.toLowerCase());
                                return key ? row[key] : undefined;
                            };

                            const debtorName = getField("Debtor Name");
                            const principalAmount = parseFloat(getField("Principal Amount") || "");
                            const debtAgeInMonths = parseInt(getField("Debt Age") || "");
                            const interest = parseFloat(getField("Interest") || "");
                            const lastPaymentDate = getField("Last Payment Date");
                            const collectionAttempts = parseInt(getField("Collection Attempts") || "");
                            const age = parseInt(getField("Age") || "");
                            const gender = getField("Gender");
                            const location = getField("Location");

                            // Check if lastPaymentDate exists before parsing
                            let parsedDate = true;  // Default to true to avoid invalid date errors if empty
                            if (lastPaymentDate) {
                                // Try parsing the date only if it's not undefined or empty
                                try {
                                    parsedDate = !isNaN(parse(lastPaymentDate, 'yyyy-MM-dd', new Date()).getTime());
                                } catch (e) {
                                    parsedDate = false;
                                }
                            }

                            // Check for missing or invalid values
                            const issues = [];

                            if (!debtorName) issues.push("Missing debtor name");
                            if (isNaN(principalAmount) || principalAmount <= 0) issues.push("Invalid principal amount");
                            if (isNaN(debtAgeInMonths) || debtAgeInMonths < 0) issues.push("Invalid debt age");
                            if (isNaN(interest) || interest < 0) issues.push("Invalid interest rate");
                            if (isNaN(collectionAttempts) || collectionAttempts < 0) issues.push("Invalid collection attempts");
                            if (isNaN(age) || age <= 0) issues.push("Invalid age");
                            if (!gender) issues.push("Missing gender");
                            if (!location) issues.push("Missing location");
                            if (!parsedDate) issues.push("Invalid date format");

                            const isInvalid = issues.length > 0;

                            if (isInvalid) {
                                console.log(`Row ${index + 2} issues:`, issues, row);
                                invalidRows.push(index + 2); // +2 because index is 0-based and we need to account for header row
                            }

                            return !isInvalid;
                        });

                        if (invalidRows.length > 0) {
                            // Provide more detailed error message
                            setError(`Found ${invalidRows.length} rows with invalid data. Check rows: ${invalidRows.slice(0, 5).join(", ")}${invalidRows.length > 5 ? '...' : ''}`);
                            return;
                        }

                        // Transform data back to the format expected by the parent component
                        const rowData = validData.map(row =>
                            headers.map(header => row[header])
                        );

                        // Pass the parsed data to the parent component
                        onCsvUploaded({
                            headers,
                            data: rowData
                        });
                    },
                    error: (error: any) => {
                        setIsLoading(false);
                        setError("Error parsing CSV file: " + error?.message);
                    }
                });
            };

            reader.onerror = () => {
                setIsLoading(false);
                setError("Error reading the file");
            };

            reader.readAsText(file);
        },
        [onCsvUploaded]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "text/csv": [".csv"]
        },
        maxFiles: 1
    });

    return (
        <div className="mb-6">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${isDragActive ? "border-zinc bg-zinc/5" : "border-gray-300"}`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-zinc/10 flex items-center justify-center">
                        <UploadIcon className="h-8 w-8 text-zinc" />
                    </div>
                    <div>
                        <p className="text-lg font-medium text-zinc">Drag and drop your CSV file here</p>
                        <p className="text-gray-700 mt-1">or click to browse from your computer</p>
                    </div>
                    <button className="mt-2 btn-primary">
                        Browse Files
                    </button>
                </div>
            </div>

            {isLoading && (
                <div className="mt-4 p-3 bg-zinc/10 rounded flex items-center gap-2">
                    <Clock className="h-5 w-5 text-zinc animate-pulse" />
                    <span className="text-gray-700">Processing your file...</span>
                </div>
            )}

            {error && (
                <div className="mt-4 p-3 bg-orange/10 rounded flex items-center gap-2">
                    <FileWarning className="h-5 w-5 text-orange" />
                    <span className="text-gray-700">{error}</span>
                </div>
            )}

            <div className="mt-8 bg-zinc/5 p-4 rounded-lg">
                <h3 className="flex items-center gap-2 text-zinc font-medium mb-2">
                    <Clock className="h-5 w-5" />
                    File Requirements
                </h3>
                <ul className="text-gray-700 space-y-2 pl-5">
                    <li className="font-bold">1. File must be in CSV format</li>
                    <li className="font-bold">2. Maximum file size: 10MB</li>
                    <li className="font-bold">3. Required Columns</li>
                    <li>
                        <ul className="list-disc ml-6 mt-1">
                            <li><code className=" block p-1 rounded">Debtor Name</code></li>
                            <li><code className=" block p-1 rounded">Principal Amount</code></li>
                            <li><code className=" block p-1 rounded">Debt Age (in months)</code></li>
                            <li><code className=" block p-1 rounded">Interest (percentage)</code></li>
                            <li><code className=" block p-1 rounded">Last Payment Date (YYYY-MM-DD)</code></li>
                            <li><code className=" block p-1 rounded">Collection Attempts</code></li>
                            <li><code className=" block p-1 rounded">Age</code></li>
                            <li><code className=" block p-1 rounded">Gender</code></li>
                            <li><code className=" block p-1 rounded">Location</code></li>
                        </ul>
                    </li>

                    <li className="font-bold">4. All monetary values should be in USD</li>
                </ul>
            </div>
        </div>
    );
};

export default Upload;