import { Suspense } from 'react';
import ProfileContent from './ProfileContent';

export const dynamic = 'force-dynamic';
export const runtime = 'edge'

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}