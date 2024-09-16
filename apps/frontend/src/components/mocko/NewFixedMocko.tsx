import { db } from '@/lib/db';
import { MockoType } from '@/model/mocko';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEditMockoContext } from '@/routes/mockos/new';

export default function NewFixedMocko() {
  const newFixedMockoSchema = z.object({
    name: z.string().max(15, 'Name must be smaller than 15 chars.'),
    content: z.string(),
  });

  const defaultValues = useEditMockoContext();

  type FieldValues = z.infer<typeof newFixedMockoSchema>;

  const form = useForm<FieldValues>({
    resolver: zodResolver(newFixedMockoSchema),
    defaultValues,
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const dto = {
      ...data,
      type: MockoType.Fixed,
    };

    if (defaultValues?.id) {
      await db.mockos.update(defaultValues.id, dto);
    } else {
      await db.mockos.add(dto);
    }
    await navigate({
      to: '/mockos',
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="md:w-2/3 space-y-6 mx-auto"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mocko Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="ex. Store Product"
                  {...field}
                  data-testid="name-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="ex. Eco-friendly bamboo toothbrush, soft bristles."
                  className="resize-none"
                  {...field}
                  data-testid="content-input"
                />
              </FormControl>
              <FormDescription>
                You can add{' '}
                <span className="text-slate-600 font-medium">
                  {'{{'} variables {'}}'}
                </span>{' '}
                to use later
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
