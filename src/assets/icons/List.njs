export default function List({ class: classNames = ''}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="12"
      viewBox="0 0 21 12"
      fill="none"
      class={classNames}
    >
      <line x1="4" y1="1" x2="21" y2="1" stroke="#1F2937" stroke-width="2"/>
      <path d="M4.00012 6H21.0001" stroke="#1F2937" stroke-width="2"/>
      <path d="M4 11H21" stroke="#1F2937" stroke-width="2"/>
      <circle cx="1" cy="1" r="1" fill="#1F2937"/>
      <circle cx="1" cy="6" r="1" fill="#1F2937"/>
      <circle cx="1" cy="11" r="1" fill="#1F2937"/>
    </svg>
  )
}