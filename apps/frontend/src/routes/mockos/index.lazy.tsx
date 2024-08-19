import MockoCard from '@/components/MockoCard';
import { H1 } from '@/components/typography/h1';
import { buttonVariants } from '@/components/ui/button';
import useMockos from '@/hooks/useMockos';
import { Link, createLazyFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/mockos/')({
  component: Mockos,
});

function Mockos() {
  const { isSuccess, data } = useMockos();
  const navigate = useNavigate();

  if (!data || data.length == 0) navigate({ to: '/' });

  return (
    <main className="w-screen h-screen overflow-hidden p-12 bg-pattern">
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
        {isSuccess ? data.map((m) => <MockoCard mocko={m} />) : null}
        {isSuccess && data.length == 0 ? <p></p> : null}
      </section>
    </main>
  );
}
