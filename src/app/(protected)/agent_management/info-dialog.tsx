"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toTitleCase } from "@/lib/utils";
import { Check, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { approveAgent, rejectAgent } from "./agent-management.action";
import { toast } from "sonner";

type Agent = {
  address: string;
  status: "pending" | "verified" | "rejected" | null;
  state: string;
  city: string;
  userId: string;
  phone: string;
  kyc: unknown;
  id: string;
  name: string;
  email: string;
};

type KYC = {
  documentType: "PASSPORT" | "DRIVING_LICENSE" | "OTHER";
  documentNumber: string;
  documentFront: string;
  documentBack: string;
  expirationDate: string;
};

type Props = {
  agent: Agent;
};

function InfoDialog({ agent }: Readonly<Props>) {
  const kyc = JSON.parse(JSON.stringify(agent.kyc)) as KYC;

  const [isOpen, setIsOpen] = useState(false);

  const [isSubmitting, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      const res = await approveAgent(agent.userId);
      if (res.error) {
        toast.error(res.error);
        return;
      }

      if (res.success) {
        toast.success("Agent approved successfully");
      }

      setIsOpen(false);
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      const res = await rejectAgent(agent.userId);
      if (res.error) {
        toast.error(res.error);
        return;
      }

      if (res.success) {
        toast.success("Agent rejected successfully");
      }

      setIsOpen(false);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agent Information</DialogTitle>
          <DialogDescription>
            View detailed information about {agent.name}.
          </DialogDescription>
        </DialogHeader>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="contact-info">
            <AccordionTrigger>Contact Information</AccordionTrigger>
            <AccordionContent className="flex flex-col">
              <section className="py-1">
                <p className="font-thin text-xs">Email</p>
                <p className="font-semibold">{agent.email}</p>
              </section>
              <section className="py-1">
                <p className="font-thin text-xs">Phone</p>
                <p className="font-semibold">{agent.phone}</p>
              </section>
              <section className="py-1">
                <p className="font-thin text-xs">Address</p>
                <p className="font-semibold">
                  {agent.address}, {agent.city}, {agent.state}
                </p>
              </section>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="kyc-info">
            <AccordionTrigger>KYC Information</AccordionTrigger>
            <AccordionContent className="flex flex-col">
              <section className="py-1">
                <p className="font-thin text-xs">Document Type</p>
                <p className="font-medium">
                  {toTitleCase(kyc.documentType.replaceAll("_", " "))}
                </p>
              </section>
              <section className="py-1">
                <p className="font-thin text-xs">Document Number</p>
                <p className="font-medium">{kyc.documentNumber}</p>
              </section>
              <section className="grid md:grid-cols-2 gap-2">
                <Image
                  src={kyc.documentFront}
                  alt="Document Front"
                  width={200}
                  height={200}
                />
                {kyc.documentType === "DRIVING_LICENSE" && (
                  <Image
                    src={kyc.documentBack}
                    alt="Document Back"
                    width={200}
                    height={200}
                  />
                )}
              </section>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {agent.status === "pending" && (
          <DialogFooter>
            <Button
              size="icon"
              variant="secondary"
              disabled={isSubmitting}
              onClick={handleApprove}
            >
              <Check />
              <span className="sr-only">Approve Agent</span>
            </Button>
            <Button
              size="icon"
              variant="destructive"
              disabled={isSubmitting}
              onClick={handleReject}
            >
              <Trash2 />
              <span className="sr-only">Delete Agent</span>
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default InfoDialog;
