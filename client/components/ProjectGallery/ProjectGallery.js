'use client';
import React, { useState } from 'react';
import Image from 'next/image';

const ProjectGallery = ({ project }) => {
    // If no gallery exists or it's empty, we construct an array using pImg as fallback.
    const galleryItems = project?.gallery?.length > 0 ? project.gallery : [project.pImg];
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="project-gallery-wrapper w-100">
            {/* Main Featured Image */}
            <div className="main-image-container position-relative mb-3" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                <Image
                    src={`/${galleryItems[activeIndex]}`}
                    alt={`${project.title} - Main Gallery Preview`}
                    width={1200}
                    height={630}
                    className="w-100 shadow-sm"
                    style={{ height: 'auto', objectFit: 'cover' }}
                    priority
                />
            </div>

            {/* Thumbnails */}
            {galleryItems.length > 1 && (
                <div className="thumbnails-wrapper d-flex flex-wrap gap-2 justify-content-center">
                    {galleryItems.map((imgSrc, idx) => {
                        const isActive = idx === activeIndex;
                        return (
                            <button
                                key={idx}
                                onClick={() => setActiveIndex(idx)}
                                className={`thumbnail-btn border-0 p-0 ${isActive ? 'active-thumb shadow' : ''}`}
                                style={{
                                    width: '100px',
                                    height: '70px',
                                    borderRadius: '5px',
                                    overflow: 'hidden',
                                    opacity: isActive ? 1 : 0.6,
                                    cursor: 'pointer',
                                    transition: 'opacity 0.3s ease, transform 0.2s',
                                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                                    border: isActive ? '2px solid #ff4a57' : '2px solid transparent',
                                }}
                            >
                                <Image
                                    src={`/${imgSrc}`}
                                    alt={`${project.title} - Thumbnail ${idx + 1}`}
                                    width={100}
                                    height={70}
                                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ProjectGallery;
