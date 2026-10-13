import React, { useState, useEffect } from 'react';
import { Send, User, Mail, Phone } from 'lucide-react';
import { enquiryService } from '../../api/enquiryService';
import { useAuth } from '../../context/AuthContext';
import { FormInput, FormTextarea, Button, FormAlert, ThemedSelect } from '../common';
import { VerifiedUserBadge } from '../common/VerifiedUserBadge';

const INQUIRY_SUBJECT_OPTIONS = [
  { value: 'Stockist Distribution Network Monopoly', label: 'Stockist Distribution Monopoly', subtitle: 'Exclusive territory marketing & distribution rights' },
  { value: 'Wholesale Bulk Purchase', label: 'Hospital / Bulk Institutional Supply', subtitle: 'Rate contracts, tender supply & institutional orders' },
  { value: 'Third Party Manufacturing', label: 'Third Party Formulation Contract', subtitle: 'Custom contract manufacturing under your own brand' },
  { value: 'General Query', label: 'General Corporate Query', subtitle: 'Other inquiries, partnerships or feedback' },
];

export const ContactForm: React.FC = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    subject: 'Stockist Distribution Network Monopoly',
    message: '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    message?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const errs: { fullName?: string; email?: string; phone?: string; message?: string } = {};

    const effectiveName = formData.fullName.trim() || user?.name || '';
    if (!effectiveName) {
      errs.fullName = 'Full name is required';
    } else if (effectiveName.length < 2) {
      errs.fullName = 'Name must be at least 2 characters';
    }

    const effectiveEmail = formData.email.trim() || user?.email || '';
    if (!effectiveEmail) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(effectiveEmail)) {
      errs.email = 'Please enter a valid email address';
    }

    const rawDigits = (formData.phone.trim() || user?.phone || '').replace(/[\s\-\(\)\+]/g, '');
    const cleanPhone = rawDigits.length > 10 && rawDigits.startsWith('91') ? rawDigits.slice(2) : rawDigits;

    if (!rawDigits) {
      errs.phone = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(cleanPhone)) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.message.trim()) {
      errs.message = 'Please describe your inquiry or requirements';
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await enquiryService.submitContactEnquiry({
        ...formData,
        fullName: effectiveName,
        email: effectiveEmail,
        phone: cleanPhone,
      });
      setSuccessMsg('Thank you for reaching out to Zeal Pharmacure. Our regional business executive will contact you shortly.');
      setFormData({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        subject: 'Stockist Distribution Network Monopoly',
        message: '',
      });
      setFieldErrors({});
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit enquiry. Please verify your details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="zp-card-box" style={{ padding: '36px', borderRadius: '20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <span className="zp-badge-purple" style={{ fontSize: '12px', padding: '4px 12px', marginBottom: '8px' }}>
          <Send size={13} />
          <span>Direct Inquiry Channel</span>
        </span>
        <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-heading, "Outfit", sans-serif)' }}>
          Send Us a Message
        </h3>
        <p style={{ fontSize: '13.5px', color: '#64748B', marginTop: '4px' }}>
          Fill out your details below and our commercial division will provide product catalogs and pricing.
        </p>
      </div>

      <VerifiedUserBadge user={user} style={{ marginBottom: '18px' }} />

      <FormAlert
        type="success"
        message={successMsg}
        onClose={() => setSuccessMsg('')}
        style={{ marginBottom: '18px' }}
      />
      <FormAlert
        type="error"
        message={errorMsg}
        onClose={() => setErrorMsg('')}
        style={{ marginBottom: '18px' }}
      />

      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <FormInput
          label="Full Name *"
          name="fullName"
          required
          placeholder="e.g. Dr. Amit Sharma / Sharma Medicals"
          value={formData.fullName}
          onChange={handleChange}
          error={fieldErrors.fullName}
          leftIcon={<User size={16} />}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <FormInput
            label="Email Address *"
            type="email"
            name="email"
            required
            placeholder="amit@example.com"
            value={formData.email}
            onChange={handleChange}
            error={fieldErrors.email}
            leftIcon={<Mail size={16} />}
          />

          <FormInput
            label="Mobile Number *"
            type="tel"
            name="phone"
            required
            placeholder="10-digit mobile number"
            value={formData.phone}
            onChange={handleChange}
            error={fieldErrors.phone}
            leftIcon={<Phone size={16} />}
          />
        </div>

        <div>
          <ThemedSelect
            label="Nature of Inquiry"
            required
            value={formData.subject}
            onChange={(val) => setFormData((prev) => ({ ...prev, subject: val }))}
            options={INQUIRY_SUBJECT_OPTIONS}
            placeholder="Select nature of inquiry"
            searchable={false}
          />
        </div>

        <FormTextarea
          label="Your Message / Preferred District *"
          name="message"
          required
          rows={4}
          maxLength={500}
          showCount
          placeholder="Please mention your preferred territory/district, expected monthly volume, or specific therapeutic formulations..."
          value={formData.message}
          onChange={handleChange}
          error={fieldErrors.message}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={submitting}
          leftIcon={<Send size={16} />}
          fullWidth
          style={{ marginTop: '6px' }}
        >
          Submit Inquiry
        </Button>
      </form>
    </div>
  );
};
