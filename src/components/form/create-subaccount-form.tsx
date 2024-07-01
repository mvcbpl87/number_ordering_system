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
  RoleTypeList,
} from "@/lib/types";
import { useToast } from "../ui/use-toast";
import { CreateSubAccountAction } from "@/server-actions";
import { useRouter } from "next/navigation";

interface CreateSubAccountFormProps extends HTMLAttributes<HTMLDivElement> {
  user_id: string;
  role: string | undefined;
  tier: string;
  commission_value: RootCommission | undefined;
}

export function CreateSubAccountForm({
  className,
  role,
  user_id,
  tier,
  commission_value,
  ...props
}: CreateSubAccountFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<CreateSubAccountSchemaType>({
    resolver: zodResolver(CreateSubAccountSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      username: "",
      role: role ? role : "",
      parent: user_id /* !important dependency */,
      password: "",
      tier,
      percent: !commission_value ? 0 : commission_value.percent,
    },
  });
  async function onSubmit(data: CreateSubAccountSchemaType) {
    try {
      console.log(data);
      await CreateSubAccountAction(data);
      toast({
        variant: "successful",
        title: "Successfully create subaccount",
        description: `You have successfully create a subaccount`,
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
                    <Input placeholder="agent@email.com" {...field} />
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
                    <Input placeholder="e.g 0123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger disabled={role === "Agent" && true}>
                        <SelectValue
                          placeholder={role ? role : "Select type of role"}
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
                          Number(e.target.value) > commission_value?.percent! ||
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-2" loading={isLoading}>
              Create subaccount
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
