"use client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import React, { startTransition, useActionState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { deletePaymentOption } from "./payment-option.action";

const formSchema = z.object({
  id: z.string(),
});

export default function DeletePaymentOptionButton({
  id,
}: Readonly<{ id: string }>) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id,
    },
  });

  const [state, dispatch, isPending] = useActionState(
      deletePaymentOption,
      undefined,
    );

  const handleSubmit = form.handleSubmit(() => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("id", id);
      dispatch(formData);
    });
  });

  useEffect(() => {
    if (state) {
      if ("success" in state && state.success) {
        // On success, show toast
        toast.success("Payment option deleted successfully");
      }

      if ("error" in state) {
        // On error, show error toast with description
        toast.error("Failed to delete payment option", {
          description: state.error,
        });
      }
    }
  }, [state]);

  return (
    <form onSubmit={handleSubmit}>
      <Button type="submit" variant="destructive" size="icon" disabled={isPending}>
        <Trash2 />
      </Button>
    </form>
  );
}
