"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-toastify"; // ✅ import useState

const ContactForm = () => {
  const t = useTranslations("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toastOptions = {
    position: "top-right",
    autoClose: 5000,
    theme: "light",
  };

  // Zod validation schema
  const contactSchema = z.object({
    name: z
      .string()
      .min(1, t("formErrors.nameInvalid"))
      .regex(/^[a-zA-Z\s]+$/, t("formErrors.nameInvalid")),
    email: z
      .string()
      .min(1, t("formErrors.emailRequired"))
      .email(t("formErrors.emailInvalid")),
    message: z.string().min(1, t("formErrors.messageRequired")),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
        }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Email sent successfully",toastOptions);
        reset();
      } else {
        toast.error("Email not sent", toastOptions);
      }
    } catch (err) {
      console.error("Send error:", err);
      alert("An error occurred.");
    }

    setIsSubmitting(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="contact-validation-active"
    >
      <div className="row">
        <div className="col-12">
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
        <div className="col-12">
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
        <div className="col-12">
          <textarea {...register("message")} placeholder={t("form.message")} />
          {errors.message && (
            <p className="errorMessage">{errors.message.message}</p>
          )}
        </div>
      </div>

      <div className="submit-area mt-3">
        <button type="submit" className="theme-btn" disabled={isSubmitting}>
          {isSubmitting && (
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
          )}
          {isSubmitting ? "" : t("form.submitButton")}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
