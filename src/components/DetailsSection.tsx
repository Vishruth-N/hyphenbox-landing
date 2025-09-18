
import React from "react";
import DataRequirementsForm from "./DataRequirementsForm";

const DetailsSection = () => {
  return <section id="details" className="w-full bg-white py-0">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
          {/* Left Card - The Details */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant">
            {/* Card Header with background image instead of gradient */}
            <div className="relative h-48 sm:h-64 p-6 sm:p-8 flex items-end" style={{
            backgroundImage: "url('/background-section3.png')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}>
              <h2 className="text-2xl sm:text-3xl font-display text-white font-bold">
                The details
              </h2>
            </div>
            
            {/* Card Content */}
            <div className="bg-white p-4 sm:p-8" style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #ECECEC"
          }}>
              <h3 className="text-lg sm:text-xl font-display mb-6 sm:mb-8">
                Precision engineering meets adaptive intelligence
              </h3>

              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h4 className="text-xl font-display font-bold mb-3">Data Collection</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Custom datasets built for your specific field, with access to our extensive multi-modal data repository.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-display font-bold mb-3">Precision Data Processing</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Raw sensor inputs converted into fully annotated, quality-controlled datasets—production-ready for large-scale model training, robotics applications, and more.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card - Data Requirements Form */}
          <DataRequirementsForm />
        </div>
      </div>
    </section>;
};
export default DetailsSection;
