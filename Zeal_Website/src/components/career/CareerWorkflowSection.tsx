import React from 'react';
import {Factory, ShieldCheck, Warehouse,  CheckCircle2, Truck,  ArrowRight,Database, CreditCard} from 'lucide-react';

export const CareerWorkflowSection: React.FC = () => {
  const workflowPhases = [
    {
      phase: '01',
      title: 'Bulk Sourcing & Purchasing',
      roles: 'Purchase Manager & Inward Team',
      desc: 'Direct procurement orders placed with accredited WHO-GMP manufacturers across India, negotiating competitive bulk rates.',
      icon: <Factory size={22} />,
      bg: '#F5F3FF',
      border: '#DDD6FE',
      accent: 'var(--zp-primary, #6828DC)',
    },
    {
      phase: '02',
      title: 'Statutory Inspection & Pharmacist Approval',
      roles: 'Registered Pharmacist & QA Specialist',
      desc: 'Rigorous batch test report verification, temperature data validation, physical seal checks, and FEFO registration.',
      icon: <ShieldCheck size={22} />,
      bg: '#ECFDF5',
      border: '#A7F3D0',
      accent: '#059669',
    },
    {
      phase: '03',
      title: 'Surat Central Depot Storage',
      roles: 'Inventory Supervisor & Store Officers',
      desc: 'Systematic placement within air-conditioned warehouse racks following First-Expiry, First-Out (FEFO) protocols.',
      icon: <Warehouse size={22} />,
      bg: '#FFF7ED',
      border: '#FED7AA',
      accent: '#EA580C',
    },
    {
      phase: '04',
      title: 'Order Processing & Verification',
      roles: 'Order Pickers & Verification Officers',
      desc: 'Computerized picking slip generation, double-verification of batch and expiry, and shock-resistant safety packaging.',
      icon: <CheckCircle2 size={22} />,
      bg: '#EFF6FF',
      border: '#BFDBFE',
      accent: '#2563EB',
    },
    {
      phase: '05',
      title: 'Express 24–48h Dispatch & Logistics',
      roles: 'Logistics Fleet & Dispatch Executives',
      desc: 'Immediate handover to verified logistics partners with active tracking dockets for door-to-door pan-India delivery.',
      icon: <Truck size={22} />,
      bg: '#FDF2F8',
      border: '#FCE7F3',
      accent: '#DB2777',
    },
  ];

  const supportDepartments = [
    {
      name: 'Inventory Software & ERP',
      icon: <Database size={18} style={{ color: 'var(--zp-primary, #6828DC)' }} />,
      role: 'Real-time stock ledger, batch/expiry master updates, inwards data entry, and audit reporting.',
    },
    {
      name: 'Accounts & GST Billing',
      icon: <CreditCard size={18} style={{ color: '#059669' }} />,
      role: 'Tax invoice generation, GST e-way bills, distributor ledger reconciliations, and supplier payments.',
    },
    {
      name: 'Registered Pharmacist & Compliance',
      icon: <ShieldCheck size={18} style={{ color: '#0284C7' }} />,
      role: 'Drug Act compliance, schedule register maintenance, batch quarantine, and storage audits.',
    },
    {
      name: 'Warehouse Operations & Dispatch',
      icon: <Warehouse size={18} style={{ color: '#D97706' }} />,
      role: 'Godown supervision, manpower scheduling, picking speed, FEFO rotation, and facility hygiene.',
    },
  ];

  return (
    <section style={{ padding: '72px 0 68px', background: '#FFFFFF', borderTop: '1.5px solid #E2E8F0', borderBottom: '1.5px solid #E2E8F0' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px' }}>
          <div
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FAF5FF', border: '1.5px solid #DDD6FE',  borderRadius: '999px', padding: '6px 18px', fontSize: '12.5px', fontWeight: 800, color:'var(--zp-primary, #6828DC)',marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-heading, "Outfit", sans-serif)',}}>
            <span>Third-Party Pharmaceutical Wholesale Stockist Model</span>
          </div>

          <h2
            style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', fontWeight: 900, color: '#0F172A', lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: '14px', fontFamily: 'var(--font-heading, "Outfit", sans-serif)', }}>
            End-to-End Operational Workflow
          </h2>

          <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6, margin: 0, fontFamily: 'var(--font-body, "Plus Jakarta Sans", sans-serif)' }}>
            Zeal Pharma operates strictly as an <strong>Authorized Third-Party Medicine Stockist &amp; Wholesale Distributor</strong>. We procure bulk supplies directly from WHO-GMP accredited manufacturers and coordinate seamless quality-inspected delivery across India.
          </p>
        </div>

        {/* 5-Phase Workflow Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '18px', position: 'relative' }}>
          {workflowPhases.map((phase, idx) => (
            <div
              key={idx}
              className="zp-card-subtle"
              style={{ background: '#FFFFFF', borderRadius: '20px', border: `1.5px solid ${phase.border}`, padding: '24px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)', position: 'relative', }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div
                    style={{ width: '46px', height: '46px', borderRadius: '14px', background: phase.bg, border: `1px solid ${phase.border}`, color: phase.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
                    {phase.icon}
                  </div>
                  <span
                    style={{ fontSize: '22px', fontWeight: 900,color: phase.accent, fontFamily: 'var(--font-heading, "Outfit", sans-serif)', opacity: 0.7, }}>
                    {phase.phase}
                  </span>
                </div>

                <h4
                  style={{ fontFamily: 'var(--font-heading, "Outfit", sans-serif)', fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0', lineHeight: 1.3, }}>
                  {phase.title}
                </h4>

                <div style={{ fontSize: '11px', fontWeight: 700, color: phase.accent, marginBottom: '10px' }}>
                  {phase.roles}
                </div>

                <p style={{ fontSize: '12.5px', color: '#64748B', lineHeight: 1.55, margin: 0 }}>
                  {phase.desc}
                </p>
              </div>

              {idx < workflowPhases.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', fontWeight: 700, color: '#94A3B8', marginTop: '16px' }}>
                  <span>Next Stage</span>
                  <ArrowRight size={12} style={{ color: phase.accent }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Supporting Operations Grid */}
        <div style={{ marginTop: '48px', background: '#F8FAFC', borderRadius: '24px', padding: '36px 32px', border: '1.5px solid #E2E8F0' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 28px' }}>
            <span
              style={{ background: '#EDE9FE', color: 'var(--zp-primary, #6828DC)',  padding: '4px 14px', borderRadius: '999px',  fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-heading, "Outfit", sans-serif)', }}>
              Collaborative Backbone
            </span>
            <h3
              style={{ fontFamily: 'var(--font-heading, "Outfit", sans-serif)', fontSize: '22px', fontWeight: 900, color: '#0F172A', marginTop: '10px', marginBottom: '6px', }}>
              Parallel Operations &amp; Support Departments
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0 }}>
              Operating seamlessly alongside our central godown floor to maintain strict drug regulatory compliance and zero-delay invoicing.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {supportDepartments.map((dept, idx) => (
              <div
                key={idx}
                style={{ background: '#FFFFFF', borderRadius: '16px', padding: '18px 16px', border: '1.5px solid #E2E8F0', boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)', }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div
                    style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, }}>
                    {dept.icon}
                  </div>
                  <div style={{ fontFamily: 'var(--font-heading, "Outfit", sans-serif)', fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>
                    {dept.name}
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                  {dept.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
