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
import { Check } from "lucide-react";
import {
  JSX,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { approveTransaction } from "./withdrawal-management.action";
import { toast } from "sonner";

type ApproveWithdrawalTransactionProps = {
  transactionId: string;
  userId: string;
};

/**
 * A component to approve a withdrawal transaction.
 *
 * @param {ApproveWithdrawalTransactionProps} props - The props containing transaction and user IDs.
 * @returns {JSX.Element} The rendered ApproveWithdrawalTransaction component.
 */
function ApproveWithdrawalTransaction({
  transactionId,
  userId,
}: Readonly<ApproveWithdrawalTransactionProps>): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [state, dispatch, isPending] = useActionState(
    approveTransaction,
    undefined
  );

  /**
   * Handle the approval of a withdrawal transaction.
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

  useEffect(() => {
    if (state) {
      if ("success" in state && state.success) {
        toast.success("Withdrawal approved successfully");
        setIsOpen(false);
      }

      if ("error" in state) {
        toast.error("Withdrawal approval failed", {
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
          <AlertDialogTitle>Approve Withdrawal</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to approve this withdrawal?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleApproval}>
            Approve
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ApproveWithdrawalTransaction;
