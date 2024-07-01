"use client";
import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/custom/button";
import { PasswordInput } from "@/components/custom/password-input";
import { cn } from "@/lib/utils";
import {
  CreateSubAccountSchema,
  CreateSubAccountSchemaType,
  ManageSubAccountSchema,
  ManageSubAccountSchemaType,
  RoleTypeList,
  SubAccountsColumnType,
  TierTypeList,
} from "@/lib/types";
import { useToast } from "../ui/use-toast";
import {
  CreateSubAccountAction,
  UpdateSubAccountAction,
} from "@/server-actions";
import { useRouter } from "next/navigation";

interface ManageSubAccountFormProps extends HTMLAttributes<HTMLDivElement> {
  credentials: SubAccountsColumnType;
  parent_comm_rate: Commission;
}

export function ManageSubAccountForm({
  className,
  credentials,
  parent_comm_rate,
  ...props
}: ManageSubAccountFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const defaultValues: Partial<ManageSubAccountSchemaType> = {
    username: !credentials.username ? "" : credentials.username,
    email: !credentials.email ? "" : credentials.email,
    role: !credentials.role ? "" : credentials.role,
    tier: !credentials.tier ? "1" : credentials.tier,
    percent: !credentials ? 0 : credentials.commission?.percent,
  };
  const form = useForm<ManageSubAccountSchemaType>({
    resolver: zodResolver(ManageSubAccountSchema),
    mode: "onChange",
    defaultValues,
  });
  async function onSubmit(data: ManageSubAccountSchemaType) {
    try {
      await UpdateSubAccountAction(data, credentials.id);
      toast({
        variant: "successful",
        title: "Successfully update subaccount",
        description: `You have successfully update subaccount`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
      });
    } finally {
      router.refresh();
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="agent@email.com" {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g 0123456789" {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger
                          disabled={credentials.role === "Agent" && true}
                        >
                          <SelectValue
                            placeholder={
                              credentials.role
                                ? credentials.role
                                : "Select type of role"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {RoleTypeList.map((role, i) => (
                          <SelectItem value={role} key={`role-${role}`}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      You role was predetermined and only admin has authority to
                      edit.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tier</FormLabel>
                    <Select onValueChange={field.onChange} disabled>
                      <FormControl>
                        <SelectTrigger
                          disabled={Number(credentials.tier) < 1 && true}
                        >
                          <SelectValue
                            placeholder={
                              credentials.tier
                                ? credentials.tier
                                : "Select type of tier"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TierTypeList.map((tier, i) => (
                          <SelectItem value={tier} key={`tier-${tier}`}>
                            {tier}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This tier can only modified by higher upline.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="percent"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Commission rate (%)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="20%"
                      value={field.value}
                      onChange={(e) => {
                        if (
                          Number(e.target.value) > parent_comm_rate.percent ||
                          Number(e.target.value) < 0
                        )
                          return;
                        if (!isNaN(Number(e.target.value))) {
                          field.onChange(Number(e.target.value));
                        }
                      }}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-2" loading={isLoading}>
              Save changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
