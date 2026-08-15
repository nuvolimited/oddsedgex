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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Fragment,
  JSX,
  startTransition,
  useActionState,
  useEffect,
} from "react";
import { toast } from "sonner";
import { ImageUploader } from "@/components/ui/media-uploader";
import { depositFundsFormSchema } from "./deposit-funds.schema";
import { PaymentOption } from "@/lib/types";
import PaymentOptionCard from "@/app/(protected)/_components/payment_option/payment-option-card";
import { depositFunds } from "./deposit-funds.action";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

type DepositFundsFormProps = {
  paymentOptions: Array<PaymentOption>;
};

/**
 * DepositFundsForm component for submitting deposit requests.
 *
 * This form allows users to deposit funds by selecting a payment option,
 * specifying an amount, and uploading proof of the deposit. The form data
 * is validated and submitted to the depositFunds action.
 *
 * @param {DepositFundsFormProps} props - The props containing payment options.
 * @returns {JSX.Element} The rendered DepositFundsForm component.
 */
function DepositFundsForm({
  paymentOptions,
}: Readonly<DepositFundsFormProps>): JSX.Element {
  const router = useRouter();
  const [state, dispatch, isPending] = useActionState(depositFunds, undefined);

  // Initialize form using react-hook-form with Zod schema validation
  const form = useForm<z.infer<typeof depositFundsFormSchema>>({
    resolver: zodResolver(depositFundsFormSchema),
    defaultValues: {
      proof: "",
      paymentOption: "",
    },
  });

  // Handle form submission
  const handleSubmit = form.handleSubmit((payload) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("amount", payload.amount.toString());
      formData.append("proof", payload.proof);
      formData.append(
        "details",
        JSON.stringify(
          (
            paymentOptions.find(
              (option) => option.id === payload.paymentOption
            ) as PaymentOption
          ).details
        )
      );

      // Dispatch form data for deposit
      dispatch(formData);
    });
  });

  // Effect to handle state changes after form submission
  useEffect(() => {
    if (state) {
      if ("success" in state && state.success) {
        // On success, show toast and navigate to dashboard
        toast.success(state.success);
      }

      if ("error" in state) {
        // On error, show error toast
        toast.error("Deposit funds failed", {
          description: state.error,
        });
      }
    }
  }, [router, state]);

  return (
    <Fragment>
      {/* Display selected payment option details */}
      {form.watch("paymentOption") &&
        form.getValues("paymentOption") !== "" &&
        paymentOptions.find(
          (option) => option.id === form.getValues("paymentOption")
        ) && (
          <PaymentOptionCard
            option={
              paymentOptions.find(
                (option) => option.id === form.getValues("paymentOption")
              ) as PaymentOption
            }
          />
        )}
      <Form {...form}>
        <form className="space-y-4" autoComplete="on" onSubmit={handleSubmit}>
          {/* Payment Option Field */}
          <FormField
            control={form.control}
            name="paymentOption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Option</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select payment option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentOptions.map((paymentOption) => (
                      <SelectItem
                        key={paymentOption.id}
                        value={paymentOption.id}
                      >
                        {paymentOption.details.bankName}
                        {paymentOption.details.accountNumber
                          ? ` (${paymentOption.details.accountNumber})`
                          : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Amount Field */}
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
                      field.onChange(value === "" ? 0 : Number.parseFloat(value));
                    }}
                    autoFocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Proof Upload Field */}
          <FormField
            control={form.control}
            name="proof"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Proof</FormLabel>
                <FormControl>
                  <ImageUploader id="proof" onValueChange={field.onChange} />
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
    </Fragment>
  );
}

export default DepositFundsForm;
