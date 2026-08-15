"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Check, Loader } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { approveTransaction } from "./deposit-management.action";
import { toast } from "sonner";

type ApproveDepositTransactionProps = {
  transactionId: string;
  userId: string;
};

/**
 * A component to approve a deposit transaction.
 *
 * @param {ApproveDepositTransactionProps} props - The props containing transaction and user IDs.
 * @returns {JSX.Element} The rendered ApproveDepositTransaction component.
 */
function ApproveDepositTransaction({
  transactionId,
  userId,
}: Readonly<ApproveDepositTransactionProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, dispatch, isPending] = useActionState(
    approveTransaction,
    undefined
  );

  /**
   * Handle the approval of a deposit transaction.
   *
   * This function sends a request to the server to approve the transaction.
   * It will also close the alert dialog when the request is sent.
   */
  const handleApproval = () => {
    startTransition(() => {
      // Create a new FormData object and append the user and transaction IDs to it
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("transactionId", transactionId);

      // Dispatch the action to approve the transaction
      dispatch(formData);
    });

    // Close the alert dialog
    setIsOpen(false);
  };

  // Effect to handle action state changes
  useEffect(() => {
    if (state) {
      if ("success" in state && state.success) {
        // Show a success toast message
        toast.success("Deposit approved successfully");
        setIsOpen(false);
      }

      if ("error" in state) {
        // Show an error toast message
        toast.error("Deposit approval failed", {
          description: state.error,
        });
      }
    }
  }, [state]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button size="icon">
          <Check />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve Deposit</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to approve this deposit?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleApproval} disabled={isPending}>
            {isPending ? <Loader className="animate-spin" /> : "Approve"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ApproveDepositTransaction;
