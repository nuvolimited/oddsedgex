"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { resetUserPassword } from "./user.action";
import { useForm } from "react-hook-form";
import { resetUserPasswordFormSchema } from "./user.schema";

type ResetUserPasswordFormProps = {
  userId: string;
};
function ResetUserPasswordForm({
  userId,
}: Readonly<ResetUserPasswordFormProps>) {
  const [state, dispatch, isPending] = useActionState(
    resetUserPassword,
    undefined
  );

  const form = useForm<z.infer<typeof resetUserPasswordFormSchema>>({
    resolver: zodResolver(resetUserPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handlePasswordReset = form.handleSubmit(async (payload) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("newPassword", payload.password);

      dispatch(formData);
    });
  });

  useEffect(() => {
    // When the state changes, check if the password change is successful
    // or if there is an error.
    if (state) {
      if ("success" in state && state.success) {
        // If the password change is successful, show a toast message
        // and sign out the user.
        toast.success("Password was changed successfully");
        form.reset();
      }

      if ("error" in state) {
        // If there is an error, show a toast message with the error
        // message.
        toast.error("Change Password Error", {
          description: state.error,
        });
      }
    }
  }, [form, state]);

  return (
    <Form {...form}>
      <form onSubmit={handlePasswordReset} className="space-y-8">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader className="animate-spin" /> : "Reset Password"}
        </Button>
      </form>
    </Form>
  );
}

export default ResetUserPasswordForm;
