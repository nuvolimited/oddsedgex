"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
  agentRegistrationFormSchema,
  agentRegistrationKYCDocumentEnum,
} from "./agent-registration.schema";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn, toTitleCase } from "@/lib/utils";
import { ImageUploader } from "@/components/ui/media-uploader";
import { createAgent } from "./agent-registration.action";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * AgentRegistrationForm component for registering an agent.
 *
 * This form collects user information such as address, phone,
 * city, state, and KYC details. It validates input using Zod
 * and submits data to the createAgent action.
 *
 * @returns The AgentRegistrationForm component.
 */
export function AgentRegistrationForm() {
  const router = useRouter();
  const [state, dispatch, isPending] = useActionState(createAgent, undefined);

  // Initialize form with default values and validation
  const form = useForm<z.infer<typeof agentRegistrationFormSchema>>({
    resolver: zodResolver(agentRegistrationFormSchema),
    defaultValues: {
      address: "",
      phone: "",
      city: "",
      state: "",
      kyc: {
        documentBack: undefined,
        documentFront: "",
        documentNumber: "",
        documentType: undefined,
        expirationDate: "",
      },
    },
  });

  // Handle form submission
  const handleSubmit = form.handleSubmit((payload) => {
    startTransition(() => {
      const formData = new FormData();

      formData.append("address", payload.address);
      formData.append("phone", payload.phone);
      formData.append("city", payload.city);
      formData.append("state", payload.state);
      formData.append("kyc", JSON.stringify(payload.kyc));

      // Dispatch form data
      dispatch(formData);
    });
  });

  // Effect to handle state changes after form submission
  useEffect(() => {
    if (state) {
      if ("success" in state && state.success) {
        // On success, show toast and navigate to dashboard
        toast.success(state.success);
        router.push("/dashboard");
      }

      if ("error" in state) {
        // On error, show error toast
        toast.error("Agent registration failed", {
          description: state.error,
        });
      }
    }
  }, [router, state]);

  return (
    <Form {...form}>
      <form className="space-y-4" autoComplete="on" onSubmit={handleSubmit}>
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" {...field} autoFocus />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h4 className="mt-8">KYC</h4>
        <FormField
          control={form.control}
          name="kyc.documentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Type</FormLabel>
              <FormControl>
                <ToggleGroup
                  type="single"
                  {...field}
                  className="w-full"
                  onValueChange={field.onChange}
                >
                  {agentRegistrationKYCDocumentEnum.options.map((option) => (
                    <ToggleGroupItem value={option} key={option}>
                      {toTitleCase(option.replaceAll("_", " ").toLowerCase())}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("kyc.documentType") && (
          <>
            <FormField
              control={form.control}
              name="kyc.documentNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kyc.expirationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiration Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div
              className={cn(
                "grid",
                form.getValues("kyc.documentType") !== "PASSPORT" &&
                  "grid-cols-2 gap-4"
              )}
            >
              <FormField
                control={form.control}
                name="kyc.documentFront"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Front</FormLabel>
                    <FormControl>
                      <ImageUploader
                        id="front"
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.getValues("kyc.documentType") !== "PASSPORT" && (
                <FormField
                  control={form.control}
                  name="kyc.documentBack"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Back</FormLabel>
                      <FormControl>
                        <ImageUploader
                          id="back"
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </>
        )}
        <Button type="submit" className="w-full mt-4" disabled={isPending}>
          {isPending ? <Loader className="animate-spin" /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
