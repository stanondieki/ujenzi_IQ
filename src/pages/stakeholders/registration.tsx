import { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/Layout/dashboard';
import StakeholderForm from '../../components/stakeholder/stakeHolder';
import { useAuth } from '../../hooks/useAuth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Stakeholder } from '../../types';

const RegisterStakeholderPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { userData } = useAuth();

  const handleSubmit = async (data: Omit<Stakeholder, 'id'>) => {
    if (!userData?.role || userData.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    setLoading(true);
    try {
      const stakeholderRef = doc(collection(db, 'users'));
      await setDoc(stakeholderRef, {
        ...data,
        role: 'stakeholder',
        createdAt: new Date(),
        createdBy: userData.uid
      });
      router.push('/stakeholders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Register New Stakeholder
        </h1>
        <StakeholderForm onSubmit={handleSubmit} isLoading={loading} />
      </div>
    </DashboardLayout>
  );
};

export default RegisterStakeholderPage;