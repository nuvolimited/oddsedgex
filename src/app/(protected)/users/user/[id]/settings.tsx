import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ResetUserPasswordForm from "./reset-user-password-form";

type SettingsProps = {
  userId: string;
};

function Settings({ userId }: Readonly<SettingsProps>) {
  return (
    <div className="w-full flex flex-col py-12 items-center">
      <Card className="w-full md:max-w-sm">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>

        <CardContent>
          <ResetUserPasswordForm userId={userId} />
        </CardContent>
      </Card>
    </div>
  );
}

export default Settings;
