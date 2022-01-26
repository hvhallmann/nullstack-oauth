export default function DangerButton({children, onclick}) {
  return (
    <button
      class={"py-2 px-3 rounded-md font-semibold text-white bg-red-500 hover:bg-red-400"}
      onclick={onclick}
    >
      {children}
    </button>
  );
}
