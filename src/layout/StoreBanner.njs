
function Banner({ src }) {
  return (
    <div style="padding-bottom: 25%" class="relative w-full">
      <div class="absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex items-center justify-center">
        <img class="h-full w-full" src={ src } alt="Store Banner"/>
      </div>
    </div>
  )
}

function Statistic({ key = '', statistics }) {
  return (
    // <div class="grid grid-cols-4 bg-white rounded-lg border-2 border-gray-100 divide-gray-100 divide-x drop-shadow-md">
      // { statistcs.map(statistic => {
            <div class="py-4 lg:py-6 px-2 md:px-3 lg:px-7 text-center">
              <p class="font-bold text-gray-700 text-2xl mb-2">{ statistics[key].value }</p>
              <p class="text-gray-400 text-sm font-normal">{ statistics[key].name }</p>
            </div>
      // }) }
    // </div>
  )
}

export default function StoreBanner({ data }) {
  return (
    <>
      <Banner src={data.banner} />
      <div class="-mt-72 relative z-20">
        <div 
            class="flex flex-col items-center mt-44 sm:mt-36 md:mt-24 lg:mt-12 xl:mt-0 gap-2 sm:gap-6 md:gap-4 lg:gap-6 xl:gap-8"
          >
          <img class="rounded-full border-white border-2 shadow-white shadow hidden md:block w-20 lg:w-28 xl:w-32" src={ data.avatar } alt={ data.storeName } />
          <h2 class="text-white text-3xl font-bold drop-shadow-md">{ data.storeName }</h2>
          <div class="grid grid-cols-4 bg-white rounded-lg border-2 border-gray-100 divide-gray-100 divide-x drop-shadow-md">
            <Statistic statistics={data.statistics} key="total" />
            <Statistic statistics={data.statistics} key="owned" />
            <Statistic statistics={data.statistics} key="forSale" />
            <Statistic statistics={data.statistics} key="forAuction" />
          </div>
        </div>
      </div>
    </>
  )
}