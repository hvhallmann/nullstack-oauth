import Nullstack from 'nullstack';
import Color from 'color'

class Button extends Nullstack {
  
  render({ variant = 'solid', children, color='#22C55E', textColor = '#FFFFFF', ...rest}) {

    const hoverColor = new Color(color).lighten(0.08).hex()

    return (
      <>
        { variant === 'outline'
          ? <button
              onmouseover={(proxy) => {
                proxy.event.target.style.borderColor=hoverColor
                proxy.event.target.style.color=hoverColor
              }}
              onmouseout={(proxy) => {
                proxy.event.target.style.borderColor=color
                proxy.event.target.style.color=color
              }}
              style={`border-color: ${color}; color: ${color}`}
              class={`py-1.5 px-3 border-2 rounded-md font-semibold`}
              {...rest}>
                {children}
            </button>
          : <button
              onmouseover={(proxy) => {
                proxy.event.target.style.backgroundColor=hoverColor
              }}
              onmouseout={(proxy) => {
                proxy.event.target.style.backgroundColor=color
              }}
              style={`background-color: ${color}; color: ${textColor}`}
              class={`py-2 px-3 ${textColor} rounded-md font-semibold`}
              {...rest}>
                {children}
            </button>
        }
      </>
    )
  }

}

export default Button;