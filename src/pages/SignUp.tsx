// // src/pages/Register.tsx
// import { useState, useEffect, useRef } from "react";
// import { Eye, EyeOff, ShieldHalf, UserPlus } from "lucide-react";
// import { Link } from "react-router-dom";

// const BUBBLES = Array.from({ length: 60 }, (_, i) => ({
//   id: i,
//   size: Math.random() < 0.3 ? 6 : Math.random() < 0.6 ? 4 : 3,
//   left: Math.floor(Math.random() * 100),
//   duration: Math.floor(Math.random() * 25000) + 20000,
//   delay: Math.floor(Math.random() * 8000),
// }));

// function FloatingStars() {
//   return (
//     <div className="pointer-events-none absolute inset-0 overflow-hidden">
//       {BUBBLES.map((b) => (
//         <div
//           key={b.id}
//           style={{
//             position: "absolute",
//             width: b.size,
//             height: b.size,
//             left: `${b.left}vw`,
//             bottom: "-10vh",
//             borderRadius: "50%",
//             backgroundColor: "#ffffff",
//             boxShadow: `
//               0 0 ${b.size * 2}px ${b.size * 0.8}px rgba(255,255,255,0.5),
//               0 0 ${b.size * 4}px ${b.size * 1.5}px rgba(255,255,255,0.15)
//             `,
//             animation: `floatUp ${b.duration}ms ${b.delay}ms infinite linear`,
//           }}
//         />
//       ))}
//       <style>{`
//         @keyframes floatUp {
//           0%   { transform: translateY(0);      opacity: 0;   }
//           10%  { opacity: 1;                                  }
//           90%  { opacity: 0.8;                                }
//           100% { transform: translateY(-120vh); opacity: 0;   }
//         }
//       `}</style>
//     </div>
//   );
// }

// export default function Signup() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const nameRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     nameRef.current?.focus();
//   }, []);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     // API call এখানে করবে
//     setTimeout(() => setIsLoading(false), 2000);
//   };

//   const handleGoogle = () => {
//     console.log("Google signup");
//   };

//   return (
//     <div
//       className="relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden"
//       style={{
//         backgroundImage:
//           "url('https://res.cloudinary.com/gu08e9ha/image/upload/v1783161200/login-bg2_haixef.jpg')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       {/* Dark overlay */}
//       <div className="absolute inset-0 bg-black/20" />

//       {/* Floating Stars */}
//       <FloatingStars />

//       {/* Card */}
//       <div className="relative z-10 w-full max-w-md">
//         <div className="rounded-3xl overflow-hidden shadow-2xl">

//           {/* Top — teal header */}
//           <div className="bg-[#2aa89b] px-8 py-6 text-center relative overflow-hidden">
//             <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
//             <div className="absolute -bottom-8 -left-6 w-24 h-24 rounded-full bg-white/10" />
//             <h1 className="text-2xl font-black text-white mb-1">Verin Decor</h1>
//             <p className="text-white/80 text-sm">Create your account to get started.</p>
//           </div>

//           {/* Bottom — form */}
//           <div className="bg-gray-50 px-8 py-5">
//             <h2 className="text-xl font-black text-gray-900 text-center mb-1">Sign Up</h2>
//             <p className="text-gray-400 text-sm text-center mb-5">
//               Fill in your details to create an account
//             </p>

//             <form onSubmit={handleSubmit} className="space-y-3.5">

//               {/* Full Name */}
//               <input
//                 ref={nameRef}
//                 type="text"
//                 placeholder="Full name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//                 className="
//                   w-full px-5 py-3.5 rounded-2xl
//                   border border-gray-200 bg-white
//                   text-gray-800 placeholder-gray-400 text-sm
//                   focus:outline-none focus:ring-2 focus:ring-[#2aa89b]/40
//                   focus:border-[#2aa89b] transition-all duration-200
//                 "
//               />

//               {/* Email */}
//               <input
//                 type="email"
//                 placeholder="Email address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="
//                   w-full px-5 py-3.5 rounded-2xl
//                   border border-gray-200 bg-white
//                   text-gray-800 placeholder-gray-400 text-sm
//                   focus:outline-none focus:ring-2 focus:ring-[#2aa89b]/40
//                   focus:border-[#2aa89b] transition-all duration-200
//                 "
//               />

