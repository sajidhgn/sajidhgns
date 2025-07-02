import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Zod validation schema
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').regex(/^[a-zA-Z\s]+$/, 'Only letters and spaces allowed'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  phone: z.string().min(1, 'Phone is required').regex(/^\+?\d{7,15}$/, 'Invalid phone number'),
  subject: z.enum(['Web Design', 'Web Development', 'Marketing'], {
    errorMap: () => ({ message: 'Subject is required' }),
  }),
  message: z.string().min(1, 'Message is required'),
});

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data) => {
    console.log('Form Data:', data);
    reset(); // Reset form after submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contact-validation-active">
      <div className="row">
        <div className="col col-lg-6 col-12">
          <div className="form-field">
            <input {...register('name')} type="text" placeholder="Your Name" />
            {errors.name && <p className="errorMessage">{errors.name.message}</p>}
          </div>
        </div>
        <div className="col col-lg-6 col-12">
          <div className="form-field">
            <input {...register('email')} type="email" placeholder="Your Email" />
            {errors.email && <p className="errorMessage">{errors.email.message}</p>}
          </div>
        </div>
        <div className="col col-lg-12 col-12">
          <div className="form-field">
            <input {...register('phone')} type="text" placeholder="Your Phone" />
            {errors.phone && <p className="errorMessage">{errors.phone.message}</p>}
          </div>
        </div>
        <div className="col col-lg-12 col-12">
          <div className="form-field">
            <select {...register('subject')}>
              <option value="">Choose a Service</option>
              <option value="Web Design">Web Design</option>
              <option value="Web Development">Web Development</option>
              <option value="Marketing">Marketing</option>
            </select>
            {errors.subject && <p className="errorMessage">{errors.subject.message}</p>}
          </div>
        </div>
        <div className="col col-lg-12 col-12">
          <textarea {...register('message')} placeholder="Message" />
          {errors.message && <p className="errorMessage">{errors.message.message}</p>}
        </div>
      </div>
      <div className="submit-area">
        <button type="submit" className="theme-btn">Submit Now</button>
      </div>
    </form>
  );
};

export default ContactForm;
