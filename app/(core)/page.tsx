import Image from "next/image";

export default function Landing() {
  return (
    <main>
      <section className="">
        <div className="min-h-[calc(100svh-8rem)] mt-8 sm:mt-16 px-4 py-10 flex flex-col gap-5 items-center justify-center sm:gap-6">
          <Image
            src="/logos/chaosfest.png"
            alt="Chaosfest Logo"
            width={800}
            height={400}
            priority
            className="h-auto w-[90%] max-w-[800px] object-contain mx-auto sm:w-3/5 sm:max-w-[60vw]"
          />
          <h3 className="text-gray-50 main-font font-bold mx-auto text-center text-2xl leading-tight sm:text-4xl">9 - 11 July 2027 | SINGAPORE</h3>
          <p className="text-gray-50 main-font font-bold mx-auto text-lg text-center sm:text-2xl">South East Asia's biggest <br />Tabletop Game & Tabletop RPG Event</p>
        </div>
      </section>
      <section className="bg-[#f7e7cb] relative px-4 py-16 overflow-hidden">
        <Image
          src="/images/koel-the-myna.png"
          alt="Chaotic Stupid GM Logo"
          width={145}
          height={131}
          className="pointer-events-none absolute top-4 -left-12 z-0 h-40 w-40 rotate-230 object-contain opacity-20 sm:rotate-150 sm:top-auto sm:-bottom-31 sm:left-1/5 sm:right-auto sm:h-full sm:w-40 sm:max-w-[50%] sm:opacity-100"
        />
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 sm:flex-row sm:gap-12">
          <Image
            src="/logos/chaosfest-wordmark.png"
            alt="Chaosfest Wordmark"
            width={352}
            height={98}
            className="h-auto w-full max-w-xs object-contain sm:h-full sm:w-90 sm:max-w-[50%]"
          />
          <p className="main-font text-center text-xl sm:text-left sm:text-2xl">
            Chaosfest is a 3-day convention designed to become Southeast Asia's anchor tabletop and TTRPG event:
            a platform that brings publishers, retailers, creators
            and fans together in Singapore.
          </p>
        </div>
      </section>
      <section className="relative px-4 py-16 overflow-hidden">
        <h3 className="text-white text-4xl text-center font-serif sm:text-6xl">SHOW FLOOR</h3>
        <p className="mt-6 max-w-3xl mx-auto text-white text-base text-center font-serif sm:mt-10 sm:text-lg">
          The floor combines entertainment, organised play, industry and retail, consumer vendors and an artist alley, a main stage, and sponsor and community programmes.
        </p>
      </section>
    </main>
  );
}
