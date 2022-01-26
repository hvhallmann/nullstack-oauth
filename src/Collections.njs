import Nullstack from 'nullstack';
import Sortable from 'sortablejs'

class Collections extends Nullstack {
  
  prepare() {
    // your code goes here
  }
  
  async initiate() {
    // your code goes here
  }
  
  async hydrate({self}) {
    const selector = self.element.querySelector('#list_item');
    new Sortable(selector, {
      animation: 350,
      chosenClass: "sortable-chosen",
      dragClass: "sortable-drag"
    });
    console.log(selector)
  }
  
  render() {
    return (
      <section class="my-10">
        <div class="flex flex-col">
          <div class="-my-2 overflow-x-auto sm:-mx-6 lg:px-8">
            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div class="overflow-hidden shadow-md bg-white rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-md text-gray-500 capitalize tracking-wider">
                            #
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-md text-gray-500 capitalize tracking-wider">
                        Track/artist
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-md text-gray-500 capitalize tracking-wider">
                        album
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-md text-gray-500 capitalize tracking-wider">
                        time
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-md text-gray-500 capitalize tracking-wider">
                        views
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white" id="list_item">
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          01
                        </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-10 w-10">
                            <img class="h-10 w-10 rounded-full object-cover" src="https://via.placeholder.com/50" alt="the-weekend" />
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-700 capitalize">
                              Pray for me
                            </div>
                            <div class="text-xs text-gray-400 capitalize">
                              The Weekend
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-700 capitalize">Black Panther</div>
                        </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                          <span class="text-sm text-gray-600 leading-5 px-2 inline-flex">4:39</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                          <span class="text-sm text-purple-700 capitalize">1.8 Bilion</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          02
                        </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-10 w-10">
                            <img class="h-10 w-10 rounded-full object-cover" src="https://via.placeholder.com/50" alt="the-weekend" />
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-700 capitalize">
                              Pray for me
                            </div>
                            <div class="text-xs text-gray-400 capitalize">
                              The Weekend
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-700 capitalize">Black Panther</div>
                        </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                          <span class="text-sm text-gray-600 leading-5 px-2 inline-flex">4:39</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                          <span class="text-sm text-purple-700 capitalize">1.8 Bilion</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          03
                        </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-10 w-10">
                            <img class="h-10 w-10 rounded-full object-cover" src="https://via.placeholder.com/50" alt="the-weekend" />
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-700 capitalize">
                              Pray for me
                            </div>
                            <div class="text-xs text-gray-400 capitalize">
                              The Weekend
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-700 capitalize">Black Panther</div>
                        </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                          <span class="text-sm text-gray-600 leading-5 px-2 inline-flex">4:39</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                          <span class="text-sm text-purple-700 capitalize">1.8 Bilion</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

}

export default Collections;