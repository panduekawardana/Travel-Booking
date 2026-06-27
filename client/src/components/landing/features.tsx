const features = [
  {
    title: "Curated experiences",
    description:
      "Every trip is thoughtfully designed by travel experts who know the destination inside out.",
  },
  {
    title: "Best price guarantee",
    description:
      "We match any price you find. Book with confidence knowing you got the best deal.",
  },
  {
    title: "24/7 support",
    description:
      "Our team is here around the clock to help with any questions or changes to your plans.",
  },
  {
    title: "Flexible booking",
    description:
      "Change or cancel your booking free of charge up to 48 hours before departure.",
  },
];

export default function Features() {
  return (
    <section className="bg-neutral-50 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">
            Why travel with us
          </h2>
          <p className="mt-3 text-neutral-500">
            Everything you need for a seamless journey
          </p>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="text-center sm:text-left">
              <h3 className="text-lg font-medium text-neutral-900">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
