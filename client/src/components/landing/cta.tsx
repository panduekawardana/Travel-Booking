import Button from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="px-6 py-24 text-center">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">
          Ready for your next adventure?
        </h2>
        <p className="mt-3 text-neutral-500">
          Join thousands of travelers who have discovered their dream destinations with us.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button size="lg">Browse destinations</Button>
          <Button variant="secondary" size="lg">
            View offers
          </Button>
        </div>
      </div>
    </section>
  );
}
