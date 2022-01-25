import Nullstack from 'nullstack';

import Submenu from './components/Admin/Submenu.njs';
import Button from './components/Button.njs'
import StoreBanner from './components/StoreBanner.njs';

class Components extends Nullstack {

  submenu = [
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
  ]

  storeBanner = {
    storeName: 'Subdomain\'s NFTs',
    avatar: 'https://via.placeholder.com/130',
    banner: 'https://via.placeholder.com/1440x368',
    statistcs: [
      {
        name: 'items',
        value: '03'
      },
      {
        name: 'owner',
        value: '1'
      },
      {
        name: 'floor price',
        value: '---'
      },
      {
        name: 'volume traded',
        value: '0.00'
      },
    ]
  }
  
  prepare() {
    // your code goes here
  }
  
  async initiate() {
    // your code goes here
  }
  
  async hydrate() {
    // your code goes here
  }
  
  render() {
    return (
      <>
        <div> Components </div>
        <StoreBanner data={this.storeBanner}/>
        {/* <Submenu data={this.submenu} /> */}
        {/* <Button>Some Button</Button>
        <Button variant="outline" color="#818CF8">Some Button</Button> */}
      </>
    )
  }

}

export default Components;