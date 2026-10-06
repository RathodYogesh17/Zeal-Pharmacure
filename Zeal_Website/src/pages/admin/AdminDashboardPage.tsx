import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Inbox,
  Briefcase,
  Image,
  ArrowRight,
  Plus,
  Mail,
  Palette,
  Settings,
  Pill,
  FileText
} from 'lucide-react';
import { dashboardService } from '../../api/dashboardService';
import type { IDashboardStats } from '../../api/dashboardService';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<IDashboardStats>({
    totalProducts: 18,
    totalEnquiries: 120,
    franchiseEnquiries: 30,
    openJobs: 4,
    totalApplications: 25,
    recentEnquiries: [],
    recentApplications: [],
  });

  useEffect(() => {
    dashboardService.getDashboardMetrics().then(res => {
      setStats(prev => ({
        ...prev,
        ...res,
      }));
    });
  }, []);

  const kpis = [
    { label: 'Total Products', value: String(stats.totalProducts || 18), icon: <Package size={22} style={{ color: '#6828DC' }} />, bg: '#F5F3FF', link: '/admin/products' },
    { label: 'Product Enquiries', value: String(stats.totalEnquiries || 120), icon: <Inbox size={22} style={{ color: '#2563EB' }} />, bg: '#EFF6FF', link: '/admin/enquiries' },
    { label: 'Career Applications', value: String(stats.totalApplications || 25), icon: <Briefcase size={22} style={{ color: '#10B981' }} />, bg: '#ECFDF5', link: '/admin/careers' },
    { label: 'Gallery Images', value: '18', icon: <Image size={22} style={{ color: '#EA580C' }} />, bg: '#FFF7ED', link: '/admin/cms' },
  ];

  const recentActivities = [
    { title: 'New product Zefix-500 added', time: '2 hours ago', icon: <Pill size={16} style={{ color: '#10B981' }} /> },
    { title: 'New enquiry from Sunita Sharma', time: '4 hours ago', icon: <Mail size={16} style={{ color: '#2563EB' }} /> },
    { title: '3 new career applications', time: '6 hours ago', icon: <Briefcase size={16} style={{ color: '#EA580C' }} /> },
    { title: 'Gallery images updated', time: '10 hours ago', icon: <Image size={16} style={{ color: '#6828DC' }} /> },
    { title: 'About Us page modified', time: '1 day ago', icon: <FileText size={16} style={{ color: '#059669' }} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 1. HERO WELCOME BANNER (Exact Image 2 Top-Left) */}
      <div style={{
        background: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 60%, #DDD6FE 100%)',
        borderRadius: '20px',
        padding: '36px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
        border: '1.5px solid #E9D5FF',
        boxShadow: '0 4px 20px rgba(104, 40, 220, 0.08)',
      }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', marginBottom: '8px' }}>
            Good Morning, Admin!
          </h1>
          <p style={{ fontSize: '15px', color: '#64748B' }}>
            Here's what's happening with your website and pharma inquiries today.
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(10px)',
          padding: '14px 24px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.9)',
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: '#6828DC',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Pill size={24} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
              Advancing Healthcare
            </div>
            <div style={{ fontSize: '12.5px', color: '#6828DC', fontWeight: 600 }}>
              Through Quality Pharmaceuticals
            </div>
          </div>
        </div>
      </div>

      {/* 2. 4 KPI STATS CARDS (Exact Image 2) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
      }}>
        {kpis.map((k, i) => (
          <Link
            key={i}
            to={k.link}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid #E2E8F0',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#A78BFA';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: k.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {k.icon}
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
                {k.value}
              </div>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#64748B', marginTop: '4px' }}>
                {k.label}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 3. ANALYTICS ROW: 30-Day Visitors Wave Chart, Donut Chart & Recent Activities */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1.2fr',
        gap: '24px',
      }}>
        {/* Visitors Wave Line Chart Card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #E2E8F0',
          padding: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>Website Visitors</h3>
              <p style={{ fontSize: '12px', color: '#94A3B8' }}>(Last 30 Days)</p>
            </div>
            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              background: '#F1F5F9',
              color: '#475569',
              padding: '4px 10px',
              borderRadius: '6px',
            }}>
              Last 30 Days ▾
            </span>
          </div>

          {/* SVG Smooth Curve Wave Chart matching Image 2 */}
          <div style={{ position: 'relative', height: '180px', width: '100%' }}>
            {/* Tooltip on peak */}
            <div style={{
              position: 'absolute',
              left: '38%',
              top: '15px',
              background: '#0F172A',
              color: '#FFFFFF',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
              textAlign: 'center',
            }}>
              1,250
              <div style={{ fontSize: '9px', color: '#94A3B8' }}>12 Jun 2025</div>
            </div>

            <svg width="100%" height="100%" viewBox="0 0 400 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 130 C 50 120, 80 80, 120 95 C 160 110, 170 30, 210 50 C 250 70, 280 130, 320 100 C 360 70, 380 90, 400 60 L 400 160 L 0 160 Z"
                fill="url(#purpleGrad)"
              />
              <path
                d="M 0 130 C 50 120, 80 80, 120 95 C 160 110, 170 30, 210 50 C 250 70, 280 130, 320 100 C 360 70, 380 90, 400 60"
                fill="none"
                stroke="#7C3AED"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="210" cy="50" r="5" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
            </svg>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', marginTop: '8px' }}>
              <span>1 Jan</span>
              <span>5 Jan</span>
              <span>10 Jan</span>
              <span>15 Jan</span>
              <span>20 Jan</span>
              <span>25 Jan</span>
              <span>30 Jan</span>
            </div>
          </div>
        </div>

        {/* Enquiries by Type Donut Chart Card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #E2E8F0',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>Enquiries by Type</h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', margin: '14px 0' }}>
            {/* SVG Donut */}
            <svg width="130" height="130" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="4"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#6828DC"
                strokeWidth="4"
                strokeDasharray="60, 100"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#06B6D4"
                strokeWidth="4"
                strokeDasharray="25, 100"
                strokeDashoffset="-60"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#10B981"
                strokeWidth="4"
                strokeDasharray="15, 100"
                strokeDashoffset="-85"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A' }}>120</div>
              <div style={{ fontSize: '10px', color: '#64748B' }}>Total</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6828DC' }} />
                <span>Product Enquiry</span>
              </span>
              <strong>60%</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06B6D4' }} />
                <span>Business Enquiry</span>
              </span>
              <strong>25%</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
                <span>Career Enquiry</span>
              </span>
              <strong>15%</strong>
            </div>
          </div>
        </div>

        {/* Recent Activities Feed Card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #E2E8F0',
          padding: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>Recent Activities</h3>
            <span style={{ fontSize: '12px', color: '#6828DC', fontWeight: 700, cursor: 'pointer' }}>View All</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {recentActivities.map((act, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {act.icon}
                  </div>
                  <span style={{ fontWeight: 600, color: '#1E293B' }}>{act.title}</span>
                </div>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. LET'S BUILD A HEALTHIER TOMORROW BANNER (Matching Image 2) */}
      <div style={{
        background: 'linear-gradient(135deg, #4C1D95 0%, #6828DC 60%, #7C3AED 100%)',
        borderRadius: '20px',
        padding: '32px 36px',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
      }}>
        <div style={{ maxWidth: '580px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
            Let's Build a Healthier Tomorrow Together
          </h2>
          <p style={{ fontSize: '14px', color: '#EDE9FE', lineHeight: 1.5, marginBottom: '20px' }}>
            Manage your products, enquiries, career applications and more — all in one unified control centre.
          </p>
          <Link
            to="/admin/products"
            className="btn btn-white"
            style={{ borderRadius: '8px', padding: '10px 20px', fontSize: '13.5px' }}
          >
            <span>Explore Products</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Mini stats */}
        <div style={{
          display: 'flex',
          gap: '24px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          padding: '16px 24px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 900 }}>15+</div>
            <div style={{ fontSize: '11px', color: '#DDD6FE' }}>Years</div>
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 900 }}>{stats.totalProducts || 18}+</div>
            <div style={{ fontSize: '11px', color: '#DDD6FE' }}>Products</div>
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 900 }}>50+</div>
            <div style={{ fontSize: '11px', color: '#DDD6FE' }}>Global Reach</div>
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 900 }}>1000+</div>
            <div style={{ fontSize: '11px', color: '#DDD6FE' }}>Happy Clients</div>
          </div>
        </div>
      </div>

      {/* 5. QUICK ACTIONS & DOCTOR INNOVATION CARD */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px',
      }}>
        {/* Quick Actions Grid */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #E2E8F0',
          padding: '24px',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '18px' }}>
            Quick Actions
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
            gap: '14px',
          }}>
            {[
              { label: 'Add Product', icon: <Plus size={20} style={{ color: '#10B981' }} />, bg: '#ECFDF5', link: '/admin/products/new' },
              { label: 'View Enquiries', icon: <Mail size={20} style={{ color: '#2563EB' }} />, bg: '#EFF6FF', link: '/admin/enquiries' },
              { label: 'Career Apps', icon: <Briefcase size={20} style={{ color: '#059669' }} />, bg: '#F0FDF4', link: '/admin/careers' },
              { label: 'Manage Gallery', icon: <Image size={20} style={{ color: '#EA580C' }} />, bg: '#FFF7ED', link: '/admin/cms' },
              { label: 'Website Content', icon: <Palette size={20} style={{ color: '#6828DC' }} />, bg: '#FAF5FF', link: '/admin/cms' },
              { label: 'Settings', icon: <Settings size={20} style={{ color: '#64748B' }} />, bg: '#F1F5F9', link: '/admin/settings' },
            ].map((qa, idx) => (
              <Link
                key={idx}
                to={qa.link}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px 8px',
                  borderRadius: '12px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#A78BFA';
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.background = '#F8FAFC';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: qa.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px',
                }}>
                  {qa.icon}
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  {qa.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Doctor Card: Innovation for a Healthier World */}
        <div style={{
          background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
          borderRadius: '16px',
          padding: '24px',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <span style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '3px 10px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 700,
              marginBottom: '10px',
            }}>
              HEALTHCARE R&D
            </span>
            <h3 style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1.2 }}>
              Innovation for a Healthier World
            </h3>
            <p style={{ fontSize: '13px', color: '#E0F2FE', marginTop: '8px', lineHeight: 1.5 }}>
              Formulating next-generation pharmaceutical compounds with highest therapeutic bioavailability.
            </p>
          </div>

          <div style={{ fontSize: '12px', color: '#BAE6FD', marginTop: '16px' }}>
            WHO-GMP Certified Plant & In-House Analytical QC
          </div>
        </div>
      </div>
    </div>
  );
};
