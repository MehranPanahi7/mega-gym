export default function PlanPage() {
  return (
    <div className="flex justify-center w-full items-center p-5 m-4">
      <div className="flex justify-center items-center w-full p-4">
        <ul className="grid grid-cols-3 gap-4">
          <li className="border-2 border-blue-300 shadow-lg p-3 rounded-md">
            <p className="flex justify-center items-center flex-col gap-4">
              <span>name:{}</span>
              <span>skill:{}</span>
            </p>
          </li>
          <li className="border-2 border-blue-300 shadow-lg p-3 rounded-md">
            <p className="flex justify-center items-center flex-col gap-4">
              <span>name:{}</span>
              <span>skill:{}</span>
            </p>
          </li>
          <li className="border-2 border-blue-300 shadow-lg p-3 rounded-md">
            <p className="flex justify-center items-center flex-col gap-4">
              <span>name:{}</span>
              <span>skill:{}</span>
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
