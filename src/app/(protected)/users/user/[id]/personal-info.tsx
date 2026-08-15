import { InfoCard } from "@/components/ui/info-card";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import Link from "next/link";
import { Fragment, JSX } from "react";
import UpdateUserForm from "./update-user-form";

type PersonalInfoProps = {
  userId: string;
  info: {
    name: string;
    username: string;
    email: string;
    phone?: string;
    referrer?: { id: string; name: string };
    dateJoined: Date | string;
    funds: {
      amount: number;
    };
  };
};

/**
 * A component to display the personal information of a user.
 *
 * @param {PersonalInfoProps} props - The properties for the component.
 * @param {PersonalInfoProps["info"]} props.info - The user's personal
 * information.
 * @returns {JSX.Element} The rendered component.
 */
export default function PersonalInfo({
  info,
  userId,
}: Readonly<PersonalInfoProps>): JSX.Element {
  return (
    <div className="w-full flex flex-col items-center justify-center py-6 gap-6">
      <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {/* Display the user's full name */}
        <InfoCard title="Full Name" content={info.name} />
        {/* Display the user's username */}
        <InfoCard title="Username" content={info.username} />
        {/* Display the user's email */}
        <InfoCard title="Email" content={info.email} />
        {/* If the user has a phone number, display it */}
        {info.phone && <InfoCard title="Phone" content={info.phone} />}
        {/* If the user has a referrer, display their name and link to their profile */}
        {info.referrer && (
          <InfoCard
            title="Referrer"
            content={
              <Fragment>
                <Link
                  href={`/users/user/${info.referrer.id}`}
                  className="absolute inset-0"
                />
                {/* Display the referrer's name */}
                {info.referrer.name}
              </Fragment>
            }
          />
        )}
        {/* Display the user's account balance */}
        <InfoCard
          title="Account Balance"
          content={
            <p className="text-lg font-semibold">
              {/* Format the balance as currency */}
              {formatCurrency(info.funds.amount)}
            </p>
          }
        />
        {/* Display the user's date joined */}
        <InfoCard
          title="Date Joined"
          content={formatDateTime(info.dateJoined)}
        />
      </div>

      <UpdateUserForm info={info} userId={userId} />
    </div>
  );
}
