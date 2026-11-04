import { createFileRoute } from "@tanstack/react-router";
import bg from "@/assets/liquid-bg.jpg";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { Projects } from "@/components/portfolio/Projects";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nizam Giofandi — Portfolio" },
      { name: "description", content: "Personal portfolio of Nizam Giofandi, web designer and developer." },
      { property: "og:title", content: "Nizam Giofandi — Portfolio" },
      { property: "og:description", content: "Personal portfolio of Nizam Giofandi, web designer and developer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans">
      <img
        src={bg}
        alt=""
        aria-hidden
        width={1920}
        height={1088}
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover"
      />
      <Nav />
      <main>
        <Hero />
        <Projects />
      </main>
      <footer className="pb-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Nizam Giofandi
      </footer>
    </div>
  );
}
