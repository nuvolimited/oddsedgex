import Header from "@/components/ui/header";
import AddPaymentOptionDialog from "./add-payment-option-dialog";
import { isAdmin } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/drizzle";
import { JSX } from "react";
import PaymentOptionCard from "@/app/(protected)/_components/payment_option/payment-option-card";

/**
 * PaymentOptions Component
 *
 * This component handles the display and management of payment options
 * for the user. It ensures that only admin users can access this page
 * and allows them to add or view existing payment options.
 *
 * @returns {JSX.Element} The rendered PaymentOptions component.
 */
export default async function PaymentOptions(): Promise<JSX.Element> {
  // Check if the current user is not an admin
  if (!(await isAdmin())) {
    // If the user is not an admin, redirect them to the home page
    redirect("/");
  }

  // Fetch the list of payment options from the database
  const paymentOptions = await db.query.paymentOptions.findMany();

  return (
    <div className="w-full flex flex-col gap-6">
      <Header title="Payment Options">
        <p className="italic text-muted-foreground">
          Manage your payment methods and options here.
        </p>
      </Header>

      {/* Display message and option to add payment methods if none exist */}
      {paymentOptions.length === 0 ? (
        <div className="px-4 w-full h-80 flex items-center justify-center">
          <div className="space-y-4">
            <p className="italic text-muted-foreground text-center">
              No payment options found
            </p>
            {/* Dialog to add a new payment option */}
            <AddPaymentOptionDialog />
          </div>
        </div>
      ) : (
        <div className="px-4 w-full space-y-4">
          <div className="flex w-full">
            <div className="flex-1" />
            {/* Dialog to add a new payment option with outline style */}
            <AddPaymentOptionDialog outline />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Render each payment option card */}
            {paymentOptions.map((option) => {
              const details = option.details as {
                accountHolderName: string;
                accountNumber: string;
                bankName: string;
              };
              return (
                <PaymentOptionCard
                  key={option.id}
                  option={{
                    id: option.id,
                    details,
                  }}
                  isAdmin
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
