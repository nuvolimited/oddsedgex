import { InfoCard } from "@/components/ui/info-card";
import { toTitleCase } from "@/lib/utils";
import Image from "next/image";

type AgentInfoProps = {
  details: {
    address: string;
    state: string;
    city: string;
    phone: string;
    status: "pending" | "verified" | "rejected" | null;
    kyc: unknown;
  };
};

type KYC = {
  documentType: "PASSPORT" | "DRIVING_LICENSE" | "OTHER";
  documentNumber: string;
  documentFront: string;
  documentBack: string;
  expirationDate: string;
};

/**
 * A component to display the agent's information.
 *
 * @param {AgentInfoProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered component.
 */
export default function AgentInfo({ details }: Readonly<AgentInfoProps>) {
  const kyc = JSON.parse(JSON.stringify(details.kyc)) as KYC;
  return (
    <div className="w-full flex flex-col gap-6">
      {/* The agent's profile information */}
      <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
        <InfoCard title="Address" content={details.address} />
        <InfoCard title="State" content={details.state} />
        <InfoCard title="City" content={details.city} />
        <InfoCard title="Phone" content={details.phone} />
        <InfoCard title="Verification" content={details.status} />
      </div>

      {/* The agent's KYC details */}
      <div className="w-full space-y-4">
        <h3>KYC Details</h3>
        <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
          {/* The agent's KYC details */}
          <InfoCard
            title="Document Type"
            content={toTitleCase(kyc.documentType.replaceAll("_", " "))}
          />
          <InfoCard title="Document Number" content={kyc.documentNumber} />
          {/* The agent's document front */}
          <InfoCard
            title="Document Front"
            content={
              <Image
                src={kyc.documentFront}
                alt="Document Front"
                width={200}
                height={200}
              />
            }
          />
          {/* The agent's document back */}
          {kyc.documentType !== "DRIVING_LICENSE" && (
            <InfoCard
              title="Document Back"
              content={
                <Image
                  src={kyc.documentBack}
                  alt="Document Front"
                  width={200}
                  height={200}
                />
              }
            />
          )}
          {/* The agent's document expiration date */}
          <InfoCard title="Expiration Date" content={kyc.expirationDate} />
        </div>
      </div>
    </div>
  );
}
