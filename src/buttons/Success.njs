export default function SuccessButton({children, onclick}) {
  return (
    <button
      class={"py-2 px-3 rounded-md font-semibold text-white bg-green-500 hover:bg-green-400"}
      onclick={onclick}
    >
      {children}
    </button>
  );
}
