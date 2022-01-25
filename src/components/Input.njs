import Nullstack from 'nullstack';

class Input extends Nullstack {
  
  render({ label, name, value = "", error, labelHelper, ...rest }) {
    return (
      <div class="flex flex-col">
        <div class="flex justify-between items-end">
          { label && <label class="font-semibold mb-1">{ label }</label> }
          { error ? <small class="mb-1 text-red-500">{ error }</small> : labelHelper && <small class="mb-1 text-gray-400 bold">{ labelHelper }</small>}
        </div>
        <input name={name} value={value} class="py-2 px-3 border border-gray-300 rounded-md" {...rest} />
      </div>
    )
  }

}

export default Input;