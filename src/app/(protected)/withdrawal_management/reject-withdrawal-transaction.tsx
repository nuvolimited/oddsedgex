"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  JSX,
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useState,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { rejectTransaction } from "./withdrawal-management.action";
import { rejectTransactionSchema } from "./withdrawal-management.schema";

type RejectWithdrawalTransactionProps = {
  transactionId: string;
  userId: string;
};

/**
 * RejectWithdrawalTransaction component.
 *
 * This component renders a dialog with a form to reject a withdrawal transaction.
 * The form requires a reason for the rejection and submits the data to the
 * rejectTransaction action. Upon successful submission, it displays a success
 * toast message and resets the form. If an error occurs, an error toast is shown.
 *
 * @param {RejectWithdrawalTransactionProps} props - The props containing transaction and user IDs.
 * @returns {JSX.Element} The rendered RejectWithdrawalTransaction component.
 */
export default function RejectWithdrawalTransaction({
  transactionId,
  userId,
}: Readonly<RejectWithdrawalTransactionProps>): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  // Use action state hook to manage the rejection action
  const [state, dispatch, isPending] = useActionState(
    rejectTransaction,
    undefined
  );

  // Initialize form with validation schema
  const form = useForm<z.infer<typeof rejectTransactionSchema>>({
    resolver: zodResolver(rejectTransactionSchema),
    defaultValues: {
      reason: "",
    },
  });

  // Handle form submission
  const handleSubmit = form.handleSubmit(async (values) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("reason", values.reason);
      formData.append("transactionId", transactionId);
      formData.append("userId", userId);
      dispatch(formData);
    });
  });

  // Reset form and close dialog
  const handleReset = useCallback(() => {
    form.reset();
    setIsOpen(false);
  }, [form, setIsOpen]);

  // Effect to handle action state changes
  useEffect(() => {
    if (state) {
      if ("success" in state && state.success) {
        toast.success("Withdrawal rejected successfully");
        handleReset();
      }

      if ("error" in state) {
        toast.error("Withdrawal rejection failed", {
          description: state.error,
        });
      }
    }
  }, [handleReset, state]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <X />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Withdrawal Request</DialogTitle>
          <DialogDescription>
            Are you sure you want to reject this withdrawal request?
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full flex gap-4">
              <Button type="button" onClick={handleReset} disabled={isPending}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                className="flex-1"
                disabled={isPending}
              >
                {isPending ? <Loader className="animate-spin" /> : "Reject"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
