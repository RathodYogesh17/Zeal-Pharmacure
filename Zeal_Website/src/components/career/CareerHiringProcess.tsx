import React from 'react';
import { CheckCircle2, FileCheck, PhoneCall, BrainCircuit, Award,Sparkles,} from 'lucide-react';

export const CareerHiringProcess: React.FC = () => {
  const hiringSteps = [
    {
      step: '01',
      icon: <FileCheck size={22} color="var(--zp-primary)" />,
      title: 'Application Review',
      desc: 'Our Talent Acquisition team carefully reviews your resume against the department vacancy criteria within 48 business hours.',
    },
    {
      step: '02',
      icon: <PhoneCall size={22} color="#10B981" />,
      title: 'HR Telephonic Screening',
      desc: 'A brief 15-minute introductory call to align your career aspirations, location preference, and compensation expectations.',
    },
    {
      step: '03',
      icon: <BrainCircuit size={22} color="#2563EB" />,
      title: 'Technical Assessment',
      desc: 'In-depth assessment with the Department Head covering therapeutic domain expertise, field sales experience, or analytical QA skills.',
    },
    {
      step: '04',
      icon: <Award size={22} color="#D97706" />,
      title: 'Leadership Round',
      desc: 'Interactive discussion with Executive Directors regarding growth roadmaps, performance incentives, and organizational culture.',
    },
    {
      step: '05',
      icon: <Sparkles size={22} color="#7C3AED" />,
      title: 'Offer & Onboarding',
      desc: 'Formal offer release on company payroll with transparent CTC breakdown, medical coverage, and structured training induction.',
    },
  ];

  return (
    <section style={{ background: '#FFFFFF', padding: '64px 0 80px', borderTop: '1px solid #F1F5F9' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 800, color: '#6828DC', background: '#EDE9FE', padding: '4px 14px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px', }}>
            <CheckCircle2 size={13} />
            <span>Transparent Recruitment</span>
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 900, color: '#0F172A', margin: '0 0 10px 0', letterSpacing: '-0.02em', }}>
            Our 5-Step Hiring Process </h2>
          <p style={{ fontSize: '14.5px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
            We guarantee an objective, communicative, and timely candidate journey from initial application to day-one orientation.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', }}>
          {hiringSteps.map((s, idx) => (
            <div
              key={idx}
              style={{ background: '#F8FAFC', borderRadius: '20px',  padding: '28px 22px', border: '1.5px solid #E2E8F0', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.2s ease', }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',  marginBottom: '16px', }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)', }}>
                    {s.icon}
                  </div>
                  <span style={{ fontSize: '24px', fontWeight: 900, color: '#CBD5E1',  letterSpacing: '-0.03em', }} >
                    {s.step}
                  </span>
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0',  lineHeight: 1.3, }} >
                  {s.title}
                </h4>
                <p style={{ fontSize: '12.5px', color: '#64748B', lineHeight: 1.55, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
