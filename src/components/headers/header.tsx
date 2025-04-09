import Card from "../cards/card";

export default function Header() {
  return (
    <div className="header h-screen shadow relative w-full">
      <div className="absolute bottom-9 right-4">
        <Card />
      </div>
    </div>
  );
}
