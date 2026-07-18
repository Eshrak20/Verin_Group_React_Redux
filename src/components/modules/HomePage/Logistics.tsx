import ClientTestimonials from "./ClientTestimonials";
import OurClients from "./OurClients";


export default function Logistics() {
  return (
    <div className="max-w-6xl mx-auto w-full">
        <div className="flex justify-center">
            <h1 className="text-4xl home-black-text pt-5 font-bold">Logistics zone</h1>
        </div>
      <OurClients />
      <div className="border-t border-gray-200 dark:border-gray-700 mx-6" />
      <ClientTestimonials />
    </div>
  );
}