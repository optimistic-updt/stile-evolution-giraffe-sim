import GiraffeSimulation from "@/components/giraffe-simulation";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-white max-w-3xl mx-auto">
      <div className="flex w-full h-40 bg-gray-100 flex-col justify-end p-4">
        <h1 className="text-3xl md:text-4xl font-bold max-w-3xl">
          1.4 Lesson: Natural Selection
        </h1>
      </div>

      <section className="mb-8 mt-8 text-base md:text-lg space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Natural Selection
        </h2>

        <p>
          To understand how evolution works, we need to bring together three
          ideas from previous lessons:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Common descent</strong> is the idea that all living things
            on Earth are descended from a common ancestor.
          </li>
          <li>
            <strong>Random genetic variation</strong> arises from one generation
            to the next.
          </li>
          <li>
            <strong>Adaptations</strong> are traits that help an organism
            survive.
          </li>
        </ul>

        <p>
          In any generation, there is some genetic variation within a
          population. Some individuals have genetic traits that make them better
          adapted to their environment. This means they are more likely to
          survive and reproduce, allowing them to pass on that adaptation to the
          next generation.
        </p>

        <p>
          The increased survival and reproduction of organisms that are better
          adapted to their environment is called{" "}
          <strong>natural selection</strong>. This is the main reason why
          populations evolve over many generations.
        </p>

        <figure>
          <div className="bg-gray-100 p-4 rounded-lg h-72">
            image placeholder
          </div>
          <figcaption className="w-full">
            Adaptations help organisms survive in their particular environment,
            like the camouflage of the Vietnamese mossy frog.
          </figcaption>
        </figure>

        <figure>
          <div className="bg-gray-100 p-4 rounded-lg h-72">
            image placeholder
          </div>
          <figcaption>
            Predators like the osprey are one selection pressure that can drive
            evolution. Anything that affects an organism's ability to survive in
            its particular environment is called a{" "}
            <strong>selection pressure</strong>. Examples include:
          </figcaption>
        </figure>

        <ul className="list-disc pl-6 space-y-1">
          <li>
            Availability of resources, such as food, shelter, territory and
            mates
          </li>
          <li>
            Environmental factors, such as temperature and weather conditions
          </li>
          <li>Vulnerability to predators and diseases</li>
        </ul>

        <p>
          Selection pressures can either increase or decrease the occurrence of
          a genetic trait over many generations.
        </p>
      </section>

      <section className="mb-8 mt-8 text-base md:text-lg space-y-4 italic">
        Add a couple of questions where students must pick which animal is
        better camouflage using real photo
      </section>

      <p className="mb-6 text-base md:text-lg ">
        Watch how giraffes with different neck heights compete for food. Those
        that can reach the leaves survive, while those that cannot will
        disappear.
      </p>
      <GiraffeSimulation />
    </main>
  );
}
