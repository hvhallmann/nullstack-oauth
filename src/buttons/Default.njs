export default function DefaultButton({children, onclick}) {
  return (
    <button
      class={"py-1.5 px-3 border-2 rounded-md font-semibold border-indigo-400 hover:border-indigo-300 text-indigo-700 hover:text-indigo-600"}
      onclick={onclick}
    >
      {children}
    </button>
  );
}
