
import React, { useRef } from "react";

const HumanIntuitionSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-12 bg-gray-50" id="human-intuition" ref={sectionRef}> {/* Reduced from py-20 */}
      <div className="section-container opacity-0 animate-on-scroll">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <div className="pulse-chip mb-4">
              <span>Expert Quality</span>
            </div>
            <h2 className="section-title mb-6">Professional Data Collection at Scale</h2>
            <p className="text-lg text-gray-700 mb-6">
              Our team of expert operators brings years of robotics experience to ensure every
              demonstration meets the highest quality standards. We understand the nuances that
              make training data truly effective for robot learning.
            </p>
            <ul className="space-y-4">
              {[
                "Consistent technique across thousands of demonstrations",
                "Deep understanding of robot learning requirements",
                "Rigorous quality control and validation processes",
                "Customized data collection for your specific use cases"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="mr-3 text-pulse-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Image container div has been removed */}
        </div>
      </div>
    </section>
  );
};

export default HumanIntuitionSection;