//               {/* Phone */}
//               <div className="flex rounded-2xl border border-gray-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#2aa89b]/40 focus-within:border-[#2aa89b] transition-all duration-200">
//                 <span className="flex items-center px-4 text-sm text-gray-500 border-r border-gray-200 bg-gray-50 shrink-0">
//                   +880
//                 </span>
//                 <input
//                   type="tel"
//                   placeholder="Phone number"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   required
//                   className="
//                     flex-1 px-4 py-3.5 bg-transparent
//                     text-gray-800 placeholder-gray-400 text-sm
//                     focus:outline-none
//                   "
//                 />
//               </div>

//               {/* Password */}
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="
//                     w-full px-5 py-3.5 pr-12 rounded-2xl
//                     border border-gray-200 bg-white
//                     text-gray-800 placeholder-gray-400 text-sm
//                     focus:outline-none focus:ring-2 focus:ring-[#2aa89b]/40
//                     focus:border-[#2aa89b] transition-all duration-200
//                   "
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2aa89b] hover:text-[#1e8a7e] transition-colors"
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>

//               {/* Confirm Password */}
//               <div className="relative">
//                 <input
//                   type={showConfirm ? "text" : "password"}
//                   placeholder="Confirm password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   required
//                   className="
//                     w-full px-5 py-3.5 pr-12 rounded-2xl
//                     border border-gray-200 bg-white
//                     text-gray-800 placeholder-gray-400 text-sm
//                     focus:outline-none focus:ring-2 focus:ring-[#2aa89b]/40
//                     focus:border-[#2aa89b] transition-all duration-200
//                   "
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirm(!showConfirm)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2aa89b] hover:text-[#1e8a7e] transition-colors"
//                 >
//                   {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>

//               {/* Sign Up Button */}
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="
//                   w-full py-3.5 rounded-2xl
//                   bg-[#2aa89b] hover:bg-[#1e8a7e]
//                   text-white font-bold text-sm
//                   flex items-center justify-center gap-2
//                   transition-all duration-200
//                   disabled:opacity-70 disabled:cursor-not-allowed
//                   shadow-lg shadow-[#2aa89b]/30
//                 "
//               >
//                 {isLoading ? (
//                   <>
//                     <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
//                     </svg>
//                     Creating account...
//                   </>
//                 ) : (
//                   <>Create Account <UserPlus size={16} /></>
//                 )}
//               </button>

//               {/* Divider */}
//               <div className="flex items-center gap-3">
//                 <div className="flex-1 h-px bg-gray-200" />
//                 <span className="text-xs text-gray-400 font-medium">OR</span>
//                 <div className="flex-1 h-px bg-gray-200" />
//               </div>

//               {/* Google Signup */}
//               <button
//                 type="button"
//                 onClick={handleGoogle}
//                 className="
//                   w-full py-3.5 rounded-2xl
//                   bg-white hover:bg-gray-50
//                   text-gray-700 font-semibold text-sm
//                   flex items-center justify-center gap-3
//                   border border-gray-200
//                   transition-all duration-200 shadow-sm hover:shadow-md
//                 "
//               >
//                 <svg width="18" height="18" viewBox="0 0 48 48">
//                   <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
//                   <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
//                   <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
//                   <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
//                 </svg>
//                 Continue with Google
//               </button>
//             </form>

//             {/* Secure note */}
//             <div className="mt-4 flex items-center justify-center gap-2 bg-gray-100 rounded-full py-2.5 px-5">
//               <ShieldHalf size={14} className="text-gray-400" />
//               <span className="text-xs text-gray-400 font-medium">Your data is safe with us</span>
//             </div>

//             {/* Already have account */}
//             <div className="mt-4 text-center">
//               <p className="text-sm text-gray-500">
//                 Already have an account?{" "}
//                 <Link
//                   to="/login"
//                   className="font-bold text-[#2aa89b] hover:text-[#1e8a7e] transition-colors underline underline-offset-2"
//                 >
//                   Sign In
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }