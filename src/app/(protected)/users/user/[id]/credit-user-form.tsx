"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { startTransition, useActionState, useEffect } from "react";
import { creditUser } from "./user.action";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { creditUserFormSchema } from "./user.schema";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type CreditUserFormProps = {
  userId: string;
};

export default function CreditUserForm({
  userId,
}: Readonly<CreditUserFormProps>) {
  const [state, dispatch, isPending] = useActionState(creditUser, undefined);

  const form = useForm<z.infer<typeof creditUserFormSchema>>({
    resolver: zodResolver(creditUserFormSchema),
    defaultValues: {
      amount: 5,
    },
  });

  const handleDebit = form.handleSubmit(async (data) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("amount", data.amount.toString());

      dispatch(formData);
    });
  });

  useEffect(() => {
    if (state) {
      if ("success" in state && state.success) {
        // If the credit is successful, show a toast message
        toast.success("User credited successfully");
        form.reset();
      } else if ("error" in state && state.error) {
        // If there is an error, show a toast message
        toast.error(state.error);
      }
    }
  }, [state, form]);
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Credit User</CardTitle>
      </CardHeader>
      <CardContent className="w-full flex flex-col items-center justify-center">
        <Form {...form}>
          <form onSubmit={handleDebit} className="space-y-8 w-full md:max-w-md">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.0"
                      {...field}
                      onBlur={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? 0 : parseFloat(value));
                      }}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-4" disabled={isPending}>
              {isPending ? <Loader className="animate-spin" /> : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
