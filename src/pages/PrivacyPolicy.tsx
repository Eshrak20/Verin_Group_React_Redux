

export default function PrivacyPolicy() {
  return (
    <section className="bg-[#fbfbf8] py-16 px-4 md:px-8 flex justify-center items-center font-sans">
      {/* POLICY CARD CONTAINER */}
      <div className="max-w-3xl w-full bg-white rounded-2xl border border-stone-200 shadow-sm p-8 md:p-12 text-stone-800">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 tracking-wide">
            Verin Decor - Customer Policy
          </h1>
          <div className="w-full h-px bg-stone-300 mt-6 mb-8"></div>
          <p className="text-stone-600 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            স্বাগতম Verin Decor-এ। আমাদের কাছ থেকে অর্ডার করার মাধ্যমে আপনি নিচের শর্তাবলীতে সম্মতি প্রদান করছেন।
          </p>
        </div>

        {/* POLICY SECTIONS */}
        <div className="space-y-8 text-sm md:text-[15px] leading-relaxed text-stone-700">
          
          {/* ১. অর্ডার ও পেমেন্ট */}
          <div>
            <h3 className="text-base md:text-lg font-bold text-stone-900 mb-3">
              ১. অর্ডার ও পেমেন্ট
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 marker:text-stone-400">
              <li>সফল অর্ডার আমাদের Website, Facebook Page, Instagram অথবা WhatsApp-এর মাধ্যমে গ্রহণ করা হয়।</li>
              <li>অর্ডার নিশ্চিত করার জন্য সম্পূর্ণ বা আংশিক অগ্রিম পেমেন্ট প্রয়োজন হতে পারে।</li>
              <li>পেমেন্ট নিশ্চিত হওয়ার পর অর্ডার প্রসেসিং শুরু হবে।</li>
            </ul>
          </div>

          {/* ২. ডেলিভারি পলিসি */}
          <div>
            <h3 className="text-base md:text-lg font-bold text-stone-900 mb-3">
              ২. ডেলিভারি পলিসি
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 marker:text-stone-400">
              <li>অর্ডার কনফার্ম হওয়ার পর নির্ধারিত সময়ের মধ্যে পণ্য পাঠানো হবে।</li>
              <li>ডেলিভারি সময় এলাকা, কুরিয়ার সার্ভিস এবং অন্যান্য পরিস্থিতির উপর নির্ভর করে পরিবর্তিত হতে পারে।</li>
              <li>প্রাকৃতিক দুর্যোগ, ধর্মঘট বা কুরিয়ারজনিত বিলম্বের জন্য Verin Decor দায়ী থাকবে না।</li>
            </ul>
          </div>

          {/* ৩. পণ্যের ছবি ও বিবরণ */}
          <div>
            <h3 className="text-base md:text-lg font-bold text-stone-900 mb-3">
              ৩. পণ্যের ছবি ও বিবরণ
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 marker:text-stone-400">
              <li>ওয়েবসাইট বা সোশ্যাল মিডিয়ায় প্রদর্শিত ছবির সাথে বাস্তব পণ্যের রঙ সামান্য পার্থক্য হতে পারে।</li>
              <li>পণ্যের সাইজ, উপাদান ও অন্যান্য তথ্য বিবরণীতে উল্লেখ করা থাকবে।</li>
            </ul>
          </div>

          {/* ৪. রিটার্ন ও এক্সচেঞ্জ */}
          <div>
            <h3 className="text-base md:text-lg font-bold text-stone-900 mb-3">
             ৪. রিটার্ন ও এক্সচেঞ্জ
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 marker:text-stone-400">
              <li>ভুল পণ্য, ক্ষতিগ্রস্ত পণ্য অথবা উৎপাদনজনিত ত্রুটি থাকলে ডেলিভারির ২৪ ঘণ্টার মধ্যে আমাদের জানাতে হবে।</li>
              <li>প্রমাণ হিসেবে আনবক্সিং ভিডিও সংরক্ষণ করতে হবে।</li>
              <li>গ্রাহকের পছন্দ পরিবর্তনের কারণে রিটার্ন বা এক্সচেঞ্জ প্রযোজ্য হবে না।</li>
              <li>ব্যবহৃত, ক্ষতিগ্রস্ত বা পরিবর্তিত পণ্য এক্সচেঞ্জ গ্রহণ করা হবে না।</li>
            </ul>
          </div>

          {/* ৫. রিফান্ড পলিসি */}
          <div>
            <h3 className="text-base md:text-lg font-bold text-stone-900 mb-3">
              ৫. রিফান্ড পলিসি
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 marker:text-stone-400">
              <li>রিফান্ড অনুমোদিত হলে ৭-১৫ কার্যদিবসের মধ্যে নির্ধারিত পদ্ধতিতে ফেরত প্রদান করা হবে।</li>
              <li>কুরিয়ার চার্জ বা পেমেন্ট গেটওয়ে চার্জ রিফান্ডের আওতায় থাকবে না।</li>
            </ul>
          </div>

          {/* ৬. কাস্টম ও প্রি-অর্ডার পণ্য */}
          <div>
            <h3 className="text-base md:text-lg font-bold text-stone-900 mb-3">
              ৬. কাস্টম ও প্রি-অর্ডার পণ্য
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 marker:text-stone-400">
              <li>কাস্টমাইজড বা প্রি-অর্ডার পণ্যের ক্ষেত্রে অর্ডার বাতিল, রিটার্ন বা এক্সচেঞ্জ প্রযোজ্য হবে না।</li>
              <li>এসব পণ্যের ডেলিভারি সময় সাধারণ পণ্যের তুলনায় বেশি হতে পারে।</li>
            </ul>
          </div>

          {/* ৭. গ্রাহকের দায়িত্ব */}
          <div>
            <h3 className="text-base md:text-lg font-bold text-stone-900 mb-3">
              ৭. গ্রাহকের দায়িত্ব
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 marker:text-stone-400">
              <li>অর্ডার দেওয়ার সময় সঠিক নাম, ঠিকানা ও মোবাইল নম্বর প্রদান করতে হবে।</li>
              <li>ভুল তথ্যের কারণে ডেলিভারি ব্যর্থ হলে অতিরিক্ত চার্জ প্রযোজ্য হতে পারে।</li>
            </ul>
          </div>

          {/* ৮. গোপনীয়তা */}
          <div>
            <h3 className="text-base md:text-lg font-bold text-stone-900 mb-3">
              ৮. গোপনীয়তা
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 marker:text-stone-400">
              <li>গ্রাহকের ব্যক্তিগত তথ্য শুধুমাত্র অর্ডার প্রসেসিং ও গ্রাহকসেবার জন্য ব্যবহার করা হবে।</li>
              <li>আপনার অনুমতি ছাড়া কোনো তৃতীয় পক্ষের কাছে তথ্য বিক্রি বা শেয়ার করা হবে না।</li>
            </ul>
          </div>

          {/* ৯. নীতিমালা পরিবর্তন */}
          <div>
            <h3 className="text-base md:text-lg font-bold text-stone-900 mb-3">
              ৯. নীতিমালা পরিবর্তন
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 marker:text-stone-400">
              <li>Verin Decor যেকোনো সময় পূর্ব ঘোষণা ছাড়াই এই নীতিমালা পরিবর্তন করতে পারে।</li>
            </ul>
          </div>

        </div>

        {/* FOOTER NOTE */}
        <div className="mt-12 pt-8 border-t border-stone-200 text-center space-y-2">
          <p className="text-stone-900 font-semibold text-sm md:text-base flex items-center justify-center gap-1.5">
            Verin Decor এর প্রতি আপনার আস্থা ও সমর্থনের জন্য ধন্যবাদ। 💙
          </p>
          <p className="text-stone-400 font-serif italic text-xs tracking-wider">
            "Beautiful Spaces, Trusted Service."
          </p>
        </div>

      </div>
    </section>
  );
}