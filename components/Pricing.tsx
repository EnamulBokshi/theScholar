"use client";

import { useState } from "react";

type BillingCycle = "monthly" | "yearly";

interface PlanFeature {
  text: string;
}

interface Plan {
  id: string;
  name: string;
  price: number | null;
  description: string;
  features: PlanFeature[];
  accentColor: string;
  accentBg: string;
  buttonClass: string;
  glowClass?: string;
  ctaLabel: string;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: null,
    description: "For curious learners exploring the platform",
    features: [
      { text: "Core chat experience" },
      { text: "Limited daily questions" },
      { text: "Access to public content" },
    ],
    accentColor: "var(--palette-cyan)",
    accentBg: "rgba(86, 182, 198, 0.15)",
    buttonClass: "btn-cyan",
    ctaLabel: "Start free",
  },
  {
    id: "plus",
    name: "Scholar Plus",
    price: 12,
    description: "For regular study, voice sessions, and saved history",
    features: [
      { text: "Unlimited chat access" },
      { text: "Voice conversation support" },
      { text: "Saved conversations and favorites" },
    ],
    accentColor: "var(--palette-mint)",
    accentBg: "rgba(138, 203, 208, 0.15)",
    buttonClass: "btn-cyan",
    glowClass: "glow-cyan",
    ctaLabel: "Choose Plus",
  },
  {
    id: "institution",
    name: "Institution",
    price: 60,
    description: "For schools, study groups, and admin-managed workspaces",
    features: [
      { text: "Admin dashboard access" },
      { text: "Multi-user workspace support" },
      { text: "Custom policy and onboarding help" },
    ],
    accentColor: "var(--palette-cream)",
    accentBg: "rgba(239, 227, 202, 0.1)",
    buttonClass: "btn-cream",
    ctaLabel: "Contact sales",
  },
];

