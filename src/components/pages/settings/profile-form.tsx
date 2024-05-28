"use client";
import { z } from "zod";
// import { Link } from 'react-router-dom'
import Link from "next/link";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/custom/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RoleTypeList,
  UserProfileSchema,
  UserProfileSchemaType,
} from "@/lib/types";
import { HTMLAttributes } from "react";

interface UserProfileFormProps {
  credentials: Users;
}

export default function ProfileForm({ credentials }: UserProfileFormProps) {
  const defaultValues: Partial<UserProfileSchemaType> = {
    username: !credentials.username ? "" : credentials.username,
    email: !credentials.email ? "" : credentials.email,
    role: !credentials.role ? "" : credentials.role,
  };
  const form = useForm<UserProfileSchemaType>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: UserProfileSchemaType) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent Id</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your preset agent id. Only admin can change username
                name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="your@email.com"
                  {...field}
                  disabled={credentials.role === "Agent" && true}
                />
              </FormControl>
              <FormDescription>
                If there any problem with current email, you may contact to hq
                for assistance.
              </FormDescription>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger disabled={field.value === "Agent" && true}>
                    <SelectValue
                      placeholder={
                        field.value ? field.value : "Select type of role"
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
                You role was predetermined and only admin has authority to edit.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  );
}
