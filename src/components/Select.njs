import Nullstack from 'nullstack';

class Select extends Nullstack {
  
  render({ name, value, label, error, children, ...rest }) {
    return (
      <div class="flex flex-col">
        <div class="flex justify-between items-end">
          { label && <label class="font-semibold mb-1">{label}</label>}
          { error && <small class="mb-1 text-red-500">{ error }</small> }
        </div>
        <select name={name} value={value} class="py-2 px-3 border border-gray-300 rounded-md" {...rest}>
          { children }
        </select>
      </div>
    )
  }

}

export default Select;