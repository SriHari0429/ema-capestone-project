import React, { useEffect, useState } from "react";

export default function Report() {
  const [reports, setReports] = useState([]);

  // Load reports once
  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem("reports")) || [];
    setReports(savedReports);
  }, []);

  // Delete a report
  const handleDelete = (id) => {
    const updatedReports = reports.filter((r) => r.id !== id);
    setReports(updatedReports);
    localStorage.setItem("reports", JSON.stringify(updatedReports));
  };

  // Download as CSV
  const handleDownloadCSV = (report) => {
    const csvHeaders = ["Activity", "Emissions", "Unit", "Explanation", "Timestamp"];
    const csvRows = [
      [
        report.activity,
        report.emissions,
        report.unit,
        report.explanation ? report.explanation.replace(/,/g, ";") : "",
        new Date(report.timestamp).toLocaleString(),
      ],
    ];

    const csvContent =
      csvHeaders.join(",") +
      "\n" +
      csvRows.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${report.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download PDF from stored base64
  const handleDownloadPDF = (report) => {
    if (!report.pdf) {
      alert("PDF not available for this report. Please generate again.");
      return;
    }
    const link = document.createElement("a");
    link.href = report.pdf;
    link.download = `report-${report.activity}.pdf`;
    link.click();
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gov-ink">📑 Saved Reports</h1>

      {reports.length === 0 ? (
        <p className="text-gray-600">No reports generated yet.</p>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="rounded-2xl border bg-white shadow p-6 flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold text-gov-ink">
                  {report.activity} – {report.emissions} {report.unit}
                </h2>
                <p className="text-sm text-gray-500">
                  Generated on{" "}
                  {new Date(report.timestamp).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              <div className="space-x-3">
                <button
                  onClick={() => handleDownloadCSV(report)}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  ⬇️ CSV
                </button>

                {report.pdf && (
                  <button
                    onClick={() => handleDownloadPDF(report)}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                  >
                    ⬇️ PDF
                  </button>
                )}

                <button
                  onClick={() => handleDelete(report.id)}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
