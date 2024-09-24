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
      <div className="space-y-1">
        <h3 className="text-xl font-semibold">1 of 6</h3>
        <p>
          Here you can create a new <b>Mocko</b>—your mock data generator 🚀
        </p>
        <p>Go ahead and take a look!</p>
      </div>
    ),
    data: {
      next: '/mockos/new',
    },
    disableBeacon: true,
  },
  {
    target: '#tour-mocko-type-tabs',
    content: (
      <div className="space-y-1">
        <h3 className="text-xl font-semibold">2 of 6</h3>
        <p>
          First, choose <b>HOW</b> you'd like to generate your data.
        </p>
        <p>Select the option that fits your project best!</p>
      </div>
    ),
    data: {
      previous: '/mockos',
      next: '/mockos/new',
    },
  },
  {
    target: '#tour-mocko-form',
    content: (
      <div className="space-y-1">
        <h3 className="text-xl font-semibold">3 of 6</h3>
        <p>
          Now it's time to <b>TAILOR</b> your Mocko to just the way you need it.
        </p>
        <p>Just answer the questions, you'll be fine...</p>
      </div>
    ),
    data: {},
  },
  {
    target: '#tour-mocko-save',
    content: (
      <div className="space-y-1">
        <h3 className="text-xl font-semibold">4 of 6</h3>
        <p>
          Finally, <b>SAVE</b> your Mocko and bring your data to life!
        </p>
      </div>
    ),
    data: {
      next: '/mockos',
    },
  },
  {
    target: '.mocko-card:nth-of-type(1)',
    content: (
      <div className="space-y-1">
        <h3 className="text-xl font-semibold">5 of 6</h3>
        <p>
          I've already created a Mocko for you to test out.{' '}
          <b>Give it a try here!</b>
        </p>
      </div>
    ),
    data: {
      previous: '/mockos/new',
    },
  },
  {
    target: '.mocko-card:nth-of-type(1) #tour-export-buttons',
    content: (
      <div className="space-y-1">
        <h3 className="text-xl font-semibold">6 of 6</h3>
        <p>
          These are your <b>export buttons</b>.
        </p>
        <p>
          You can generate the data to preview it, copy it directly, or send it
          via email... <i>Have fun!</i>
        </p>
      </div>
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
            overlayColor: 'rgba(0, 0, 0, 0.8)',
          },
        }}
        disableOverlayClose
        disableCloseOnEsc
        hideCloseButton
      />
    </>
  );
}
