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
import { updateProfileFormSchema } from "./profile.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { updateProfile } from "./profile.action";
import { toast } from "sonner";

type ProfileData = {
  name: string;
  username: string;
  email: string;
};

/**
 * The `UpdateProfileForm` component is a form that allows a user to update their
 * profile information.
 *
 * The form takes a `data` object as a prop, which should contain the user's
 * current profile information. The form allows the user to update their name,
 * username, and email address.
 *
 * The form is validated using the `zod` library, and the validation rules are
 * defined in the `updateProfileFormSchema` constant. The form also uses the
 * `react-hook-form` library to handle form submission and validation.
 *
 * When the form is submitted, the `handleUpdateProfile` function is called,
 * which dispatches the `updateProfile` action with the validated form data.
 *
 * The component also renders a success toast message with the message
 * "Profile updated successfully" if the profile update is successful.
 *
 * @param {object} data - The user's current profile information.
 * @param {string} data.name - The user's name.
 * @param {string} data.username - The user's username.
 * @param {string} data.email - The user's email address.
 * @returns {JSX.Element} - The rendered form component.
 */
export default function UpdateProfileForm({
  data,
}: Readonly<{
  data: ProfileData;
}>) {
  const [state, dispatch, isPending] = useActionState(updateProfile, undefined);

  const form = useForm<z.infer<typeof updateProfileFormSchema>>({
    resolver: zodResolver(updateProfileFormSchema),
    defaultValues: {
      name: data.name,
    },
  });

  /**
   * Handles the form submission.
   *
   * This function is called when the form is submitted. It takes the validated
   * form data as an argument and dispatches the `updateProfile` action with it.
   *
   * The function also shows a success toast message with the message
   * "Profile updated successfully" if the profile update is successful.
   *
   * @param {object} payload - The validated form data.
   */
  const handleUpdateProfile = form.handleSubmit(async (payload) => {
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
    if (state) {
      if ("success" in state && state.success) {
        toast.success("Profile updated successfully");
      }
    }
  });

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        autoComplete="on"
        onSubmit={handleUpdateProfile}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} autoFocus />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" value={data.username} readOnly />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={data.email} readOnly />
        </div>

        <Button type="submit" className="w-full mt-4" disabled={isPending}>
          {isPending ? <Loader className="animate-spin" /> : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
}
