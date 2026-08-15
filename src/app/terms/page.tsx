import Header from "@/components/ui/header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - OddsEdgeX",
  description: "Terms of Service for OddsEdgeX platform",
};

export default function TermsOfService() {
  return (
    <div className="w-full space-y-6">
      <Header title="Terms of Service" />
      <div className="w-full px-4 divide-y">
        <div className="py-4 space-y-4">
          <h4>Purpose of the Platform</h4>
          <p>
            OddsEdgeX is a digital platform offering financial participation,
            pooled reward systems, and arbitrage-based games. Users can deposit
            funds, join draws, earn rewards, and refer others for bonuses under
            clearly defined rules.
          </p>
        </div>

        <div className="py-4 space-y-4">
          <h4>User Eligibility and Registration</h4>
          <p>
            You must be at least 18 years old and have legal capacity to enter a
            binding agreement.
          </p>
          <p>
            You agree to provide accurate, current, and complete personal
            information during registration.
          </p>
          <p>
            We reserve the right to verify your identity and request
            government-issued identification or KYC documents at any time.
          </p>
        </div>

        <div className="py-4 space-y-4">
          <h4>User Responsibilities</h4>
          <p>
            Users must maintain the confidentiality of their login credentials.
          </p>
          <p>
            Any activity that occurs under your account will be considered your
            responsibility.
          </p>
          <p>
            You are solely responsible for ensuring that you follow local laws
            applicable to your activities on the platform.
          </p>
        </div>

        <div className="py-4 space-y-4">
          <h4>Deposits and Financial Integrity</h4>
          <p>
            All deposits must reflect the actual amount transferred via our
            approved payment channels. False deposit claims (e.g., claiming
            ₦2,000,000 while paying ₦5,000) are strictly prohibited and
            considered fraud and may lead to suspension or ban of account.
          </p>
        </div>

        <div className="py-4 space-y-4">
          <h4>Withdrawals</h4>
          <p>
            No withdrawal of deposited money until it is used — doing so may
            lead to suspension or ban.
          </p>
          <p>
            Withdrawals are processed based on available wallet balance and
            subject to manual or automated verification.
          </p>
          <p>
            Users must ensure their bank details are accurate. We reserve the
            right to delay, reverse, or cancel any withdrawal deemed suspicious
            or fraudulent.
          </p>
        </div>

        <div className="py-4 space-y-4">
          <h4>Referral and Affiliate System</h4>
          <p>
            Users earn more by becoming an agent and receiving a personalized
            agent code.
          </p>
          <p>
            <span className="underline font-semibold">Note</span>: Referrals
            must be real individuals. Using fake accounts, bots, or identity
            manipulation will result in referral ban and reward forfeiture.
          </p>
        </div>

        <div className="py-4 space-y-4">
          <h4>Participation in Draws or Pools</h4>
          <p>
            Users may participate in reward pools, scheduled draws, or earning
            cycles.
          </p>
          <p>
            Participation is valid only after a successful deposit is confirmed.
          </p>
          <p>
            Users who attempt to exploit system vulnerabilities or manipulate
            game logic will be permanently banned.
          </p>
        </div>

        <div className="py-4 space-y-4">
          <h4>Prohibited Activities</h4>
          <p>Falsify deposits or misrepresent payments.</p>
          <p>Create multiple accounts to gain an unfair advantage.</p>
          <p>
            Attempt to hack, DDoS, scrape, reverse-engineer, or damage the
            platform.
          </p>
          <p>Spread misinformation or impersonate staff.</p>
          <p>Use Market for money laundering or criminal enterprise.</p>
        </div>

        <div className="py-4 space-y-4">
          <h4>Suspension and Termination</h4>
          <p>
            We may suspend or permanently terminate accounts that violate rules
            or are linked to fraudulent activity.
          </p>
          <p>
            Users will be notified of suspension via email (where possible).
          </p>
          <p>Suspended funds may be held for investigation.</p>
        </div>

        <div className="py-4 space-y-4">
          <h4>Limitation of Liability</h4>
          <p>
            OddsEdgeX does not guarantee consistent earnings, wins, or profits.
            We are not liable for:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Loss of funds due to user mistakes (e.g., wrong bank info)</li>
            <li>
              Interruption of services due to force majeure (e.g., server
              failure, internet outage)
            </li>
            <li>Unauthorized access resulting from user negligence</li>
          </ol>
        </div>

        <div className="py-4 space-y-4">
          <h4>Platform Modifications</h4>
          <p>
            We may update platform features, fees, game mechanics, or payout
            rules at any time. Users will be notified via website notice, email,
            or dashboard updates. Continued use after an update implies
            acceptance.
          </p>
        </div>

        <div className="py-4 space-y-4">
          <h4>Dispute Resolution</h4>
          <p>
            All disputes must first be raised through our support email within 7
            days. If unresolved, parties agree to settle via arbitration in
            Lagos, Nigeria. Court proceedings will only be used as a last
            resort.
          </p>
        </div>

        <div className="py-4 space-y-4">
          <h4>Governing Law</h4>
          <p>
            These Terms are governed by the laws of the Federal Republic of
            Nigeria, including the Cybercrime Act and the NDIC/CBN financial
            regulations for digital platforms.
          </p>
        </div>
      </div>
    </div>
  );
}
