import ClientTestimonials from "./ClientTestimonials";
import OurClients from "./OurClients";


export default function Logistics() {
  return (
    <div className="container mx-auto">
        <div className="flex justify-center">
            <h1 className="text-4xl text-white pt-5 font-bold">Logistics zone</h1>
        </div>
      <OurClients />
      <div className="border-t border-gray-200 dark:border-gray-700 mx-6" />
      <ClientTestimonials />
    </div>
  );
}