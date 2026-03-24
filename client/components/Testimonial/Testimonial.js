'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

const Testimonial = ({ data, locale }) => {
    const t = useTranslations("testimonial");
    const staticTestimonials = t.raw("testimonials");

    const testimonials = data && data.length > 0 ? data.map(testi => ({
        id: testi.id,
        name: testi.name,
        designation: testi.designation[locale],
        description: testi.description[locale],
        image: testi.image
    })) : staticTestimonials;
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    };

    // Auto-slide every 5 seconds
    useEffect(() => {
        const timer = setInterval(nextTestimonial, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="wpo-testimonials-section section-padding" id="testimonials">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8 text-center">
                        <div className="wpo-section-title">
                            <h2>{t("title")}</h2>
                        </div>
                        <div className="testimonial-wrapper">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.5 }}
                                    className="testimonial-card"
                                >
                                    <div className="quote-icon">
                                        <i className="fa fa-quote-left"></i>
                                    </div>
                                    <p className="description">"{testimonials[currentIndex].description}"</p>
                                    <div className="testimonial-content">
                                        <div className="client-img">
                                            <Image
                                                src={`/${testimonials[currentIndex].image}`}
                                                alt={`Testimonial from ${testimonials[currentIndex].name}`}
                                                title={`Client avatar: ${testimonials[currentIndex].name}`}
                                                width={60}
                                                height={60}
                                            />
                                        </div>
                                        <div className="client-info">
                                            <h4>{testimonials[currentIndex].name}</h4>
                                            <span>{testimonials[currentIndex].designation}</span>
                                        </div>
                                    </div>
                                    <div className="rating">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className="fa fa-star"></i>
                                        ))}
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <div className="testimonial-navigation">
                                <button onClick={prevTestimonial} className="nav-btn prev" title="Previous Testimonial">
                                    <i className="ti-angle-left"></i>
                                </button>
                                <button onClick={nextTestimonial} className="nav-btn next" title="Next Testimonial">
                                    <i className="ti-angle-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonial;
