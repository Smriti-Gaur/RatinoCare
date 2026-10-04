import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Report from "../models/Report.js";
import Slot from "../models/Slot.js";

export const getAdminDashboardService = async () => {

  const [
    totalDoctors,
    totalPatients,
    totalAppointments,
    pendingAppointments,
    confirmedAppointments,
    completedAppointments,
    cancelledAppointments,
    totalReports,
    availableSlots,
    bookedSlots,
  ] = await Promise.all([
    User.countDocuments({
      role: "doctor",
    }),
    User.countDocuments({
      role: "patient",
    }),
    Appointment.countDocuments(),
    Appointment.countDocuments({
      status: "pending",
    }),

    Appointment.countDocuments({
      status: "confirmed",
    }),

    Appointment.countDocuments({
      status: "completed",
    }),

    Appointment.countDocuments({
      status: "cancelled",
    }),

    Report.countDocuments(),

    Slot.countDocuments({
      isBooked: false,
    }),

    Slot.countDocuments({
      isBooked: true,
    }),

  ]);

  return {
    totalDoctors,
    totalPatients,
    totalAppointments,
    pendingAppointments,
    confirmedAppointments,
    completedAppointments,
    cancelledAppointments,
    totalReports,
    availableSlots,
    bookedSlots,
  };

};

export const getDoctorDashboardService = async (
  doctorId
) => {
  const doctor = await User.findOne({
    _id: doctorId,
    role: "doctor",
  }).select("isApproved approvalStatus approvalReason");

  if (!doctor) {
    return {
      isApproved: false,
      approvalStatus: doctor.approvalStatus,
      approvalReason: doctor.approvalReason,
      doctorUnavailable: true,
    };
  }

  if (!doctor.isApproved) {
    return {
      isApproved: false,
      todayAppointments: 0,
      pendingAppointments: 0,
      confirmedAppointments: 0,
      completedAppointments: 0,
      cancelledAppointments: 0,
      availableSlots: 0,
      bookedSlots: 0,
      reportsCreated: 0,
    };
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);

  tomorrow.setDate(
    tomorrow.getDate() + 1
  );

  const [
    todayAppointments,
    pendingAppointments,
    confirmedAppointments,
    completedAppointments,
    cancelledAppointments,
    availableSlots,
    bookedSlots,
    reportsCreated,
  ] = await Promise.all([

    Appointment.countDocuments({
      doctorId,
      appointmentDate: {
        $gte: today,
        $lt: tomorrow,
      },
    }),

    Appointment.countDocuments({
      doctorId,
      status: "pending",
    }),

    Appointment.countDocuments({
      doctorId,
      status: "confirmed",
    }),

    Appointment.countDocuments({
      doctorId,
      status: "completed",
    }),

    Appointment.countDocuments({
      doctorId,
      status: "cancelled",
    }),

    Slot.countDocuments({
      doctorId,
      isBooked: false,
    }),

    Slot.countDocuments({
      doctorId,
      isBooked: true,
    }),

    Report.countDocuments({
      doctorId,
    }),

  ]);

  return {
    isApproved: true,
    approvalStatus: doctor.approvalStatus,
    approvalReason: doctor.approvalReason,
    todayAppointments,
    pendingAppointments,
    confirmedAppointments,
    completedAppointments,
    cancelledAppointments,
    availableSlots,
    bookedSlots,
    reportsCreated,
  };

};

export const getPatientDashboardService = async (
  patientId
) => {

  const [
    totalAppointments,
    pendingAppointments,
    confirmedAppointments,
    completedAppointments,
    cancelledAppointments,
    latestReport,
    nextAppointment,
  ] = await Promise.all([

    Appointment.countDocuments({
      patientId,
    }),

    Appointment.countDocuments({
      patientId,
      status: "pending",
    }),

    Appointment.countDocuments({
      patientId,
      status: "confirmed",
    }),

    Appointment.countDocuments({
      patientId,
      status: "completed",
    }),

    Appointment.countDocuments({
      patientId,
      status: "cancelled",
    }),

    Report.findOne({
      patientId,
    })
      .sort({ createdAt: -1 })
      .populate(
        "doctorId",
        "name email"
      ),

    Appointment.findOne({
      patientId,
      status: {
        $in: ["pending", "confirmed"],
      },
      appointmentDate: {
        $gte: new Date(),
      },
    })
      .sort({
        appointmentDate: 1,
      })
      .populate(
        "doctorId",
        "name email"
      ),

  ]);

  return {
    totalAppointments,
    pendingAppointments,
    confirmedAppointments,
    completedAppointments,
    cancelledAppointments,
    latestReport,
    nextAppointment,
  };

};