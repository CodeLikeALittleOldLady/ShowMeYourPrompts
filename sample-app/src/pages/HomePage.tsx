// Imports with the "@" alias, the way Lovable projects do, so the tests
// prove the example config resolves it.
import Greeting from "@/components/Greeting";

export default function HomePage() {
  return (
    <main>
      <Greeting name="world" />
      <img src="/plate.png" alt="A blue and white plate" />
      <form>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" />
        <button type="submit">Sign up</button>
      </form>
    </main>
  );
}
