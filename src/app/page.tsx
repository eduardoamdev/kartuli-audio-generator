import Button from "@/components/ui/Button";
import type { ActivityCards } from "../types/cards";

const activityCards: ActivityCards = [
  {
    href: "/material-generators/image-lesson/generator",
    variant: "blue",
    icon: "🔊",
    eyebrow: "Improve your listening",
    title: "Audio Library",
    description:
      "Daily life conversations, read aloud by native speakers and organized by topic and level.",
  },
  {
    href: "/material-generators/conversation-lesson/generator",
    variant: "purple",
    icon: "🤖",
    eyebrow: "Create your own conversations",
    title: "Conversation Generator",
    description:
      "Craft custom dialogues with AI for any topic, level, or scenario you choose.",
  },
  {
    href: "/material-generators/video-lesson/generator",
    variant: "teal",
    icon: "📚",
    eyebrow: "Review grammar and vocabulary",
    title: "Grammar Library",
    description:
      "Comprehensive grammar explanations and examples, organized by topic and level.",
  },
];

/**
 * The landing page of the application.
 * Displays various activity generation options for users to choose from.
 *
 * @returns {JSX.Element} The rendered homepage with navigation buttons.
 */
export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.2),_transparent_28%),radial-gradient(circle_at_80%_18%,_rgba(245,158,11,0.18),_transparent_24%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.18),_transparent_34%)]" />
      <div className="absolute left-1/2 top-28 h-72 w-72 -translate-x-1/2 rounded-full bg-[#38bdf8]/10 blur-3xl" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 py-10 sm:px-8 lg:px-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <section className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#dbeafe] backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
              Kartuli Lesson Studio
            </div>

            <div className="space-y-5">
              <p className="max-w-xl text-sm uppercase tracking-[0.28em] text-[#7dd3fc]">
                Create and downloads kartuli audio materials anywhere, anytime.
              </p>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Download useful audios to boost your listening skills and
                improve your speaking flow.
              </h1>
            </div>
          </section>

          <section className="relative">
            <div className="absolute inset-x-8 inset-y-6 rounded-[2rem] bg-[linear-gradient(135deg,rgba(56,189,248,0.2),rgba(245,158,11,0.12))] blur-2xl" />
            <div className="relative rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(8,15,30,0.9),rgba(10,18,32,0.72))] p-6 shadow-[0_28px_120px_rgba(2,6,23,0.55)] backdrop-blur-xl sm:p-8">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                    What do you want to do today?
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                {activityCards.map((activity) => (
                  <Button
                    key={activity.href}
                    href={activity.href}
                    variant={activity.variant}
                    icon={activity.icon}
                    eyebrow={activity.eyebrow}
                    description={activity.description}
                  >
                    {activity.title}
                  </Button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
