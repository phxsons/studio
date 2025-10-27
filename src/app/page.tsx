import AppShell from "@/components/app-shell";

export default function Home() {
  return (
    <AppShell title="RoadHog">
      <div className="relative h-full w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1694580511925-bfca6bb34020?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxtYXAlMjByb3V0ZXxlbnwwfHx8fDE3NjE0NjUwMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080')" }}
        >
          <div className="flex h-full w-full flex-col items-center justify-center bg-black/50">
            <h1 className="text-4xl font-bold text-white">Let's get our next journey started!</h1>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
