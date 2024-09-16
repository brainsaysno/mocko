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
import { useEditMockoContext } from '@/routes/mockos/new';

const newAIProseMockoSchema = z.object({
  name: z.string().max(15, 'Name must be smaller than 18 chars.'),
  content: z.string(),
  example: z.string().optional(),
  model: z.nativeEnum(LLMModel),
});

type FieldValues = z.infer<typeof newAIProseMockoSchema>;

const AIProseDefaultModel = LLMModel.Gpt4oMini;

export default function NewAIProseMocko() {
  const navigate = useNavigate();

  const defaultValues = useEditMockoContext();

  if (defaultValues) defaultValues.model ??= AIProseDefaultModel;

  const form = useForm<FieldValues>({
    resolver: zodResolver(newAIProseMockoSchema),
    defaultValues: defaultValues ?? {
      model: AIProseDefaultModel,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const dto = {
      ...data,
      type: MockoType.AIProse,
    };

    if (defaultValues?.id) {
      await db.mockos.update(defaultValues.id, dto);
    } else {
      await db.mockos.add(dto);
    }
    navigate({
      to: '/mockos',
    });
  };

  return (
    <Form {...form}>
      <form
        id="tour-mocko-form"
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
          name="example"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="example">Example output (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  data-testid="example-input"
                  placeholder="ex. Eco-friendly bamboo toothbrush, soft bristles."
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
        <Button type="submit" id="tour-mocko-save">
          Save
        </Button>
      </form>
    </Form>
  );
}
