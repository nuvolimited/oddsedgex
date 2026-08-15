"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { registerFormSchema } from "./register.schema";
import { startTransition, useActionState, useEffect } from "react";
import { register } from "./register.action";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Form for registering a new user.
 *
 * The form calls the `register` action when submitted, which creates a new user
 * in the database. The form fields are validated using the `registerFormSchema`
 * from the `./register.schema` module.
 *
 * @returns The RegisterForm component.
 */
export default function RegisterForm() {
  // The register action is called when the form is submitted. The form data is
  // passed as an argument to the action, and the action returns an object with
  // an `error` property if there was an error creating the user. The error
  // message is then displayed on the form.
  const [state, dispatch, isPending] = useActionState(register, undefined);

  const router = useRouter();

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      username: "",
      agent_code: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  /**
   * Handles the submission of the registration form.
   *
   * This function is called when the form is submitted. It takes the form data
   * as an argument and calls the `dispatch` function with it. The `dispatch`
   * function is provided by the `useActionState` hook and calls the `register`
   * action with the form data.
   *
   * The `startTransition` function from React is used to ensure that the form
   * submission is treated as a transition. This is because the registration
   * process can take some time, and we want to show a loading state while the
   * request is being processed.
   *
   * @param {Object} payload - The form data.
   */
  const handleRegister = form.handleSubmit(async (payload) => {
    startTransition(() => {
      const formData = new FormData();

      // Iterate over the form data and add it to the FormData object.
      for (const key in payload) {
        formData.append(key, payload[key as keyof typeof payload] ?? "");
      }

      // Call the dispatch function with the FormData object.
      dispatch(formData);
    });
  });

  useEffect(() => {
    // If the state is set, that means the registration request has been sent and
    // the response has been received. We can then check the success and error
    // properties of the state to determine if the registration was successful
    // or not.
    if (state) {
      // If the registration was successful, show a success toast with the
      // message "Registration successful".
      if ("success" in state && state.success) {
        toast.success("Registration successful");
        // Redirect to the home page.
        router.push("/");
      }
      // If the registration failed, show an error toast with the error message
      // from the state.
      else if ("error" in state && state.error) {
        toast.error(state.error);
      }
    }
  }, [router, state]);

  return (
    <Form {...form}>
      <form className="space-y-4" autoComplete="off" onSubmit={handleRegister}>
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input autoFocus {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onBlur={(e) =>
                    form.setValue(
                      "username",
                      e.target.value.replaceAll(" ", "")
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="agent_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent Code (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="(Optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
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
        <Button type="submit" className="w-full mt-4" 
        disabled={isPending}
        >
          {isPending ? <Loader className="animate-spin" /> : "Register"}
        </Button>
      </form>
    </Form>
  );
}
