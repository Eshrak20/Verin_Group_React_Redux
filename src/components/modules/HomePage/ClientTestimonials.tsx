

interface Stat {
  value: string;
  label: string;
}

interface Testimonial {
  id: number;
  name: string;
  date: string;
  avatar: string;
  review: string;
  rating: number;
}

const stats: Stat[] = [
  { value: "98%", label: "Client Satisfaction" },
  { value: "150+", label: "Project Delivered" },
  { value: "4.9", label: "Average Rating" },
  { value: "95%", label: "Repeat Clients" },
];

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Chan Man",
    date: "22 January 2024",
    avatar: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847213/men1_o2gnb2.jpg",
    review: "Innovative idea is one who idea was good results.",
    rating: 3,
  },
  {
    id: 2,
    name: "Solvak",
    date: "13 February 2024",
    avatar: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847213/men3_i1ubev.jpg",
    review: "Innovative idea is a non rich company.",
    rating: 5,
  },
  {
    id: 3,
    name: "Zaan Vai",
    date: "11 March 2024",
    avatar: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847213/men2_zcwnkg.jpg",
    review: "Work is very dedicated and clear.",
    rating: 5,
  },
  {
    id: 4,
    name: "Rifat",
    date: "25 March 2024",
    avatar: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782847213/men4_qwrt4l.jpg",
    review: "Innovative idea solution exactly from the best results and work with exceptional quality.",
    rating: 5,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={star <= rating ? "#FBBF24" : "#E5E7EB"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ src, name }: { src: string; name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `<span class="text-sm font-bold text-blue-600 dark:text-blue-300">${initials}</span>`;
          }
        }}
      />
    </div>
  );
}

export default function ClientTestimonials() {
  return (
    <section className="py-12 px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold home-black-text dark:text-white">
          What Our Clients Say
        </h2>
        <div className="w-12 h-0.5 bg-[#262626] mx-auto mt-2 mb-3" />
        <p className="text-sm home-black-text">
          Real feedback from businesses we've grown with and helped to their success.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="
              bg-blue-50 dark:bg-slate-800
              rounded-2xl py-5 px-4 text-center
              border border-blue-100 dark:border-slate-700
            "
          >
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Testimonial Cards */}
      <div className="grid grid-cols-4 gap-4">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="
              bg-white dark:bg-slate-800
              border border-gray-200 dark:border-slate-700
              rounded-2xl p-4 flex flex-col gap-3
              hover:shadow-md transition-shadow duration-300
            "
          >
            {/* Top — Avatar + Name */}
            <div className="flex items-center gap-3">
              <Avatar src={t.avatar} name={t.name} />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {t.name}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {t.date}
                </p>
              </div>
            </div>

            {/* Review */}
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
              {t.review}
            </p>

            {/* Stars */}
            <StarRating rating={t.rating} />
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-8">
        <button className="
          bg-[#262626] hover:bg-[#003557] text-white
          text-sm font-semibold px-8 py-2.5 rounded-full
          transition-colors duration-200
        ">
          View All Testimonials
        </button>
      </div>
    </section>
  );
}