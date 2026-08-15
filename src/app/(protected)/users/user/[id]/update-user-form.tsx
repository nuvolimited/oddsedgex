"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { updateUserFormSchema } from "./user.schema";
import { useForm } from "react-hook-form";
import { updateUser } from "./user.action";
import { startTransition, useActionState, useEffect } from "react";
import { Loader } from "lucide-react";
import { toast } from "sonner";

type UpdateUserFormProps = {
  userId: string;
  info: {
    name: string;
    username: string;
    email: string;
  };
};

function UpdateUserForm({ info, userId }: Readonly<UpdateUserFormProps>) {
  const [state, dispatch, isPending] = useActionState(updateUser, undefined);

  const form = useForm<z.infer<typeof updateUserFormSchema>>({
    resolver: zodResolver(updateUserFormSchema),
    defaultValues: {
      name: info.name,
      username: info.username,
      email: info.email,
    },
  });

  const handleUpdate = form.handleSubmit(async (data) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("name", data.name);
      formData.append("username", data.username);
      formData.append("email", data.email);

      dispatch(formData);
    });
  });

  useEffect(() => {
    if (state) {
      if ("success" in state && state.success) {
        // If the update is successful, show a toast message
        toast.success("User information updated successfully");
      } else if ("error" in state && state.error) {
        // If there is an error, show a toast message
        toast.error(state.error);
      }
    }
  }, [state, form]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Update User Information</CardTitle>
      </CardHeader>
      <CardContent className="w-full flex flex-col items-center justify-center">
        <Form {...form}>
          <form onSubmit={handleUpdate} className="space-y-8 w-full md:max-w-md">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <Loader className="animate-spin" />
              ) : (
                "Update User Profile"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default UpdateUserForm;
