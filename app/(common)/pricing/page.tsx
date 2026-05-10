import Header from '@/components/header';
import PricingPlans from '@/components/Pricing';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const plans = [
  {
    name: 'Starter',
    price: '$0',
    description: 'For curious readers who want to explore the platform.',
    features: ['Basic chat access', 'Community support', 'Limited daily usage'],
  },
  {
    name: 'Scholar Plus',
    price: '$12',
    description: 'For regular learners who want a faster, richer experience.',
    features: ['Priority responses', 'Voice interactions', 'Saved conversations'],
  },
  {
    name: 'Institution',
    price: 'Custom',
    description: 'For organizations, schools, and research groups.',
    features: ['Team access', 'Admin controls', 'Custom onboarding'],
  },
];

export default function PricingPage() {
//   return (
//     <div className='min-h-screen bg-background relative overflow-hidden'>
//       <div className='pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(86,182,198,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(138,203,208,0.06),transparent_35%)]' />
//       <Header />

//       <main className='mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8'>
//         <section className='max-w-3xl'>
//           <span className='mb-4 inline-flex rounded-full border border-accent/30 bg-accent/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-accent'>
//             Pricing Plans
//           </span>
//           <h1 className='text-4xl font-bold tracking-tight text-foreground sm:text-5xl'>
//             Simple pricing for every stage of learning.
//           </h1>
//           <p className='mt-4 text-lg leading-8 text-muted-foreground'>
//             Start free, upgrade when you need more, or roll out a managed plan for your organization.
//           </p>
//         </section>

//         <section className='grid gap-8 lg:grid-cols-3'>
//           {plans.map((plan, index) => (
//             <article
//               key={plan.name}
//               className={`group rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-1 ${
//                 index === 1
//                   ? 'border-accent/40 bg-card shadow-lg ring-1 ring-accent/20'
//                   : 'border-border/40 bg-card hover:border-accent/30 hover:shadow-md'
//               }`}
//             >
//               <div className='flex items-start justify-between gap-4'>
//                 <div>
//                   <h2 className='text-xl font-semibold text-foreground'>{plan.name}</h2>
//                   <p className='mt-2 text-sm text-muted-foreground'>{plan.description}</p>
//                 </div>
//                 <span className='rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm font-semibold text-accent'>
//                   {plan.price}
//                 </span>
//               </div>

//               <div className='mt-8 space-y-3'>
//                 {plan.features.map((feature) => (
//                   <div key={feature} className='flex items-center gap-3 text-sm text-foreground'>
//                     <span className='size-2 rounded-full bg-accent' />
//                     {feature}
//                   </div>
//                 ))}
//               </div>

//               <Button asChild className='mt-8 w-full rounded-full' variant={index === 1 ? 'default' : 'outline'}>
//                 <Link href='/auth/signup'>Choose plan</Link>
//               </Button>
//             </article>
//           ))}
//         </section>
//       </main>
//     </div>
//   );
return <PricingPlans />
}