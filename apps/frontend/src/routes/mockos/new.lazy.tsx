import NewAIProseMocko from '@/components/new-mocko/NewAIProseMocko';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { db } from '@/lib/db';
import { MockoType } from '@/model/mocko';
import { zodResolver } from '@hookform/resolvers/zod';
import { createLazyFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion } from 'framer-motion';

export const Route = createLazyFileRoute('/mockos/new')({
  component: () => <NewMocko />,
});

function NewMocko() {
  return (
    <main className="w-screen h-screen overflow-hidden p-12 bg-pattern">
      <motion.div initial="rest" whileHover="hover" className="mb-2">
        <Link to="/mockos" className="flex items-center gap-1">
          <ChevronLeft />
          <motion.p
            variants={{
              rest: { x: -5, opacity: 0 },
              hover: { x: 0, opacity: 100 },
            }}
          >
            Back to Mockos
          </motion.p>
        </Link>
      </motion.div>
      <Tabs defaultValue="ai" className="flex flex-col justify-center">
        <TabsList
          className="md:w-1/2 grid w-full grid-cols-3 mx-auto"
          id="tour-mocko-type-tabs"
        >
          <TabsTrigger value="ai">AI</TabsTrigger>
          <TabsTrigger value="deterministic">Deterministic</TabsTrigger>
          <TabsTrigger value="fixed">Fixed</TabsTrigger>
        </TabsList>
        <TabsContent value="ai">
          <NewAIMocko />
        </TabsContent>
        <TabsContent value="deterministic">
          <NewDeterministicMocko />
        </TabsContent>
        <TabsContent value="fixed">
          <NewFixedMocko />
        </TabsContent>
      </Tabs>
    </main>
  );
}

function NewFixedMocko() {
  const newFixedMockoSchema = z.object({
    name: z.string().max(15, 'Name must be smaller than 15 chars.'),
    content: z.string(),
  });

  type FieldValues = z.infer<typeof newFixedMockoSchema>;

  const form = useForm<FieldValues>({
    resolver: zodResolver(newFixedMockoSchema),
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    await db.mockos.add({ ...data, type: MockoType.Fixed });
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
                <Input placeholder="Teacher Email" {...field} data-testid="name-input" />
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
                  placeholder="Whatever you can think of"
                  className="resize-none"
                  {...field}
                  data-testid="content-input"
                />
              </FormControl>
              <FormDescription>
                You can add{' '}
                <span className="text-teal-500">
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

function NewDeterministicMocko() {
  return <p>Deterministic mocko not implemented yet!</p>;
}

function NewAIMocko() {
  return (
    <Tabs defaultValue="prose" className="flex flex-col justify-center">
      <TabsList className="md:w-1/2 grid w-full grid-cols-2 mx-auto">
        <TabsTrigger value="prose">Prose</TabsTrigger>
        <TabsTrigger value="structured">Structured</TabsTrigger>
      </TabsList>
      <TabsContent value="prose">
        <NewAIProseMocko />
      </TabsContent>
      <TabsContent value="structured">
        <NewAIStructuredMocko />
      </TabsContent>
    </Tabs>
  );
}

function NewAIStructuredMocko() {
  return <p>AI Structured not implemented yet!</p>;
}
