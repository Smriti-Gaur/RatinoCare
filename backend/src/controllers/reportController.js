import asyncHandler from "../utils/asyncHandler.js";

import {
  createReportService,
  getPatientReportsService,
  getDoctorReportsService,
  getReportByIdService,
  getMyReportsService,
} from "../services/reportService.js";
import { generateReportPdf } from "../services/reportPdfService.js";

export const createReport = asyncHandler(
  async (req, res) => {

    const data =
      await createReportService(
        req.user.id,
        req.body
      );

    res.status(201).json(data);

  }
);

export const getPatientReports =
  asyncHandler(async (req, res) => {

    const data =
      await getPatientReportsService(
        req.params.patientId
      );

    res.status(200).json(data);

  });

export const getDoctorReports =
  asyncHandler(async (req, res) => {

    const data =
      await getDoctorReportsService(
        req.params.doctorId
      );

    res.status(200).json(data);

  });

export const getReportById =
  asyncHandler(async (req, res) => {

    const data =
      await getReportByIdService(
        req.params.id
      );

    res.status(200).json(data);

  });

export const getMyReports =
  asyncHandler(async (req, res) => {

    const data =
      await getMyReportsService(
        req.user
      );

    res.status(200).json(data);

  });

export const downloadReportPdf =
  asyncHandler(async (req, res) => {
    const data = await getReportByIdService(req.params.id);
    const pdf = await generateReportPdf(data.report);

    res
      .status(200)
      .set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ratinocare-report-${req.params.id}.pdf"`,
        "Content-Length": pdf.length,
      })
      .send(pdf);
  });