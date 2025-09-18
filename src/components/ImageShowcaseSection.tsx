
import React from "react";

const ImageShowcaseSection = () => {
  return (
    <section className="w-full pt-0 pb-8 sm:pb-12 bg-white" id="showcase">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 animate-on-scroll">
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-gray-900 mb-3 sm:mb-4">
            Professional Data Collection
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            See how our expert operators collect high-quality robot training data
            using state-of-the-art equipment and proven methodologies.
          </p>
        </div>
        
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant mx-auto max-w-4xl animate-on-scroll">
          <div className="w-full">
            <img 
              src="/robotics-lab-setup.png" 
              alt="Professional robotics data collection setup with robotic arm and sensors" 
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="bg-white p-4 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-display font-semibold mb-3 sm:mb-4">Hyphenbox Data Collection</h3>
            <p className="text-gray-700 text-sm sm:text-base">
              Our professional setup enables precise data collection across manipulation, 
              navigation, and custom robotics tasks. Every demonstration is captured with 
              multiple sensors to provide rich, multi-modal training datasets.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageShowcaseSection;
