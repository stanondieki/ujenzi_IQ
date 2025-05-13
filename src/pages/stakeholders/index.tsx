import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/Layout/dashboard';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../hooks/useAuth';
import type { Stakeholder } from '../../types';

const StakeholdersPage = () => {
  const router = useRouter();
  const {} = useAuth();
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStakeholders = async () => {
    try {
      const stakeholdersQuery = query(
        collection(db, 'users'),
        where('role', '==', 'stakeholder')
      );
      const querySnapshot = await getDocs(stakeholdersQuery);
      const stakeholderData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Stakeholder[];
      setStakeholders(stakeholderData);
    } catch (error) {
      console.error('Error fetching stakeholders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStakeholders();
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Stakeholders</h1>
          <button
            onClick={() => router.push('/stakeholders/register')}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Stakeholder
          </button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stakeholders.map((stakeholder) => (
              <div key={stakeholder.id} className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-medium">{stakeholder.name}</h3>
                <p className="text-gray-600">{stakeholder.role}</p>
                <p className="text-sm text-gray-500">{stakeholder.email}</p>
                <p className="text-sm text-gray-500">{stakeholder.phoneNumber}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StakeholdersPage;