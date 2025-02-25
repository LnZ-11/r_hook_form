"use client"
import { useForm } from "react-hook-form";
import { useState } from "react";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";


export default function ContactForm() {
    // Define the schema for the form with zod
  const formSchema = z.object({
    name: z.string().nonempty(),
    email: z.string().email("invalide format").nonempty(),
    message: z.string().nonempty(),
  });
    // typing the form data
  type FormData = z.infer<typeof formSchema>;
    // use react-hook-form
  const { register, handleSubmit, formState:{errors,isSubmitting},} = useForm<FormData>({resolver:zodResolver(formSchema)});
    // logging results
  const [feedback, setFeedback] = useState("");
  const onSubmit = async (data: FormData) => {
    setFeedback("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur d'envoi");
      setFeedback("✅ Email envoyé !");
    } catch (error) {
      setFeedback("❌ Erreur lors de l'envoi");
      console.log(error);
    }
  };
  return (
    <form  className="flex justify-center items-center min-h-screen bg-gray-100 text-black" onSubmit={handleSubmit(onSubmit)}>
      <div  className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-sm space-y-4" >
        <div className="flex-row text-center">
          <h2 className="text-2xl font-bold text-gray-700 text-center" >Name</h2>
          <input 
            type="text" 
            id="name" 
            {...register("name")}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your name"
          />
          {
            //error message display
          }
          {errors.name && (<p className="text-red-500 text-sm">{errors.name.message}</p>)}
        </div>
        <div className="flex-row text-center">
          <h2 className="text-2xl font-bold text-gray-700 text-center">Email</h2>
          <input 
            type="email" 
            id="email" 
            {...register("email",)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your email"
          />
          {errors.email && (<p className="text-red-500 text-sm">{errors.email.message}</p>)}
        </div>
        <div className="flex-row text-center">
          <h2 className="text-2xl font-bold text-gray-700 text-center">Message</h2>
          <textarea 
              id="message" 
              {...register("message")}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your message"
          />
          {errors.message && (<p className="text-red-500 text-sm">{errors.message.message}</p>)}
        </div>

        {/* Feedback */}
        {feedback && <p className="text-center font-medium">{feedback}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-white py-3 rounded-lg font-semibold transition-all ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          {isSubmitting ? "Envoi..." : "Envoyer"}
        </button>
      </div>
    </form>
  )
}