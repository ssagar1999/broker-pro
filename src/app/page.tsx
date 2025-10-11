import { AuthCard } from "../components/home/auth-card"

  export default function Page() {
  return (
    <main className="min-h-[100dvh] bg-background">
      {/* Center the sign-in card */}
      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-12 md:grid-cols-2 md:min-h-[100dvh] md:items-stretch">
        <div className="relative h-[240px] w-full overflow-hidden rounded-lg border bg-card md:h-full">
          <img
             style={{filter: 'brightness(0.7)'}}
            src="https://www.tbsprop.com/wp-content/uploads/2025/02/1130-maple-ave-building-1.webp"
            alt="Contemporary home exterior with large windows"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <div className="inline-flex max-w-[85%] flex-col rounded-md border bg-background/70 p-3 shadow-sm backdrop-blur">
              <h2 className="text-pretty text-sm font-medium text-foreground md:text-base">
                List and manage properties
              </h2>
              <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                Add new listings, update details, and browse inventory from one place.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center md:h-full">
          <div className="w-full max-w-sm space-y-4">
            <h1 className="text-pretty text-xl font-semibold text-foreground md:text-2xl">Broker Portal</h1>
            <p className="text-sm text-muted-foreground">
              List properties, manage your portfolio, and browse listings. Sign in to continue.
            </p>
            <AuthCard />
          </div>
        </div>
      </section>
    </main>
  )
}
