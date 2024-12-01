import { ServerStartupWizard } from './ServerStartupWizard'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 text-center">Server Startup Wizard</h1>
      <ServerStartupWizard />
    </main>
  )
}

