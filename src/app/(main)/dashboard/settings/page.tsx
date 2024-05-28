import ProfileForm from "@/components/pages/settings/profile-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RetrieveAgentCredentials, currentAgent } from "@/server-actions";
import { IconUser } from "@tabler/icons-react";

export default async function SettingsPage() {
  const user = await currentAgent();
  const credentials = await RetrieveAgentCredentials(user.id);
  return (
    <div className="flex flex-col flex-grow flex-1 space-y-[1rem] relative px-4 py-6 md:px-6">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className="my-6" />

      {/* Main settings section */}
      {/* <div className="flex flex-grow bg-red-200 relative overflow-auto">
            <div className="absolute bg-green-200 inset-0">
            </div>
        </div> */}
      <div className="grid md:grid-cols-4 flex-grow flex-1 ">
        <aside className="sticky hidden md:block">
          <div className="flex items-center gap-2 p-1 text-sm " >
            <IconUser size={18} />
            Profile
          </div>
        </aside>
        <div className="md:col-span-3 relative flex-grow p-1 pr-4 overflow-auto">
          <div className="absolute ">
            <ProfileForm credentials={credentials} />
          </div>
        </div>
      </div>
    </div>
  );
}
