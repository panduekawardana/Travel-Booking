import Image from "next/image";

const destinations = [
  {
    name: "Bali",
    location: "Indonesia",
    price: "$299",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
  },
  {
    name: "Tokyo",
    location: "Japan",
    price: "$459",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80",
  },
  {
    name: "Paris",
    location: "France",
    price: "$399",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80",
  },
  {
    name: "Santorini",
    location: "Greece",
    price: "$549",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",
  },
];

export default function Destinations() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">
            Popular destinations
          </h2>
          <p className="mt-3 text-neutral-500">
            Handpicked places our travelers love
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((d) => (
            <a
              key={d.name}
              href="#"
              className="group block overflow-hidden rounded-2xl bg-white transition-shadow hover:shadow-md"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  src={d.image}
                  alt={d.name}
                  width={600}
                  height={450}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-neutral-900">{d.name}</h3>
                <p className="text-sm text-neutral-500">{d.location}</p>
                <p className="mt-2 text-sm font-medium text-neutral-900">
                  From {d.price}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
