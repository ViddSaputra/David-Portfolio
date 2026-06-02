import { Hero }           from "@/components/sections/Hero"
import { About }          from "@/components/sections/About"
import { Skills }         from "@/components/sections/Skills"
import { Projects }       from "@/components/sections/Projects"
import { Certifications } from "@/components/sections/Certifications"
import { Contact }        from "@/components/sections/Contact"

export default function Page() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Certifications />
      <Contact />
    </>
  )
}
