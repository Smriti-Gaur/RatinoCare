import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import Slot from "../models/Slot.js";
import User from "../models/User.js";

import asyncHandler from "../utils/asyncHandler.js";

import {

createAppointmentService,
getAllAppointmentsService,
getAppointmentByIdService,
updateAppointmentStatusService,
  cancelAppointmentService,
  bookSlotAppointmentService,
  getPatientAppointmentsService,
  getDoctorAppointmentsService,
  getMyAppointmentsService,

} from "../services/appointmentService.js";

export const createAppointment =
asyncHandler(async(req,res)=>{

    const data =
    await createAppointmentService(
        req.body
    );

    res.status(201).json(data);

});

export const getAllAppointments =
asyncHandler(async(req,res)=>{

    const data =
    await getAllAppointmentsService();

    res.status(200).json(data);

});

export const getAppointmentById =
asyncHandler(async(req,res)=>{

    const data =
    await getAppointmentByIdService(
        req.params.id
    );

    res.status(200).json(data);

});

export const updateAppointmentStatus =
asyncHandler(async (req, res) => {

  const data =
    await updateAppointmentStatusService(
      req.params.id,
      req.body.status
    );

  res.status(200).json(data);

});

export const getPatientAppointments =
asyncHandler(async(req,res)=>{

    const data =
    await getPatientAppointmentsService(
        req.params.patientId
    );

    res.status(200).json(data);

});

export const getDoctorAppointments =
asyncHandler(async(req,res)=>{

    const data =
    await getDoctorAppointmentsService(
        req.params.doctorId
    );

    res.status(200).json(data);

});

export const cancelAppointment =
asyncHandler(async (req, res) => {

  const data =
    await cancelAppointmentService(
      req.params.id
    );

  res.status(200).json(data);

});

export const bookSlotAppointment =
asyncHandler(async(req,res)=>{

    const data =
    await bookSlotAppointmentService(
        req.user.id,
        req.body.slotId
    );

    res.status(201).json(data);

});

export const getMyAppointments =
asyncHandler(async(req,res)=>{

    const data =
    await getMyAppointmentsService(
        req.user
    );

    res.status(200).json(data);

});