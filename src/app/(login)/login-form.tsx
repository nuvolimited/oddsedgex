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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginFormSchema } from "./login.schema";

/**
 * A React component for a login form.
 *
 * This component uses the `react-hook-form` library to handle form state,
 * validation, and submission. It also uses the `next-auth` library to handle
 * authentication.
 *
 * The form has two fields: `username` and `password`. The `username` field can
 * accept either a username or an email address, and the `password` field is a
 * password input.
 *
 * When the form is submitted, the component calls the `signIn` function from
 * `next-auth` with the `credentials` strategy, passing in the `username` and
 * `password` values from the form. If the authentication is successful, the
 * component redirects the user to the `/dashboard` route. If the
 * authentication fails, the component displays an error message.
 */
function LoginForm() {
  const [isPending, setIsPending] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  /**
   * A function that will be called when the form is submitted.
   *
   * This function is passed the form data as an argument, and it is expected to
   * handle the form submission.
   */
  const handleLogin = form.handleSubmit(async (values) => {
    setIsPending(true);
    signIn("credentials", {
      username: values.username,
      password: values.password,
      redirect: false,
    }).then((res) => {
      setIsPending(false);
      if (res.error) {
        toast.error("Login failed", {
          position: "top-right",
          description: "Invalid username or password",
        });
      } else {
        toast.success("Login successful", {
          position: "top-right",
          className: "bg-green-500 text-white",
        });
        router.replace("/home");
      }
    });
  });

  return (
    <Form {...form}>
      <form className="space-y-4" autoComplete="on" onSubmit={handleLogin}>
        <FormField
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username or Email</FormLabel>
              <FormControl>
                <Input
                  autoFocus
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
        <Button type="submit" className="w-full mt-4" disabled={isPending}>
          {isPending ? <Loader className="animate-spin" /> : "Login"}
        </Button>
      </form>
    </Form>
  );
}

export default LoginForm;
