"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";

export default function EmailForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await emailjs.send(
        "service_uurm7wk", // Service ID
        "template_qlp424a", // Template ID
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        "1OWpjZGG90Jmx-8ak" // Public Key
      );

      alert("Mensagem enviada com sucesso!");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar mensagem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto w-full px-4 py-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Entre em contato</h2>
      <p className="text-[var(--foreground)]/70 mb-8">
        Envie-nos uma mensagem com suas dúvidas, sugestões ou feedback.
      </p>
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 max-w-lg bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-2xl"
      >
        <input
          type="text"
          name="name"
          placeholder="Seu nome"
          value={form.name}
          onChange={handleChange}
          className="px-4 py-2 rounded-lg border border-[var(--card-border)] bg-transparent"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Seu e-mail"
          value={form.email}
          onChange={handleChange}
          className="px-4 py-2 rounded-lg border border-[var(--card-border)] bg-transparent"
          required
        />
        <textarea
          name="message"
          placeholder="Sua mensagem"
          value={form.message}
          onChange={handleChange}
          rows={5}
          className="px-4 py-2 rounded-lg border border-[var(--card-border)] bg-transparent"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#0066FF] via-[#00D4AA] to-[#00D4D4] text-white hover:opacity-95 disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Enviar mensagem"}
        </button>
      </form>
    </section>
  );
}
