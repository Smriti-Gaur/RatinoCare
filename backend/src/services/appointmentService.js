import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

export const createAppointmentService = async (
  appointmentData
) => {

  const {
    patientId,
    doctorId,
    appointmentDate,
  } = appointmentData;

  

  if (patientId === doctorId) {
    throw new ApiError(
      400,
      "Patient and Doctor cannot be the same user"
    );
  }

  // Check Patient
  const patient =
    await User.findById(patientId);

  if (!patient) {
    throw new ApiError(
      404,
      "Patient not found"
    );
  }

  if (patient.role !== "patient") {
    throw new ApiError(
      400,
      "Selected user is not a patient"
    );
  }

  // Check Doctor
  const doctor =
    await User.findById(doctorId);

  if (!doctor) {
    throw new ApiError(
      404,
      "Doctor not found"
    );
  }

  if (doctor.role !== "doctor") {
    throw new ApiError(
      400,
      "Selected user is not a doctor"
    );
  }


  const existingAppointment =
    await Appointment.findOne({
      patientId,
      doctorId,
      appointmentDate,
    });

  if (existingAppointment) {
    throw new ApiError(
      400,
      "Appointment already exists for this doctor on this date"
    );
  }

  const appointment =
    await Appointment.create({
      patientId,
      doctorId,
      appointmentDate,
    });

  return {

    success:true,

    appointment

  };

};

export const getAllAppointmentsService =
async()=>{

    const appointments =
    await Appointment.find()

    .populate(
        "patientId",
        "name email role"
    )

    .populate(
        "doctorId",
        "name email role"
    )

    .populate("slotId");

    return{

        success:true,

        appointments

    };

};

export const getAppointmentByIdService =
async(id)=>{


    const appointment =
    await Appointment.findById(id)

    .populate(
        "patientId",
        "name email role"
    )

    .populate(
        "doctorId",
        "name email role"
    )

    .populate("slotId");

    if(!appointment){

        throw new ApiError(
            404,
            "Appointment not found"
        );

    }

    return{

        success:true,

        appointment

    };

};

export const updateAppointmentStatusService = async (
  id,
  status
) => {

  const appointment =
    await Appointment.findById(id);

  if (!appointment) {
    throw new ApiError(
      404,
      "Appointment not found"
    );
  }

  const validTransitions = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
  };

  if (
    !validTransitions[
      appointment.status
    ].includes(status)
  ) {
    throw new ApiError(
      400,
      `Cannot change appointment from ${appointment.status} to ${status}`
    );
  }

  appointment.status = status;

  await appointment.save();

  return {
    success: true,
    message: "Appointment status updated",
    appointment,
  };

};

export const cancelAppointmentService = async (
  id
) => {

  const appointment =
    await Appointment.findById(id);

  if (!appointment) {
    throw new ApiError(
      404,
      "Appointment not found"
    );
  }

  if (appointment.status === "completed") {
    throw new ApiError(
      400,
      "Completed appointments cannot be cancelled"
    );
  }

  if (appointment.status === "cancelled") {
    throw new ApiError(
      400,
      "Appointment is already cancelled"
    );
  }

  appointment.status = "cancelled";

  await appointment.save();

  // Free booked slot
  if (appointment.slotId) {

    const slot = await Slot.findById(
      appointment.slotId
    );

    if (slot) {

      slot.isBooked = false;

      await slot.save();

    }

  }

  return {
    success: true,
    message:
      "Appointment cancelled successfully",
    appointment,
  };

};

export const bookSlotAppointmentService = async (
  patientId,
  slotId
) => {

  const patient = await User.findById(patientId);

  if (!patient) {
    throw new ApiError(
      404,
      "Patient not found"
    );
  }

  if (patient.role !== "patient") {
    throw new ApiError(
      400,
      "Selected user is not a patient"
    );
  }

  const slot = await Slot.findById(slotId);

  if (!slot) {
    throw new ApiError(
      404,
      "Slot not found"
    );
  }

  const today = new Date();
  today.setHours(0,0,0,0);

  const slotDate = new Date(slot.date);
  slotDate.setHours(0,0,0,0);

  if(slotDate < today){
    throw new ApiError(
      400,
      "Cannot book past slots"
    );
  }

  if(slot.isBooked){
    throw new ApiError(
      400,
      "Slot already booked"
    );
  }

  const existingAppointment =
    await Appointment.findOne({
      patientId,
      slotId,
    });

  if(existingAppointment){
    throw new ApiError(
      400,
      "Appointment already exists for this slot"
    );
  }

  const appointment =
    await Appointment.create({

      patientId,

      doctorId: slot.doctorId,

      slotId,

      appointmentDate: slot.date,

    });

  slot.isBooked = true;

  await slot.save();

  return{

    success:true,

    appointment

  };

};
export const getPatientAppointmentsService =
async(patientId)=>{


    const patient =
    await User.findById(patientId);

    if(!patient){

        throw new ApiError(
            404,
            "Patient not found"
        );

    }

    if(patient.role!=="patient"){

        throw new ApiError(
            400,
            "Selected user is not a patient"
        );

    }

    const appointments =
    await Appointment.find({
        patientId
    })

    .populate(
        "patientId",
        "name email role"
    )

    .populate(
        "doctorId",
        "name email role"
    )

    .populate("slotId")

    .sort({
        appointmentDate:-1
    });

    return{

        success:true,

        count:appointments.length,

        appointments

    };

};
export const getDoctorAppointmentsService =
async(doctorId)=>{


    const doctor =
    await User.findById(doctorId);

    if(!doctor){

        throw new ApiError(
            404,
            "Doctor not found"
        );

    }

    if(doctor.role!=="doctor"){

        throw new ApiError(
            400,
            "Selected user is not a doctor"
        );

    }

    const appointments =
    await Appointment.find({
        doctorId
    })

    .populate(
        "patientId",
        "name email role"
    )

    .populate(
        "doctorId",
        "name email role"
    )

    .populate("slotId")

    .sort({
        appointmentDate:1
    });

    return{

        success:true,

        count:appointments.length,

        appointments

    };

};

export const getMyAppointmentsService =
async(user)=>{

    let query={};

    if(user.role==="patient"){

        query.patientId=user.id;

    }

    else if(user.role==="doctor"){

        query.doctorId=user.id;

    }

    else{

        throw new ApiError(
            403,
            "Invalid role"
        );

    }

    const appointments =
    await Appointment.find(query)

    .populate(
        "patientId",
        "name email role"
    )

    .populate(
        "doctorId",
        "name email role"
    )

    .populate("slotId")

    .sort({
        appointmentDate:-1
    });

    return{

        success:true,

        count:appointments.length,

        appointments

    };

};