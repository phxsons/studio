import AppShell from "@/components/app-shell";
import { ProfileForm } from "@/components/profile/profile-form";
import { userProfile } from "@/lib/data";

export default function ProfilePage() {
  return (
    <AppShell title="My Profile">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
        </div>
        <div className="mx-auto max-w-4xl">
          <ProfileForm profile={userProfile} />
        </div>
      </div>
    </AppShell>
  );
}
