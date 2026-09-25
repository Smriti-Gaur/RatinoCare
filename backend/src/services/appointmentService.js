import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import QueryFeatures from "../utils/QueryFeatures.js";
import Slot from "../models/Slot.js";

export const createAppointmentService = async (
  user,
  appointmentData
) => {

  const {
    doctorId,
    appointmentDate,
  } = appointmentData;

  const patientId = user.id;

  

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
    appointment

  };

};

export const getAllAppointmentsService = async (
  queryParams
) => {

  const features = new QueryFeatures(
    Appointment,
    queryParams
  )
    .filter()
    .search([]) // No searchable fields in Appointment yet
    .sort()
    .selectFields()
    .paginate();

  const appointments = await features.execute([
    {
      path: "patientId",
      select: "name email role",
    },
    {
      path: "doctorId",
      select: "name email role",
    },
    {
      path: "slotId",
    },
  ]);

  const pagination = await features.paginateResult();

  return {
    appointments,
    pagination,
  };

};

export const getAppointmentByIdService =
async(id, user)=>{


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

    const isOwner = [appointment.patientId._id, appointment.doctorId._id]
      .some((ownerId) => ownerId.toString() === user.id);

    if (user.role !== "admin" && !isOwner) {
      throw new ApiError(403, "Access denied");
    }

    return{
        appointment

    };

};

export const updateAppointmentStatusService = async (
  id,
  status,
  user
) => {

  const appointment =
    await Appointment.findById(id);

  if (!appointment) {
    throw new ApiError(
      404,
      "Appointment not found"
    );
  }

  if (user.role !== "admin" && appointment.doctorId.toString() !== user.id) {
    throw new ApiError(403, "You can update only your own appointments");
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

  if (status === "cancelled" && appointment.slotId) {
    await Slot.findOneAndUpdate(
      { _id: appointment.slotId },
      { $set: { isBooked: false } }
    );
  }

  return {
    message: "Appointment status updated",
    appointment,
  };

};

export const cancelAppointmentService = async (
  id,
  user
) => {

  const appointment =
    await Appointment.findById(id);

  if (!appointment) {
    throw new ApiError(
      404,
      "Appointment not found"
    );
  }

  const isOwner = [appointment.patientId, appointment.doctorId]
    .some((ownerId) => ownerId.toString() === user.id);

  if (user.role !== "admin" && !isOwner) {
    throw new ApiError(403, "You can cancel only your own appointments");
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

  const reservedSlot = await Slot.findOneAndUpdate(
    { _id: slotId, isBooked: false },
    { $set: { isBooked: true } },
    { new: true },
  );

  if (!reservedSlot) {
    throw new ApiError(400, "Slot already booked");
  }

  let appointment;

  try {
    appointment = await Appointment.create({
      patientId,
      doctorId: reservedSlot.doctorId,
      slotId,
      appointmentDate: reservedSlot.date,
    });
  } catch (error) {
    await Slot.findOneAndUpdate(
      { _id: slotId, isBooked: true },
      { $set: { isBooked: false } },
    );
    throw error;
  }

  return{
    appointment
  };

};
export const getPatientAppointmentsService = async (
  patientId,
  queryParams
) => {


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

const features = new QueryFeatures(
  Appointment,
  queryParams
)
  .filter()
  .search([])
  .sort()
  .selectFields()
  .paginate();

// Force patient filter
features.addFilter(
    "patientId",
    patientId
);

const appointments = await features.execute([
  {
    path: "patientId",
    select: "name email role",
  },
  {
    path: "doctorId",
    select: "name email role",
  },
  {
    path: "slotId",
  },
]);

const pagination =
  await features.paginateResult();

return {
  appointments,
  pagination,
};

};
export const getDoctorAppointmentsService =
async(doctorId, queryParams = {})=>{


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

   const features = new QueryFeatures(
    Appointment,
    queryParams
)

.filter()

.addFilter(
    "doctorId",
    doctorId
)

.search([])

.sort()

.selectFields()

.paginate();

const appointments =
await features.execute([
    {
        path:"patientId",
        select:"name email role"
    },
    {
        path:"doctorId",
        select:"name email role"
    },
    {
        path:"slotId"
    }
]);

const pagination =
await features.paginateResult();

return{

    appointments,

    pagination

};

};

export const getMyAppointmentsService = async (
  user,
  queryParams
) => {

  const features = new QueryFeatures(
    Appointment,
    queryParams
  )
    .filter();

  // Apply role-based filter
  if (user.role === "patient") {

    features.addFilter(
      "patientId",
      user.id
    );

  }

  else if (user.role === "doctor") {

    features.addFilter(
      "doctorId",
      user.id
    );

  }

  else if (user.role !== "admin") {
    throw new ApiError(403, "Invalid role");
  }

  else {

    throw new ApiError(
      403,
      "Invalid role"
    );

  }

  features
    .search([]) // No searchable Appointment fields yet
    .sort()
    .selectFields()
    .paginate();

  const appointments = await features.execute([
    {
      path: "patientId",
      select: "name email role",
    },
    {
      path: "doctorId",
      select: "name email role",
    },
    {
      path: "slotId",
    },
  ]);

  const pagination =
    await features.paginateResult();

  return {
    appointments,
    pagination,
  };

};