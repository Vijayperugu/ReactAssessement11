import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import '../App.css'
import img from '../assets/prof.png' 
import { BsThreeDotsVertical } from 'react-icons/bs'
import { FaPencil } from 'react-icons/fa6'
import { FaTrash } from 'react-icons/fa6'

import {addAppointment, updateAppointment, deleteAppointment, setEditedId, clearEditedId, setToast, clearToast} from '../appointments/appointmentsSlice'

const emptyForm = {
    name: '',
    age: '',
    phone: '',
    drName: '',
    visitDate: '',
    visitTime: '',
    visitType: '',
    gender: '',
}

const DoctorApplication = () => {
    const [openActionId, setOpenActionId] = useState(null)
    const dispatch = useDispatch();
    const appointments = useSelector(state => state.appointments.appointments);
    const toast = useSelector(state => state.appointments.toast);
    const editedId = useSelector(state => state.appointments.editedId);
    const [formData, setFormData] = useState(emptyForm);
    const [buttonText, setButtonText] = useState('Book Appointment');


    useEffect(() => {
        if (toast) {
            const timeout = setTimeout(() => dispatch(clearToast()), 3000)
            return () => clearTimeout(timeout)
        }
    }, [toast, dispatch])


    useEffect(() => {
        setButtonText(editedId !== null ? 'Update Appointment' : 'Book Appointment')
        if (editedId === null) setFormData(emptyForm)
    }, [editedId])


    const showToast = (message, type) => {
        dispatch(setToast({ message, type }))
    }


    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }


    const validatePhone = (phone) => {
        const plain = phone.replace(/\s+/g, '')
        const re = /^\+?\d{7,15}$/
        return re.test(plain)
    }


    const validateTime = (t) => {
        const re = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i
        return re.test(t.trim())
    }


    const isEmpty = () => Object.values(formData).some((value) => value === '')


    const handleEdit = (id) => {
        const appointmentToEdit = appointments.find((app) => app.id === id)
        dispatch(setEditedId(id))
        if (appointmentToEdit) setFormData(appointmentToEdit)
        setOpenActionId(null)
    }


    const handleDelete = (id) => {
        dispatch(deleteAppointment(id))
        showToast('Appointment deleted', 'success')
        setOpenActionId(null)
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        if (isEmpty()) {
            showToast('Please fill all the fields', 'error')
            return
        }
        if (!validatePhone(formData.phone)) {
            showToast('Please enter a valid phone number', 'error')
            return
        }
        if (!validateTime(formData.visitTime)) {
            showToast('Please enter a valid time in HH:MM AM/PM format', 'error')
            return
        }


        if (editedId !== null) {
            dispatch(updateAppointment({ ...formData, id: editedId }))
            dispatch(clearEditedId())
            showToast('Appointment updated successfully', 'success')
            return
        }


        dispatch(addAppointment(formData))
        showToast('Appointment booked successfully', 'success')
        setFormData(emptyForm)
    }
    return (
        <div className="container">
            <p>Welcome to Gradious Doctor Appointment Booking</p>


            {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}


            <form onSubmit={handleSubmit}>
                <div className="form">
                    <input type="text" name="name" placeholder="Patient Name*" value={formData.name} onChange={handleChange} />
                    <input type="number" name="age" placeholder="Patient Age*" value={formData.age} onChange={handleChange} />
                    <input type="text" name="phone" placeholder="Patient Number*" value={formData.phone} onChange={handleChange} />
                    <input type="text" name="drName" placeholder="Doctor Name*" value={formData.drName} onChange={handleChange} />
                    <select name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="">Select Male/Female</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <input type="date" name="visitDate" placeholder="Visit Date*" value={formData.visitDate} onChange={handleChange} />
                    <input type="text" name="visitTime" placeholder="Visit Time (e.g. 06:00 PM)" value={formData.visitTime} onChange={handleChange} />
                    <select name="visitType" value={formData.visitType} onChange={handleChange}>
                        <option value="">Select Visit Type</option>
                        <option value="Consult">Consult</option>
                        <option value="Revisit">Revisit</option>
                    </select>
                </div>
                <button className="btnSubmit" type="submit">{buttonText}</button>
            </form>
            <table className="table">
                <thead>
                    <tr>
                        <th>Patient </th>
                        <th>Status</th>
                        <th>Appointment</th>
                        <th>Phone</th>
                        <th>Doctor</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                            <td>
                                <div className="user-info">
                                    <div className="user-info__img">
                                        <img src={img} alt="" />
                                    </div>
                                    <div className="user-info__basic">
                                        <h2>{appointment.name}</h2>
                                        <p>{appointment.age} yrs, {appointment.gender}</p>
                                    </div>
                                </div>
                            </td>


                            <td>
                                <button className="status-btn" style={{ backgroundColor: appointment.visitType === 'Consult' ? '#4CAF50' : '#364ff4ff' }}>
                                    {appointment.visitType}
                                </button>
                            </td>
                            <td>
                                <div className="appointment-time">
                                    <h3>{appointment.visitTime}</h3>
                                    <p>{appointment.visitDate}</p>
                                </div>
                            </td>
                            <td>
                                <div className="phone-contact">
                                    {appointment.phone}
                                    <p><a>contact</a></p>
                                </div>


                            </td>
                            <td>{appointment.drName}</td>


                            <td>
                                <div>
                                    <BsThreeDotsVertical onClick={() => setOpenActionId(openActionId === appointment.id ? null : appointment.id)} style={{ cursor: 'pointer' }} />
                                    {openActionId === appointment.id && (
                                        <div className="action-menu">
                                            <p onClick={() => handleEdit(appointment.id)}><FaPencil />Edit</p>
                                            <p className="delete" onClick={() => handleDelete(appointment.id)}><FaTrash />Delete</p>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}


export default DoctorApplication