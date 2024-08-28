import { PropsWithChildren } from 'react';
import ReactJoyride, { CallBackProps, Step } from 'react-joyride';
import { useProductTourContext } from './ProductTourContext';
import { useNavigate } from '@tanstack/react-router';
import { useMount } from 'react-use';
import { H1 } from '@/components/typography/h1';
import useIsOnboarded from '@/hooks/useIsOnboarded';

const tourSteps: Step[] = [
  {
    target: '#tour-new-mocko-button',
    content: (
      <>
        <h3 className="text-xl font-semibold mb-1">1 of 6</h3>
        <p>
          Here you can create a new mocko—your mock data generator. Go ahead and
          take a look!
        </p>
      </>
    ),
    data: {
      next: '/mockos/new',
    },
    disableBeacon: true,
  },
  {
    target: '#tour-mocko-type-tabs',
    content: (
      <>
        <h3 className="text-xl font-semibold mb-1">2 of 6</h3>
        <p>
          First, choose how you'd like to generate your data. Select the option
          that fits your project best!
        </p>
      </>
    ),
    data: {
      previous: '/mockos',
      next: '/mockos/new',
    },
  },
  {
    target: '#tour-mocko-form',
    content: (
      <>
        <h3 className="text-xl font-semibold mb-1">3 of 6</h3>
        <p>
          Now it's time to fill out the details for your mocko. Provide the
          necessary information to tailor your mock data just the way you need
          it.
        </p>
      </>
    ),
    data: {},
  },
  {
    target: '#tour-mocko-save',
    content: (
      <>
        <h3 className="text-xl font-semibold mb-1">4 of 6</h3>
        <p>Next, save your mocko and bring your data to life!</p>
      </>
    ),
    data: {
      next: '/mockos',
    },
  },
  {
    target: '.mocko-card:nth-of-type(1)',
    content: (
      <>
        <h3 className="text-xl font-semibold mb-1">5 of 6</h3>
        <p>
          Next, I've already created a mocko for you to test out. Give it a try
          here!
        </p>
      </>
    ),
    data: {
      previous: '/mockos/new',
    },
  },
  {
    target: '.mocko-card:nth-of-type(1) #tour-export-buttons',
    content: (
      <>
        <h3 className="text-xl font-semibold mb-1">6 of 6</h3>
        <p>
          These are your export buttons. You can generate the data to preview
          it, copy it directly, or send it via email.
        </p>
      </>
    ),
    data: {},
  },
];

export default function ProductTourWrapper({
  children,
}: PropsWithChildren<{}>) {
  const {
    setState,
    state: { run, stepIndex, steps },
  } = useProductTourContext();
  const navigate = useNavigate();

  useMount(() => {
    setState({ steps: tourSteps });
  });

  const { setIsOnboarded } = useIsOnboarded();

  const handleCallback = async (data: CallBackProps) => {
    const {
      action,
      index,
      step: {
        data: { next, previous },
      },
      type,
    } = data;
    const isPreviousAction = action === 'prev';

    if (type === 'step:after') {
      if (index < tourSteps.length) {
        if (isPreviousAction ? previous : next)
          await navigate({
            to: isPreviousAction && previous ? previous : next,
          });
        setState({ stepIndex: index + (isPreviousAction ? -1 : 1) });
      }

      if (index === tourSteps.length - 1) {
        if (isPreviousAction && previous) {
          await navigate({ to: previous });
          setState({ stepIndex: index - 1 });
        } else {
          setIsOnboarded(true);
        }
      }
    }
  };
  return (
    <>
      {children}
      <ReactJoyride
        callback={handleCallback}
        continuous
        run={run}
        stepIndex={stepIndex}
        steps={steps}
        styles={{
          options: {
            primaryColor: 'rgb(15, 23, 42)',
          },
        }}
        disableOverlayClose
        disableCloseOnEsc
      />
    </>
  );
}
