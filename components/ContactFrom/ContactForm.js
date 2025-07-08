"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

const ContactForm = () => {
  const t = useTranslations("contact");

  // Zod validation schema
  const contactSchema = z.object({
    name: z
      .string()
      .min(1, t('formErrors.nameInvalid'))
      .regex(/^[a-zA-Z\s]+$/, t('formErrors.nameInvalid')),
    email: z.string().min(1, t('formErrors.emailRequired')).email(t('formErrors.emailInvalid')),
    message: z.string().min(1, t('formErrors.messageRequired')),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    reset(); // Reset form after submission
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="contact-validation-active"
    >
      <div className="row">
        <div className="col col-lg-12 col-12">
          <div className="form-field">
            <input
              {...register("name")}
              type="text"
              placeholder={t("form.name")}
            />
            {errors.name && (
              <p className="errorMessage">{errors.name.message}</p>
            )}
          </div>
        </div>
        <div className="col col-lg-12 col-12">
          <div className="form-field">
            <input
              {...register("email")}
              type="email"
              placeholder={t("form.email")}
            />
            {errors.email && (
              <p className="errorMessage">{errors.email.message}</p>
            )}
          </div>
        </div>
        <div className="col col-lg-12 col-12">
          <textarea {...register("message")} placeholder={t("form.message")} />
          {errors.message && (
            <p className="errorMessage">{errors.message.message}</p>
          )}
        </div>
      </div>
      <div className="submit-area">
        <button type="submit" className="theme-btn">
          {t("form.submitButton")}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
