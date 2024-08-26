import MockoCard from '@/components/MockoCard';
import { H1 } from '@/components/typography/h1';
import { Button, buttonVariants } from '@/components/ui/button';
import useMockos from '@/hooks/useMockos';
import { Link, createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import MockoEyesClosed from '../../assets/mocko-eyes-closed.webp';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';

export const Route = createLazyFileRoute('/mockos/')({
  component: Mockos,
});

function Mockos() {
  const { isSuccess, isLoading, data } = useMockos();
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  // if (isSuccess && data.length == 0) navigate({ to: '/' });

  return (
    <main className="relative w-screen h-screen overflow-hidden p-12 bg-pattern">
      <header className="mb-8 flex justify-between items-center">
        <H1>My Mockos</H1>
        <Link
          className={buttonVariants({ variant: 'default' })}
          to="/mockos/new"
        >
          New Mocko
        </Link>
      </header>
      <section className="flex justify-center gap-6 flex-wrap">
        {isSuccess ? (
          data.length > 0 ? (
            data.map((m) => (
              <MockoCard
                mocko={m}
                disabled={isGenerating}
                afterGenerate={() => setIsGenerating(false)}
                onGenerate={() => setIsGenerating(true)}
              />
            ))
          ) : (
            <Onboarding />
          )
        ) : null}
        {isLoading ? <p>Loading...</p> : null}
      </section>
      <motion.div
        className="absolute -bottom-16 w-48 md:w-80 left-12 z-[51]"
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img src={MockoEyesClosed} className="-rotate-12" alt="Mocko Logo" />
      </motion.div>
    </main>
  );
}

const steps = [
  {
    Component: (
      <div className="text-center space-y-4">
        <H1>Hi there! I'm Mocko</H1>
        <p className="md:text-xl">
          Your friendly guide here to help you breeze through the world of mock
          data generation. Whether you're building a new app, testing APIs, or
          just need some quick data for your project, I've got you covered.
        </p>
      </div>
    ),
  },
  {
    Component: (
      <div className="text-center space-y-4">
        <H1>What's mocko?</H1>
        <p className="md:text-xl">
          Think of me as your trusty sidekick in development. Mocko is an
          essential tool designed to make your life easier by generating and
          exporting consistent, user-friendly mock data in a snap. No more time
          wasted on manual data creation—just focus on what you do best:
          building amazing things!
        </p>
      </div>
    ),
  },
  {
    Component: (
      <div className="text-center space-y-4">
        <H1>Let’s Get Started!</H1>
        <p className="md:text-xl">
          Ready to dive in? I'll walk you through the process step by step,
          ensuring you get the most out of Mocko. It’s quick, easy, and I’ll be
          right here with you the whole time. Let's create some awesome mock
          data together!
        </p>
      </div>
    ),
  },
];

function Onboarding() {
  const [open, setOpen] = useState(true);

  const [activeStep, setActiveStep] = useState(0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-full w-[75vw] p-8">
        {steps[activeStep].Component}
        <div className="flex justify-center gap-8">
          {activeStep == 0 ? null : (
            <Button
              variant="secondary"
              onClick={() => setActiveStep((as) => as - 1)}
            >
              &lt; Prev
            </Button>
          )}
          {activeStep == steps.length - 1 ? null : (
            <Button onClick={() => setActiveStep((as) => as + 1)}>
              Next &gt;
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
