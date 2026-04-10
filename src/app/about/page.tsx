import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Helix and TRIport — a request-based distributed 3D printing manufacturing platform connecting customers with specialist manufacturers.",
};

const values = [
  {
    title: "Request-Driven",
    description:
      "Nothing is manufactured speculatively. Every item produced is the result of a direct request — reducing waste and ensuring parts are made to exact requirements.",
  },
  {
    title: "Precision-First",
    description:
      "Helix members maintain rigorous print quality standards. Each request is reviewed for feasibility before confirmation, ensuring every part meets specification.",
  },
  {
    title: "Transparent Process",
    description:
      "From request to delivery, customers know exactly what is happening at each step. No hidden costs, no ambiguity — just clear communication.",
  },
  {
    title: "Distributed by Design",
    description:
      "TRIport enables a network of Helix manufacturers rather than a single production facility. This keeps capacity flexible and response times fast.",
  },
];

const processSteps = [
  {
    phase: "Browsing",
    detail:
      "Customers explore the TRIport catalog of available 3D-printable products or navigate directly to the Custom Request page. Estimated prices are shown for reference — final pricing is confirmed per-request.",
  },
  {
    phase: "Request Submission",
    detail:
      "The customer submits a request form with their specifications: quantity, material preferences, deadlines, and any special requirements. No payment is taken at this stage.",
  },
  {
    phase: "Helix Review",
    detail:
      "A Helix member reviews the request for technical feasibility, estimates print time and material cost, and responds within 2 business days with a quote and timeline.",
  },
  {
    phase: "Confirmation & Production",
    detail:
      "Once the customer confirms, the part enters the production queue. Helix manufactures to specification and arranges delivery or pickup.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl">
            <p className="section-label mb-4">About</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight leading-tight mb-5">
              Manufacturing for the people who need it
            </h1>
            <p className="text-neutral-500 text-lg leading-relaxed">
              TRIport is the operational platform of Helix — a distributed manufacturing collective built around 3D printing technology. We connect customers who need precision parts with the skilled operators who make them.
            </p>
          </div>
        </div>
      </div>

      {/* Vision */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <p className="section-label mb-4">Our Vision</p>
              <h2 className="section-heading mb-5">
                Distributed manufacturing, democratised
              </h2>
              <p className="text-neutral-500 leading-relaxed mb-4">
                The traditional manufacturing model — centralised factories, large minimum order quantities, weeks-long lead times — doesn&apos;t serve individuals, small teams, or rapid prototypers. 3D printing changes that equation fundamentally.
              </p>
              <p className="text-neutral-500 leading-relaxed mb-4">
                Helix was founded on the principle that manufacturing capability should be accessible, responsive, and high-quality. TRIport is the interface that makes this possible: a request-based platform where anyone can commission a precision part without needing to own a printer.
              </p>
              <p className="text-neutral-500 leading-relaxed">
                The long-term vision is a network of Helix nodes — each with specialist equipment and material expertise — coordinating through TRIport to fulfil requests at scale.
              </p>
            </div>

            <div className="space-y-4">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="p-5 border border-neutral-100 rounded-sm hover:border-gold/30 transition-colors"
                >
                  <h3 className="font-semibold text-neutral-900 mb-1.5">
                    {v.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {v.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Request Process Detail */}
      <section className="bg-neutral-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-label mb-3">Platform</p>
            <h2 className="section-heading">How the request system works</h2>
            <p className="text-neutral-500 mt-4 max-w-xl mx-auto">
              TRIport is not an e-commerce store. It is a manufacturing request platform. Here is what that means in practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {processSteps.map((step, i) => (
              <div
                key={step.phase}
                className="bg-white border border-neutral-100 rounded-sm p-6 hover:border-gold/20 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-gold/10 text-gold text-sm font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">
                      {step.phase}
                    </h3>
                    <p className="text-sm text-neutral-500 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="section-label mb-4">Technology</p>
              <h2 className="section-heading mb-5">
                What Helix manufactures
              </h2>
              <p className="text-neutral-500 leading-relaxed mb-4">
                Helix operates FDM (Fused Deposition Modelling) printers with a range of engineering-grade filaments, as well as resin-based printers for high-detail applications. Current material offerings include PLA+, PETG, ASA, TPU, Nylon (PA12), and carbon-fibre reinforced composites.
              </p>
              <p className="text-neutral-500 leading-relaxed">
                Build volumes range from small precision components (under 50mm) to large structural parts up to 300mm × 300mm × 400mm. Post-processing services including sanding, primer, and hardware insertion are available on request.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                "Functional Parts",
                "Prototypes",
                "Enclosures",
                "Jigs & Fixtures",
                "Architectural Models",
                "Decorative Objects",
                "Consumer Products",
                "Custom Designs",
              ].map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-4 border border-neutral-100 rounded-sm text-sm text-neutral-600 hover:border-gold/30 hover:text-neutral-900 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" aria-hidden="true" />
                  <span className="font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-950 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
            Ready to make something?
          </h2>
          <p className="text-neutral-400 mb-8 max-w-md mx-auto">
            Browse the catalog or submit a custom request. No commitment required until you confirm.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-7 py-3 text-sm font-semibold text-white border border-neutral-700 hover:border-gold hover:text-gold transition-colors rounded-sm"
            >
              Browse Products
            </Link>
            <Link
              href="/custom-request"
              className="inline-flex items-center justify-center px-7 py-3 text-sm font-semibold text-neutral-950 bg-gold hover:bg-gold-light transition-colors rounded-sm"
            >
              Custom Request
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
