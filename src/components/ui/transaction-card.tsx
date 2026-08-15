import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PaymentOptionDetails } from "@/lib/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ReactElement } from "react";

/**
 * The props for the TransactionDetailCard component.
 */
type TransactionDetailCardProps = {
  transactionDetail: {
    id: string;
    amount: number;
    details: unknown;
    date: Date;
    status: "pending" | "success" | "failed";
  };
};

/**
 * A component to display a transaction detail.
 *
 * @param {TransactionDetailCardProps} props
 * @returns {ReactElement}
 */
function TransactionDetailCard({
  transactionDetail,
}: Readonly<TransactionDetailCardProps>): ReactElement {
  const details = transactionDetail.details as PaymentOptionDetails;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{transactionDetail.id}</CardTitle>
        <CardDescription className="flex">
          <Badge
            variant={
              transactionDetail.status === "failed"
                ? "destructive"
                : transactionDetail.status === "success"
                ? "success"
                : "default"
            }
            className="ml-auto"
          >
            {transactionDetail.status}
          </Badge>
        </CardDescription>
        <CardContent className="space-y-4">
          {/* Amount */}
          <div className="space-y-2 w-full">
            <div className="font-thin text-muted-foreground text-xs">
              AMOUNT
            </div>
            <h3>{formatCurrency(transactionDetail.amount)}</h3>
          </div>

          {/* Details */}
          <div className="space-y-2.5 w-full">
            <div className="font-thin text-muted-foreground text-xs">
              DETAILS
            </div>
            <div>
              <p className="text-sm">
                Name:{" "}
                <span className="font-semibold">
                  {details.accountHolderName}
                </span>
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
            {formatDateTime(transactionDetail.date)}
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
}

export default TransactionDetailCard;
