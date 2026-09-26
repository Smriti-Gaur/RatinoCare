import PDFDocument from "pdfkit";

const formatDate = (value) => {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
};

const valueOrUnavailable = (value) => value || "Not available";

const addSectionHeading = (document, heading) => {
  document
    .moveDown(0.8)
    .fontSize(11)
    .fillColor("#0f4c5c")
    .font("Helvetica-Bold")
    .text(heading.toUpperCase());

  document
    .moveTo(50, document.y + 5)
    .lineTo(545, document.y + 5)
    .strokeColor("#b7d9df")
    .stroke()
    .moveDown(0.35)
    .fillColor("#1f2937")
    .font("Helvetica")
    .fontSize(10);
};

const addField = (document, label, value) => {
  document
    .font("Helvetica-Bold")
    .text(`${label}: `, { continued: true })
    .font("Helvetica")
    .text(valueOrUnavailable(value));
};

export const generateReportPdf = (report) => new Promise((resolve, reject) => {
  const document = new PDFDocument({
    size: "A4",
    margin: 50,
    info: {
      Title: "RatinoCare Diabetes Retinopathy Screening Report",
      Author: "RatinoCare",
    },
  });
  const chunks = [];

  document.on("data", (chunk) => chunks.push(chunk));
  document.on("end", () => resolve(Buffer.concat(chunks)));
  document.on("error", reject);

  document
    .fillColor("#0f4c5c")
    .font("Helvetica-Bold")
    .fontSize(24)
    .text("RatinoCare");
  document
    .moveDown(0.25)
    .fillColor("#374151")
    .fontSize(16)
    .text("Diabetes Retinopathy Screening Report");
  document
    .moveDown(0.2)
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#6b7280")
    .text("A patient copy of the screening report recorded in RatinoCare.");

  addSectionHeading(document, "Patient information");
  addField(document, "Name", report.patientId?.name);
  addField(document, "Email", report.patientId?.email);

  addSectionHeading(document, "Appointment information");
  addField(document, "Appointment date", formatDate(report.appointmentId?.appointmentDate));
  addField(document, "Status", report.appointmentId?.status);
  addField(document, "Reason", report.appointmentId?.reason);

  addSectionHeading(document, "Doctor information");
  addField(document, "Name", report.doctorId?.name);
  addField(document, "Email", report.doctorId?.email);

  addSectionHeading(document, "Screening result");
  addField(document, "Report date", formatDate(report.createdAt));
  addField(document, "Severity", report.severity);
  addField(document, "Diagnosis", report.diagnosis);
  addField(document, "Recommendation", report.recommendation);

  document
    .moveDown(2)
    .fontSize(8)
    .fillColor("#6b7280")
    .text(
      "Disclaimer: This document is a copy of the RatinoCare screening report. "
      + "It is not a substitute for professional medical advice or follow-up care.",
      { align: "left" },
    );
  document
    .moveDown(0.5)
    .text("RatinoCare | Diabetes Retinopathy Screening", { align: "center" });

  document.end();
});
