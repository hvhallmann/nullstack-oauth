import Nullstack from 'nullstack';
import Sortable from 'sortablejs'

import DragIcon from '../../assets/icons/DragIcon';
import Edit from '../../assets/icons/Edit';
import Info from '../../assets/icons/Info';
import Remove from '../../assets/icons/Remove';
import Search from '../../assets/icons/Search';
import ListIcon from '../../assets/icons/List'


import './Collection.scss'
import DefaultButton from '../../buttons/Default';

class CollectionsAdmin extends Nullstack {

  collections = [
    {
      _id: 'tnXYxqwHMCbI',
      name: 'ROBOTS THAT KILL PEOPLe TO DEATH',
      shopId: '234af0x',
      order: 1,
    },
    {
      _id: 'jnQZSCvn2e2D',
      name: 'SPACESHIPS THAT SHIP TO SPACE',
      shopId: '234af0x',
      order: 2,
    },
    {
      _id: 'vix8h10ZqpYp',
      name: 'FUTURE PARADISE',
      shopId: '234af0x',
      order: 3,
    },
    {
      _id: 'eYy7EKJQWTVp',
      name: 'WAIFUS FOR SALE',
      shopId: '234af0x',
      order: 4,
    },
  ]

  async hydrate({self}) {
    const selector = self.element.querySelector('#list_item');
    new Sortable(selector, {
      animation: 350,
      chosenClass: "sortable-chosen",
      dragClass: "sortable-drag",
      handle: '.drag-handle'
    });
  }
  
  renderSideBar() {
    return (
      <div>
        <div class="flex flex-row items-center p-3 bg-gray-100">
          <ListIcon />
          <h2 class="ml-4 font-bold uppercase">NFTS</h2>
        </div>
        <ul class="divide-y-2">
          <li class="p-3">
            <a class="uppercase font-semibold text-sm" href="/store/collections">
              Collections
            </a>
          </li>
          <li class="p-3">
            <a class="uppercase font-semibold text-sm" href="/store/traits">
              Traits
            </a>
          </li>
        </ul>
        <div class="flex flex-row items-center p-3 bg-gray-100">
          <ListIcon />
          <h2 class="ml-4 font-bold uppercase">Store Settings</h2>
        </div>
        <ul class="divide-y-2">
          <li class="p-3">
            <a class="uppercase font-semibold text-sm" href="/store/theme-options">
              Theme Options
            </a>
          </li>
          <li class="p-3">
            <a class="uppercase font-semibold text-sm" href="/store/blockchains">
              Blockchains
            </a>
          </li>
          <li class="p-3">
            <a class="uppercase font-semibold text-sm" href="/store/admins">
              Admins
            </a>
          </li>
        </ul>
      </div>
    )
  }

  renderCollectionRow({ data }) {
    return (
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <DragIcon class="h-6 w-6 drag-handle cursor-move" />
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-700 uppercase">
                { data.name }
              </div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 flex justify-end whitespace-nowrap items-center gap-2">
          <a href="#"><Search class="h-5 w-5" /></a>
          <a href="#"><Info class="h-5 w-5" /></a>
          <a href="#"><Remove class="h-6 w-6" /></a>
          <a href="#"><Edit class="h-6 w-6" /></a>
        </td>
      </tr>
    )
  }

  render() {
    return (
      <div class="grid grid-cols-12 gap-8 max-w-7xl mx-auto mt-16">
        <section class="hidden md:block col-span-3">
          <SideBar />
        </section>
        <main class="flex flex-col col-span-9">
          <div class="px-6 flex flex-col justify-start">
            <div class="flex flex-row items-start justify-between mb-12">
              <h1 class="font-semibold text-3xl text-secondary-800">
                Collections List
              </h1>
              <DefaultButton>Create Collection</DefaultButton>
            </div>
            <div class="flex flex-col mt-4">
              <table class="min-w-full divide-y divide-gray-200">
                <tbody class="bg-white" id="list_item">
                  {
                    this.collections.map(collection => <CollectionRow data={collection} />)
                  }
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    )  
  }
}

export default CollectionsAdmin;
