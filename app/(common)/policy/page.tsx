import Header from '@/components/header';

const rules = [
  'Use respectful language and avoid hateful, harassing, or discriminatory prompts.',
  'Treat responses as guidance and verify important religious or legal matters with qualified sources.',
  'Do not submit private, sensitive, or illegal information through the platform.',
  'Administrators may review misuse and suspend access when necessary to protect the service.',
];

export default function PolicyPage() {
  return (
    <div className='min-h-screen bg-background relative overflow-hidden'>
      <div className='pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(138,203,208,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(86,182,198,0.06),transparent_35%)]' />
      {/* <Header /> */}

      <main className='mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8'>
        <section className='max-w-3xl'>
          <span className='mb-4 inline-flex rounded-full border border-secondary/30 bg-secondary/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-secondary'>
            Community Guidelines
          </span>
          <h1 className='text-4xl font-bold tracking-tight text-foreground sm:text-5xl'>
            A clear policy keeps the platform safe and focused.
          </h1>
          <p className='mt-4 text-lg leading-8 text-muted-foreground'>
            The Scholar is built for thoughtful learning. These guidelines outline how the service should be used and where responsibility remains with the user.
          </p>
        </section>

        <section className='rounded-3xl border border-border/40 bg-card p-8 shadow-sm'>
          <div className='grid gap-5 md:grid-cols-2'>
            {rules.map((rule, index) => (
              <div key={rule} className='rounded-2xl border border-accent/20 bg-accent/5 p-5 hover:border-accent/40 transition-colors'>
                <div className='mb-3 flex size-9 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent'>
                  0{index + 1}
                </div>
                <p className='text-sm leading-6 text-foreground'>{rule}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}