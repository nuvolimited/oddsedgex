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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import bankData from "@/lib/banks.json";
import { toTitleCase } from "@/lib/utils";
import { withdrawFundsFormSchema } from "./withdraw-funds.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { withdrawFunds } from "./withdraw-funds.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const bankOptions = bankData
  .map((bank) => ({
    value: bank.name,
    label: toTitleCase(bank.name),
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

/**
 * The WithdrawFundsForm component.
 *
 * This component renders a form for the user to withdraw funds from their
 * account. The form includes fields for the amount, bank name, account number,
 * and account holder name. The form data is validated and submitted to the
 * withdrawFunds action.
 *
 * @returns {JSX.Element} The rendered WithdrawFundsForm component.
 */
export default function WithdrawFundsForm() {
  const router = useRouter();

  /**
   * The form instance.
   *
   * The form instance is created with the useForm hook from react-hook-form.
   * The form instance is used to manage the form state and to handle form
   * submission.
   */
  const form = useForm<z.infer<typeof withdrawFundsFormSchema>>({
    /**
     * The resolver for the form.
     *
     * The resolver is used to validate the form data. The resolver is set to
     * zodResolver, which validates the form data using the withdrawFundsFormSchema.
     */
    resolver: zodResolver(withdrawFundsFormSchema),
    /**
     * The default values for the form.
     *
     * The default values are used to initialize the form state.
     */
    defaultValues: {
      amount: 100,
      details: {
        accountNumber: "",
        bankName: "",
        accountHolderName: "",
      },
    },
  });

  /**
   * The action state hook.
   *
   * The action state hook is used to manage the state of the withdrawFunds action.
   * The action state hook is used to handle the action state changes.
   */
  const [state, dispatch, isPending] = useActionState(withdrawFunds, undefined);

  /**
   * The handle submit function.
   *
   * The handle submit function is called when the form is submitted. The handle
   * submit function is used to handle the form submission.
   */
  const handleSubmit = form.handleSubmit((data) => {
    startTransition(() => {
      const details = JSON.stringify(data.details);
      const formData = new FormData();
      formData.append("amount", data.amount.toString());
      formData.append("details", details);

      dispatch(formData);
    });
  });

  /**
   * The effect hook.
   *
   * The effect hook is used to handle the action state changes. The effect hook
   * is used to show toast messages based on the action state.
   */
  useEffect(() => {
    if (state) {
      if ("success" in state && state.success) {
        // On success, show toast and navigate to dashboard
        toast.success(state.success);
        form.reset();
      }

      if ("error" in state) {
        // On error, show error toast
        toast.error("Withdraw funds failed", {
          description: state.error,
        });
      }
    }
  }, [form, router, state]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
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

        <Button type="submit" className="w-full mt-4" disabled={isPending}>
          {isPending ? <Loader className="animate-spin" /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
