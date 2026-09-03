import z from "zod";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Select from "../ui/Select";

const EXPIRY_OPTIONS = [
  { value: "DEFAULT", label: "Default (30 days)" },
  { value: "ONE_DAY", label: "1 Day" },
  { value: "SEVEN_DAYS", label: "7 Days" },
  { value: "ONE_MONTH", label: "1 Month" },
  { value: "THREE_MONTHS", label: "3 Months" },
  { value: "FIVE_MINUTES", label: "5 Minutes (test)" },
  { value: "TEN_MINUTES", label: "10 Minutes (test)" },
  { value: "CUSTOM", label: "Custom date" },
];

const schema = z
  .object({
    originalUrl: z
      .string()
      .trim()
      .min(1, "Destination URL is required")
      .url("Enter a valid URL"),
    customAlias: z
      .string()
      .trim()
      .max(30, "Alias must be less than 30 characters")
      .regex(/^[a-zA-Z0-9-_]*$/, "Only letters, numbers, - and _ allowed")
      .optional()
      .or(z.literal("")),
    expiryType: z.string().optional(),
    expiresAt: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.expiryType === "CUSTOM" && !data.expiresAt) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Custom expiry date is required", path: ["expiresAt"] });
    }
  });

export default function CreateUrlModal({ isOpen, onClose, onSubmit, loading = false }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { originalUrl: "", customAlias: "", expiryType: "DEFAULT", expiresAt: "" },
  });

  const expiryType = watch("expiryType");

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const submit = async (data) => {
    const payload = {
      originalUrl: data.originalUrl,
      customAlias: data.customAlias || undefined,
      expiryType: data.expiryType || "DEFAULT",
      expiresAt: data.expiryType === "CUSTOM" && data.expiresAt
        ? new Date(data.expiresAt).toISOString()
        : undefined,
    };
    await onSubmit(payload);
    reset();
  };

  const closeModal = () => { reset(); onClose(); };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Create a short link">
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <Input
          label="Destination URL"
          placeholder="https://example.com"
          error={errors.originalUrl?.message}
          {...register("originalUrl")}
        />
        <Input
          label="Custom Alias (Optional)"
          placeholder="my-campaign"
          hint="zip.link/my-campaign"
          error={errors.customAlias?.message}
          {...register("customAlias")}
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-heading">Expiry</label>
          <Controller
            name="expiryType"
            control={control}
            render={({ field }) => (
              <Select
                options={EXPIRY_OPTIONS}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        {expiryType === "CUSTOM" && (
          <Input
            label="Custom Expiry Date"
            type="datetime-local"
            error={errors.expiresAt?.message}
            {...register("expiresAt")}
          />
        )}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={closeModal}>Cancel</Button>
          <Button type="submit" isLoading={loading || isSubmitting}>Create Link</Button>
        </div>
      </form>
    </Modal>
  );
}