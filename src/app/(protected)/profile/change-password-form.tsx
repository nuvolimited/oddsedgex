"use client";

import { useForm } from "react-hook-form";
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
import { changePasswordFormSchema } from "./profile.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { changePassword } from "./profile.action";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

/**
 * A React component for changing a user's password.
 *
 * This component uses the `react-hook-form` library to handle form state,
 * validation, and submission. It also uses the `next-auth` library to handle
 * authentication.
 *
 * The form has three fields: `currentPassword`, `password`, and `confirmPassword`.
 * The `currentPassword` field is for the user to enter their current password,
 * the `password` field is for the user to enter their new password, and the
 * `confirmPassword` field is for the user to confirm their new password.
 *
 * When the form is submitted, the component calls the `changePassword` action
 * with the form data. The `changePassword` action is provided by the
 * `./profile.action` module and it calls the `changePassword` function from the
 * `./profile.service` module.
 *
 * The component also renders a success toast message with the message
 * "Password was changed successfully" if the password change is successful.
 * The component also renders an error toast message with the message
 * "Change Password Error" if there is an error changing the password.
 */
export default function ChangePasswordForm() {
  const [state, dispatch, isPending] = useActionState(
    changePassword,
    undefined
  );

  const form = useForm<z.infer<typeof changePasswordFormSchema>>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleChangePassword = form.handleSubmit(async (payload) => {
    startTransition(() => {
      const formData = new FormData();

      // Iterate over the form data and add it to the FormData object.
      for (const key in payload) {
        formData.append(key, payload[key as keyof typeof payload]);
      }

      // Call the dispatch function with the FormData object.
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
        signOut();
      }

      if ("error" in state) {
        // If there is an error, show a toast message with the error
        // message.
        toast.error("Change Password Error", {
          description: state.error,
        });
      }
    }
  }, [state]);

  return (
    <Form {...form}>
      <form
        className="space-y-4 max-w-sm mx-auto"
        autoComplete="on"
        onSubmit={handleChangePassword}
      >
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} autoFocus />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
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

        <Button
          type="submit"
          className="w-full mt-4"
          disabled={isPending}
        >
          {isPending ? <Loader className="animate-spin" /> : "Change Password"}
        </Button>
      </form>
    </Form>
  );
}
