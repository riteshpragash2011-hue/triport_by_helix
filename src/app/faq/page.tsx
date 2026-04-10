import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about TRIport — how requests work, what Helix manufactures, materials, timelines, and pricing.",
};

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: { section: string; items: FAQItem[] }[] = [
  {
    section: "About TRIport",
    items: [
      {
        question: "What is TRIport?",
        answer:
          "TRIport is the customer-facing platform of Helix — a distributed manufacturing collective built around 3D printing. It connects people who need precision parts with the skilled operators who make them. It is not an e-commerce store. Every item is manufactured on demand, following a request-and-confirm workflow.",
      },
      {
        question: "Is this a normal online shop?",
        answer:
          "No. TRIport is a request-based platform, not an automated checkout system. When you submit a request, a Helix member reviews it, confirms feasibility, and provides a quote. You only commit once you have agreed to the timeline and price.",
      },
      {
        question: "Who fulfils the requests?",
        answer:
          "Requests are reviewed and fulfilled by Helix members — experienced 3D printing operators who work within the Helix manufacturing network. Each request is personally assessed before production begins.",
      },
    ],
  },
  {
    section: "Requests & Process",
    items: [
      {
        question: "How do I place a request?",
        answer:
          "Browse the product catalog and click 'View Details' on any product. Fill in the short request form with your name, email, quantity, and any notes. Submit — Helix will review and respond within 2 business days. Alternatively, use the Custom Request page to describe a part from scratch.",
      },
      {
        question: "What happens after I submit?",
        answer:
          "A Helix member reviews your request for technical feasibility, estimates material cost and print time, and responds with a quote and estimated timeline. No payment is taken until you confirm the quote.",
      },
      {
        question: "Can I cancel before confirming?",
        answer:
          "Yes. Until you formally confirm the quote provided by Helix, there is no obligation or charge. You are free to decline or request changes to the quote.",
      },
      {
        question: "How long does fulfilment take?",
        answer:
          "Timeline depends on part complexity, size, and current queue. Standard requests typically take 2–4 weeks from confirmation. Expedited options (1–2 weeks) are available and can be specified in your request form. Helix will always confirm a realistic timeline before you commit.",
      },
    ],
  },
  {
    section: "Custom Prints",
    items: [
      {
        question: "Can Helix design the part for me?",
        answer:
          "Yes. If you have an idea but no 3D model, Helix members can assess whether design services are feasible for your project. Include as much detail as possible in your custom request — sketches, reference images, and dimension notes all help.",
      },
      {
        question: "Can I request multiple quantities of a custom part?",
        answer:
          "Yes. Specify your quantity in the request form. For larger production runs, mention this in your notes — Helix may be able to adjust pricing for batch orders.",
      },
    ],
  },
  {
    section: "Materials & Quality",
    items: [
      {
        question: "What materials are available?",
        answer:
          "Helix prints in PLA, ABS, PETG, TPU, PA, PA-CF, PLA-CF, PET, ASA, PPA-CF, and HIPS. If you are unsure which material suits your use case, select 'Advise me' in the request form and a Helix member will recommend the best option.",
      },
      {
        question: "What are the maximum build dimensions?",
        answer:
          "The maximum build volume is 350mm × 350mm × 350mm. Parts exceeding this cannot be accommodated. Specify your dimensions in the request form — if your part is too large, Helix will let you know.",
      },
    ],
  },
  {
    section: "Pricing",
    items: [
      {
        question: "Why are prices listed as 'estimated'?",
        answer:
          "Prices vary based on material choice, infill density, print time, post-processing, and quantity. Displayed prices are a starting reference — your confirmed quote from Helix will reflect the actual cost for your specific configuration.",
      },
      {
        question: "When do I pay?",
        answer:
          "Payment details are arranged directly with Helix after you confirm a quote. No payment information is collected through TRIport. The platform is for request submission and communication only.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-neutral-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <p className="section-label mb-4">Support</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight leading-tight mb-5">
            Frequently Asked Questions
          </h1>
          <p className="text-neutral-500 text-lg leading-relaxed max-w-xl">
            Everything you need to know about how TRIport works, what Helix manufactures, and how to get started.
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">
        {faqs.map((group) => (
          <section key={group.section}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-6">
              {group.section}
            </h2>
            <div className="space-y-px">
              {group.items.map((item, idx) => (
                <FAQItem key={idx} question={item.question} answer={item.answer} />
              ))}
            </div>
          </section>
        ))}

        {/* Still have questions CTA */}
        <div className="border border-neutral-100 rounded-sm p-8 bg-neutral-50 text-center">
          <h3 className="font-semibold text-neutral-900 text-lg mb-2">
            Still have questions?
          </h3>
          <p className="text-sm text-neutral-500 mb-6 max-w-sm mx-auto">
            Submit a custom request and describe your project. Helix will get back to you within 2 business days.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/custom-request" className="btn-gold">
              Submit a Request
            </Link>
            <Link href="/about" className="btn-outline">
              Learn How It Works
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: FAQItem) {
  return (
    <details className="group border border-neutral-100 rounded-sm overflow-hidden">
      <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none hover:bg-neutral-50 transition-colors select-none">
        <span className="font-medium text-neutral-900 text-sm leading-snug pr-4">
          {question}
        </span>
        <span
          className="shrink-0 w-5 h-5 flex items-center justify-center text-gold transition-transform duration-200 group-open:rotate-45"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
        </span>
      </summary>
      <div className="px-6 pb-5 pt-1 border-t border-neutral-100">
        <p className="text-sm text-neutral-500 leading-relaxed">{answer}</p>
      </div>
    </details>
  );
}
