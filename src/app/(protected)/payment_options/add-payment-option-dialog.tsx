"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Loader, Plus } from "lucide-react";
import { createPaymentOptionFormSchema } from "./payment-option.schema";
import bankData from "@/lib/banks.json";
import { toTitleCase } from "@/lib/utils";
import { startTransition, useActionState, useEffect, useState } from "react";
import { createPaymentOption } from "./payment-option.action";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const bankOptions = bankData.map((bank) => ({
  value: bank.name,
  label: toTitleCase(bank.name),
}));

/**
 * A component to add a new payment option.
 *
 * This component renders a dialog with a form to input
 * payment option details. On submission, it calls the
 * createPaymentOption action and handles the result.
 *
 * @returns The AddPaymentOptionDialog component.
 */
export default function AddPaymentOptionDialog({
  outline,
}: Readonly<{ outline?: boolean }>) {
  // State to control the dialog's open/close status
  const [isOpen, setIsOpen] = useState(false);

  // Hook to manage the action state and handle pending status
  // The action state is used to handle the createPaymentOption action
  // and display a loader or show an error message
  const [state, dispatch, isPending] = useActionState(
    createPaymentOption,
    undefined
  );

  // Initialize form using react-hook-form with Zod schema validation
  // The schema is defined in the payment-option.schema.ts file
  const form = useForm<z.infer<typeof createPaymentOptionFormSchema>>({
    resolver: zodResolver(createPaymentOptionFormSchema),
    defaultValues: {
      details: {
        accountNumber: "",
        bankName: "",
        accountHolderName: "",
      },
    },
  });

  // Handler for form submission
  // On submission, it calls the dispatch function with the form data
  const handleSubmit = form.handleSubmit(async (data) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("details", JSON.stringify(data.details));

      dispatch(formData);
    });
  });

  // Effect to handle the result of the createPaymentOption action
  // On success, it shows a toast and closes the dialog
  // On error, it shows an error toast with the description
  useEffect(() => {
    if (state) {
      if ("success" in state && state.success) {
        // On success, show toast and close dialog
        toast.success("Payment option added successfully");
        form.reset();
        setIsOpen(false);
      }

      if ("error" in state) {
        // On error, show error toast with description
        toast.error("Failed to add payment option", {
          description: state.error,
        });
      }
    }
  }, [form, state]);

  return (
    // Dialog component to display the form
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={outline ? "outline" : "default"}>
          <Plus className="size-4" />
          Add Payment Option
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Payment Option</DialogTitle>
          <DialogDescription>
            Here you can add a new payment option to your account. Please fill
            in the required details and submit.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-4"
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            {/* Account Number Field */}
            <FormField
              control={form.control}
              name="details.accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Bank Name Select Field */}
            <FormField
              control={form.control}
              name="details.bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a bank" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bankOptions.map((bank) => (
                        <SelectItem key={bank.value} value={bank.value}>
                          {bank.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Account Holder Name Field */}
            <FormField
              control={form.control}
              name="details.accountHolderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Holder Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Submit Button */}
            <Button type="submit" className="w-full mt-4" disabled={isPending}>
              {isPending ? <Loader className="animate-spin" /> : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
