'use client';
import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconBrandFacebook, IconBrandGithub } from '@tabler/icons-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { PasswordInput } from '@/components/custom/password-input'
import { cn } from '@/lib/utils'
import { UserAuthSchema, type UserAuthSchemaType } from '@/lib/types';
import { LoginAction } from '@/server-actions';
interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<UserAuthSchemaType>({
    resolver: zodResolver(UserAuthSchema),
    defaultValues: {
      agent_id: '',
      password: '',
    },
  })

  async function onSubmit(data:UserAuthSchemaType) {
    try{
      await LoginAction(data);
    }catch(err){
      console.log('Error from login form',err)
    }
    // setIsLoading(true)
    // console.log(data)

    // setTimeout(() => {
    //   setIsLoading(false)
    // }, 3000)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='agent_id'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Agent Id</FormLabel>
                  <FormControl>
                    <Input placeholder='eg. 0123456789' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Password</FormLabel>
                    <Link
                      href='#d'
                      className='text-sm font-medium text-muted-foreground hover:opacity-75'
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' loading={isLoading}>
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