function CheckIcon({ color }: { color: string }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function PricingCard({
  plan,
  billingCycle,
}: {
  plan: Plan;
  billingCycle: BillingCycle;
}) {
  const displayPrice =
    plan.price === null
      ? null
      : billingCycle === "yearly"
      ? Math.round(plan.price * 0.8)
      : plan.price;

  return (
    <article className="pricing-card" data-plan={plan.id}>
      {plan.glowClass && <div className={`card-glow ${plan.glowClass}`} />}

      {/* Top accent bar */}
      <div
        className="card-accent-bar"
        style={{ background: plan.accentColor }}
      />

      {/* Plan badge */}
      <div className="card-header">
        <span className="plan-badge">{plan.name}</span>
      </div>

      {/* Price */}
      <div className="price-block">
        {displayPrice === null ? (
          <h2 className="price-text">FREE</h2>
        ) : (
          <div className="price-row">
            <h2 className="price-text">${displayPrice}</h2>
            <span className="price-period">/mo</span>
          </div>
        )}
        {billingCycle === "yearly" && plan.price !== null && (
          <span className="yearly-savings">
            Save ${(plan.price - Math.round(plan.price * 0.8)) * 12}/yr
          </span>
        )}
      </div>

      <p className="plan-description">{plan.description}</p>

      <div className="divider" />

      {/* Features */}
      <ul className="features-list">
        {plan.features.map((feature, i) => (
          <li key={i} className="feature-item">
            <span
              className="check-icon"
              style={{ background: plan.accentBg }}
            >
              <CheckIcon color={plan.accentColor} />
            </span>
            <span className="feature-text">{feature.text}</span>
          </li>
        ))}
      </ul>

      <button className={`purchase-btn ${plan.buttonClass}`}>
        {plan.ctaLabel}
      </button>

      <style jsx>{`
        .pricing-card {
          position: relative;
          background: rgba(31, 20, 136, 0.35);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(239, 227, 202, 0.08);
          border-radius: 24px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
        }
        .pricing-card:hover {
          transform: translateY(-6px);
          border-color: rgba(239, 227, 202, 0.18);
          box-shadow: 0 24px 60px rgba(23, 12, 121, 0.5);
        }
        .card-glow {
          position: absolute;
          top: -60px;
          right: -60px;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .glow-cyan {
          background: radial-gradient(
            circle,
            rgba(86, 182, 198, 0.18) 0%,
            transparent 70%
          );
        }
        .card-accent-bar {
          position: absolute;
          top: 0;
          left: 24px;
          right: 24px;
          height: 2px;
          border-radius: 0 0 4px 4px;
          opacity: 0.8;
        }
        .card-header {
          margin-bottom: 28px;
          position: relative;
          z-index: 1;
        }
        .plan-badge {
          display: inline-block;
          padding: 5px 14px;
          border-radius: 999px;
          border: 1px solid rgba(239, 227, 202, 0.2);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(239, 227, 202, 0.7);
          font-family: "DM Mono", monospace;
        }
        .price-block {
          margin-bottom: 8px;
          position: relative;
          z-index: 1;
        }
        .price-row {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }
        .price-text {
          font-size: 42px;
          font-weight: 800;
          color: #efe3ca;
          letter-spacing: -0.03em;
          line-height: 1;
          font-family: "DM Serif Display", serif;
        }
        .price-period {
          font-size: 14px;
          color: rgba(239, 227, 202, 0.45);
          font-weight: 400;
        }
        .yearly-savings {
          display: inline-block;
          margin-top: 6px;
          font-size: 11px;
          color: #8acbd0;
          background: rgba(138, 203, 208, 0.1);
          border: 1px solid rgba(138, 203, 208, 0.25);
          padding: 2px 8px;
          border-radius: 999px;
        }
        .plan-description {
          font-size: 13px;
          color: rgba(239, 227, 202, 0.45);
          margin-bottom: 24px;
          margin-top: 6px;
          position: relative;
          z-index: 1;
        }
        .divider {
          height: 1px;
          background: rgba(239, 227, 202, 0.08);
          margin-bottom: 24px;
        }
        .features-list {
          list-style: none;
          padding: 0;
          margin: 0 0 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex-grow: 1;
          position: relative;
          z-index: 1;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .check-icon {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .feature-text {
          font-size: 13.5px;
          color: rgba(239, 227, 202, 0.75);
          letter-spacing: 0.01em;
        }
        .purchase-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
          position: relative;
          z-index: 1;
        }
        .btn-mint {
          background: rgba(138, 203, 208, 0.15);
          color: #8acbd0;
          border: 1px solid rgba(138, 203, 208, 0.3);
        }
        .btn-mint:hover {
          background: rgba(138, 203, 208, 0.25);
          border-color: rgba(138, 203, 208, 0.5);
        }
        .btn-cyan {
          background: #56b6c6;
          color: #170c79;
        }
        .btn-cyan:hover {
          background: #6dc5d4;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(86, 182, 198, 0.35);
        }
        .btn-cream {
          background: rgba(239, 227, 202, 0.1);
          color: #efe3ca;
          border: 1px solid rgba(239, 227, 202, 0.2);
        }
        .btn-cream:hover {
          background: rgba(239, 227, 202, 0.18);
          border-color: rgba(239, 227, 202, 0.4);
        }
      `}</style>
    </article>
  );
}

export default function PricingPlans() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  return (
    <section className="pricing-section">
      {/* Background decor */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <div className="pricing-container">
        {/* Header */}
        <header className="pricing-header">
          <p className="pricing-eyebrow">Choose your access</p>
          <h1 className="pricing-title">
            Pick the plan that fits{" "}
            <span className="pricing-title-muted">your learning style</span>
          </h1>
          <p className="pricing-subtitle">
            Start free, upgrade for voice and saved study history, or add an admin-managed workspace.
          </p>
        </header>

        {/* Toggle */}
        <div className="toggle-wrapper">
          <div className="toggle-track">
            <button
              className={`toggle-btn ${billing === "monthly" ? "toggle-active" : ""}`}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </button>
            <button
              className={`toggle-btn ${billing === "yearly" ? "toggle-active" : ""}`}
              onClick={() => setBilling("yearly")}
            >
              Yearly
              <span className="savings-badge">−20%</span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="cards-grid">
          {PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} billingCycle={billing} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .pricing-section {
          position: relative;
          min-height: 100vh;
          background: var(--background, #170c79);
          padding: 80px 24px;
          overflow: hidden;
        }
        .bg-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
        }
        .bg-orb-1 {
          width: 500px;
          height: 500px;
          top: -100px;
          left: -100px;
          background: radial-gradient(
            circle,
            rgba(86, 182, 198, 0.12) 0%,
            transparent 60%
          );
        }
        .bg-orb-2 {
          width: 400px;
          height: 400px;
          bottom: 0;
          right: -80px;
          background: radial-gradient(
            circle,
            rgba(138, 203, 208, 0.1) 0%,
            transparent 60%
          );
        }
        .pricing-container {
          max-width: 1120px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .pricing-header {
          text-align: center;
          margin-bottom: 56px;
        }
        .pricing-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #56b6c6;
          margin-bottom: 16px;
          font-family: "DM Mono", monospace;
        }
        .pricing-title {
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 800;
          color: #efe3ca;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: 16px;
          font-family: "DM Serif Display", serif;
        }
        .pricing-title-muted {
          color: rgba(239, 227, 202, 0.4);
        }
        .pricing-subtitle {
          font-size: 16px;
          color: rgba(239, 227, 202, 0.45);
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .toggle-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 56px;
        }
        .toggle-track {
          display: inline-flex;
          background: rgba(31, 20, 136, 0.5);
          border: 1px solid rgba(239, 227, 202, 0.1);
          border-radius: 999px;
          padding: 5px;
          gap: 4px;
        }
        .toggle-btn {
          padding: 10px 28px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          background: transparent;
          color: rgba(239, 227, 202, 0.45);
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .toggle-btn:hover {
          color: rgba(239, 227, 202, 0.75);
        }
        .toggle-active {
          background: rgba(86, 182, 198, 0.15);
          color: #8acbd0;
          border: 1px solid rgba(86, 182, 198, 0.3) !important;
        }
        .savings-badge {
          font-size: 10px;
          font-weight: 700;
          background: rgba(138, 203, 208, 0.15);
          color: #8acbd0;
          border: 1px solid rgba(138, 203, 208, 0.3);
          padding: 2px 7px;
          border-radius: 999px;
          letter-spacing: 0.05em;
        }
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          align-items: stretch;
        }
        @media (min-width: 1024px) {
          .cards-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </section>
  );
}