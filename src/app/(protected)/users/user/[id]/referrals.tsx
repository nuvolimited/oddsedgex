import { db } from "@/drizzle";
import { formatDateTime } from "@/lib/utils";

type ReferralProps = {
  userId: string;
};

async function Referrals({ userId }: Readonly<ReferralProps>) {
  const referrals = await db.query.users.findMany({
    where: (users, { eq }) => eq(users.referrerId, userId),
    columns: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  if (referrals.length === 0) {
    return <div className="w-full py-12 text-center italic">No referrals</div>;
  }

  return (
    <div className="w-full flex flex-col gap-6 pb-12 divide-y">
      <h3 className="py-4">Total Referrals: {referrals.length}</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {referrals.map((referral) => (
          <div
            key={referral.id}
            className="flex flex-col gap-2 border rounded-md p-4"
          >
            <p className="text-lg font-bold">{referral.name}</p>
            <p className="text-sm text-muted-foreground">{referral.email}</p>
            <p className="text-sm text-muted-foreground">
              Joined on: {formatDateTime(referral.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Referrals;
