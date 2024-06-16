export default function CoinInfo() {
  return (
    <div className="w-full bg-yellow-100">
      <div className="h-14 bg-yellow-200">코인정보</div>
      <div className="flex">
        <div className="w-80">orderBook</div>
        <div className="w-full bg-yellow-300">
          <div className="flex flex-col">
            <div className="h-[42px] bg-yellow-400">tab1</div>
            <div className="h-10 bg-yellow-500">tab2</div>
            <div className="h-[440px] bg-yellow-600">chart</div>
          </div>
          <div className="flex flex-col">
            <div className="bg-blue-100 h-12">tab</div>
            <div className="bg-blue-200 h-[295px]">order</div>
          </div>
        </div>
      </div>
    </div>
  );
}
