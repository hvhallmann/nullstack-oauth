import Nullstack from 'nullstack';

import StoreBanner from './layout/StoreBanner';

class Collection extends Nullstack {

  // initiate({ params }) {
  //   if(params.username) {
  //     this.tokens = await this.getUserTokens()
  //   }
  // }
  tokens = []

  storeBanner = {
    storeName: 'Subdomain\'s NFTs',
    avatar: 'https://via.placeholder.com/130',
    banner: 'https://via.placeholder.com/1440x368',
    statistics: {
      total: {
        name: 'total items',
        value: '03'
      },
      owned: {
        name: 'items owned by you',
        value: '1'
      },
      forSale: {
        name: 'for sale',
        value: '10'
      },
      forAuction: {
        name: 'for auction',
        value: '0.00'
      },
    }
  }

  renderStats() {

  }

  render() {
    return (
      <div>
        <div>
          <StoreBanner data={this.storeBanner} />
        </div>
        <div class="flex">
            <div class="w-3/12">                
            <TraitControl />
          </div>
          <div>
            {this.tokens.map((token) => <TokenCard token={token} />)}
          </div>
        </div>
        <Stats />
      </div>
    )
  }

}

export default Collection;