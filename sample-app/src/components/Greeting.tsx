type GreetingProps = {
  name: string;
};

export default function Greeting({ name }: GreetingProps) {
  return <h1>Hello, {name}</h1>;
}
