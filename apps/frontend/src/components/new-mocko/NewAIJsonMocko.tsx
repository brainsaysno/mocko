import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { LLMModel, MockoType } from '@/model/mocko';
import { db } from '@/lib/db';
import { Input } from '../ui/input';
import { useNavigate } from '@tanstack/react-router';

const newAIJsonMockoSchema = z.object({
  name: z.string().max(15, 'Name must be smaller than 18 chars.'),
  content: z.string(),
  structure: z.string().optional(),
  model: z.nativeEnum(LLMModel),
});

type FieldValues = z.infer<typeof newAIJsonMockoSchema>;

export default function NewAIJsonMocko() {
  const navigate = useNavigate();

  const form = useForm<FieldValues>({
    resolver: zodResolver(newAIJsonMockoSchema),
    defaultValues: {
      model: LLMModel.Gpt4oMini,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    await db.mockos.add({ ...data, type: MockoType.AIJson });
    navigate({
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
              <FormLabel htmlFor="name">Mocko Name</FormLabel>
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
              <FormLabel htmlFor="content">What do you want to mock?</FormLabel>
              <FormControl>
                <Textarea
                  data-testid="content-input"
                  placeholder="ex. A short product description."
                  className="resize-none"
                  {...field}
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

        <FormField
          control={form.control}
          name="structure"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="example">JSON Structure (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  data-testid="structure-input"
                  placeholder='ex. { "name": "Bamboo brush", "description": "Eco-friendly bamboo toothbrush, soft bristles." }'
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Model</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  data-testid="model-select"
                  disabled
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(LLMModel).map((m) => (
                      <SelectItem value={m} key={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
