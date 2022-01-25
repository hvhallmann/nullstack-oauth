import Nullstack from 'nullstack';

class Button extends Nullstack {
  
  render({ variant = 'solid', children, ...rest}) {
    return (
      <>
        { variant === 'solid'
          ? <button class="py-2 px-3 bg-green-500 hover:bg-green-400 text-white rounded-md" {...rest}>{children}</button>
          : <button class="py-2 px-3 border-2 text-sky-600 border-sky-600 rounded-md" {...rest}>{children}</button>
        }
      </>
    )
  }

}

export default Button;