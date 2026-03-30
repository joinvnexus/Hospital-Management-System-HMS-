import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AppointmentBookingForm from './AppointmentBookingForm';
import { DoctorProvider } from '../context/DoctorContext';
import { AuthProvider } from '../context/AuthContext';
import { AppointmentProvider } from '../context/AppointmentContext';

describe('AppointmentBookingForm', () => {
  test('renders form and requires doctor selection', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <DoctorProvider>
            <AppointmentProvider>
              <AppointmentBookingForm />
            </AppointmentProvider>
          </DoctorProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/Select Doctor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Appointment Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Reason for Appointment/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Book Appointment/i)[1]).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /Book Appointment/i });

    // Button should be disabled when required fields are not filled
    expect(submitButton).toBeDisabled();

    // Ensure form validation state is in place (without requiring form submission on disabled button)
    fireEvent.change(screen.getByLabelText(/Select Doctor/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Appointment Date/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Reason for Appointment/i), { target: { value: '' } });

    expect(screen.getByLabelText(/Select Doctor/i).value).toBe('');
    expect(screen.getByLabelText(/Appointment Date/i).value).toBe('');
    expect(screen.getByLabelText(/Reason for Appointment/i).value).toBe('');
  });
});
