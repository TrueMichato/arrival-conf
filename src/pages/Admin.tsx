export default function Admin() {
  return (
    <>
      <div
        className="bg-cover min-h-screen flex justify-center items-center"
        style={{ backgroundImage: `url('./background.png')` }}
      >
        <div className="text-center font-bold text-4xl">
          אינך מורשה להיות כאן 🚫
        </div>
      </div>
    </>
  );
}
// TODO - create access to the DB and check if the user is an admin
