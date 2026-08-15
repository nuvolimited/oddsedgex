"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PaymentOptionDetails } from "@/lib/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import PreviewDialog from "./preview-dialog";
import { JSX, ReactNode } from "react";

type AdminTransactionManagementCardProps = {
  transaction: {
    id: string;
    amount: number;
    details: unknown;
    proof?: string;
    date: Date;
    user: {
      id: string;
      name: string;
    };
  };
  extra?: ReactNode;
};

/**
 * A component to display a transaction management card for admins.
 *
 * @param {AdminTransactionManagementCardProps} props
 * @returns {JSX.Element}
 */
function AdminTransactionManagamentCard({
  transaction,
  extra,
}: Readonly<AdminTransactionManagementCardProps>): JSX.Element {
  const details = transaction.details as PaymentOptionDetails;

  // The card header displays the user's name and the transaction's id
  return (
    <Card>
      <CardHeader>
        <CardTitle>{transaction.user.name}</CardTitle>
        <CardDescription>{transaction.id}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amount */}
        <div className="space-y-2 w-full">
          <div className="font-thin text-muted-foreground text-xs">AMOUNT</div>
          <h3>{formatCurrency(transaction.amount)}</h3>
          <div className="flex gap-6">
            {transaction.proof && (
              <PreviewDialog
                previewUrl={transaction.proof}
                alt={transaction.id}
                title="Proof of Payment"
              />
            )}
            {extra}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2.5 w-full">
          <div className="font-thin text-muted-foreground text-xs">DETAILS</div>
          <div>
            <p className="text-sm">
              Name:{" "}
              <span className="font-semibold">{details.accountHolderName}</span>
            </p>
            <p className="text-sm">
              Account Number:{" "}
              <span className="font-semibold">
                {details.accountNumber} ({details.bankName})
              </span>
            </p>
          </div>
        </div>

        {/* Date */}
        <div className="text-sm font-medium text-right">
          {formatDateTime(transaction.date)}
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminTransactionManagamentCard;
