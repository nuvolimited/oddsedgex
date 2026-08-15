import { PaymentOption } from "@/lib/types";
import { JSX } from "react";
import DeletePaymentOptionButton from "./delete-payment-option-button";

type PaymentOptionCardProps = {
  option: PaymentOption;
  isAdmin?: boolean;
};

/**
 * A component to display a payment option card.
 * @param {PaymentOptionCardProps} props
 * @returns {JSX.Element}
 */
function PaymentOptionCard({
  option,
  isAdmin = false,
}: Readonly<PaymentOptionCardProps>): JSX.Element {
  const { id, details } = option;

  return (
    <div className="p-4 border rounded-lg shadow-sm divide-y">
      {/* Account holder name */}
      <div className="py-2 flex items-center justify-between">
        <h3 className="text-sm">{details.accountHolderName}</h3>
        {isAdmin && <DeletePaymentOptionButton id={id} />}
      </div>

      {/* Bank name and account number */}
      <div className="py-2">
        <p className="text-sm text-muted-foreground">{details.bankName}</p>
        <h3 className="select-all">{details.accountNumber}</h3>
      </div>
    </div>
  );
}

export default PaymentOptionCard;
