import { GlassCard, spring } from "./GlassCard";

const projects = [
  { title: "Project One", tag: "Web App", desc: "A short description of this project goes here." },
  { title: "Project Two", tag: "Brand", desc: "A short description of this project goes here." },
  { title: "Project Three", tag: "Mobile", desc: "A short description of this project goes here." },
  { title: "Project Four", tag: "Design System", desc: "A short description of this project goes here." },
  { title: "Project Five", tag: "E-commerce", desc: "A short description of this project goes here." },
  { title: "Project Six", tag: "Experiment", desc: "A short description of this project goes here." },
];

export function Projects() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">Selected Work</h2>
        <p className="mt-3 text-muted-foreground">Projects coming soon.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <GlassCard
            key={p.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ ...spring, delay: (i % 3) * 0.08 }}
            className="cursor-pointer p-5"
          >
            <div className="glass aspect-[4/3] rounded-2xl" />
            <span className="mt-5 inline-block text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {p.tag}
            </span>
            <h3 className="mt-1 text-xl font-semibold">{p.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
