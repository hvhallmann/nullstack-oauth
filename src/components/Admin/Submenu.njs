import Nullstack from 'nullstack';

import ListIcon from '../../icons/ListIcon'


class Submenu extends Nullstack {

  //Sample data from parent
  /* submenu = [
    {
      name: 'Nfts',
      items: [
        {
          name: 'Collections',
          url: '/collections'
        },
        {
          name: 'Traits',
          url: '/traits'
        },
      ]
    },
    {
      name: 'Store Settings',
      items: [
        {
          name: 'Theme Options',
          url: '/theme-options'
        },
        {
          name: 'Blockchains',
          url: '/blockchains'
        },
        {
          name: 'Admins',
          url: '/admins'
        },
      ]
    },
  ] */
  
  render({ data }) {
    return (
      <div>
        { data.map(menu => {
          return (
            <>
              <div class="flex flex-row items-center p-3 bg-gray-200">
                <ListIcon />
                <h2 class="ml-4 font-bold uppercase">{menu.name}</h2>
              </div>
              <ul class="divide-y-2">
                { menu.items.map(item => {
                  return (
                    <li class="p-3">
                      <a class="uppercase font-semibold text-sm" href={item.url}>
                        { item.name }
                      </a>
                    </li>
                  )
                }) }
              </ul>
            </>
          )
        }) }
      </div>
    )
  }

}

export default Submenu;